/**
 * VNPay Service
 *
 * Handles VNPay payment gateway integration
 * - Create payment URLs
 * - Verify IPN (Instant Payment Notification)
 * - Verify return URLs
 */

import { VNPay, ignoreLogger, ProductCode, HashAlgorithm, VnpLocale } from 'vnpay';
import logger from '../config/logger';
import prisma from '../config/database';
import { NotFoundError, ValidationError } from '../utils/errors';

// VNPay Configuration
const VNPAY_CONFIG = {
    tmnCode: process.env.VNPAY_TMN_CODE || '',
    secureSecret: process.env.VNPAY_SECRET_KEY || '',
    vnpayHost: process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn',
    testMode: process.env.NODE_ENV !== 'production',
    hashAlgorithm: HashAlgorithm.SHA512,
    enableLog: process.env.NODE_ENV === 'development',
    ...(process.env.NODE_ENV !== 'development' && { loggerFn: ignoreLogger }),
};

interface CreatePaymentUrlParams {
    bookingId: string;
    amount: number;
    orderInfo: string;
    ipAddr: string;
    locale?: 'vn' | 'en';
    bankCode?: string;
}

interface VNPayReturnQuery {
    vnp_TmnCode: string;
    vnp_Amount: string;
    vnp_BankCode: string;
    vnp_BankTranNo: string;
    vnp_CardType: string;
    vnp_OrderInfo: string;
    vnp_PayDate: string;
    vnp_ResponseCode: string;
    vnp_TxnRef: string;
    vnp_TransactionNo: string;
    vnp_TransactionStatus: string;
    vnp_SecureHash: string;
    [key: string]: string;
}

interface VerifyReturnResult {
    isSuccess: boolean;
    isVerified: boolean;
    bookingId: string;
    transactionNo?: string;
    amount?: number;
    message: string;
    responseCode?: string;
}

class VNPayService {
    private vnpay: VNPay;
    private returnUrl: string;
    private ipnUrl: string;

    constructor() {
        // Validate configuration
        if (!VNPAY_CONFIG.tmnCode || !VNPAY_CONFIG.secureSecret) {
            logger.warn('VNPay configuration is missing. Payment features will not work.');
        }

        this.vnpay = new VNPay(VNPAY_CONFIG);

        // Set URLs from environment or use defaults
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        this.returnUrl = process.env.VNPAY_RETURN_URL || `${baseUrl}/booking/payment-result`;
        this.ipnUrl =
            process.env.VNPAY_IPN_URL ||
            `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/v1/payments/vnpay/ipn`;

        logger.info('VNPay Service initialized', {
            testMode: VNPAY_CONFIG.testMode,
            returnUrl: this.returnUrl,
            ipnUrl: this.ipnUrl,
        });
    }

    /**
     * Create VNPay payment URL
     */
    async createPaymentUrl(params: CreatePaymentUrlParams): Promise<string> {
        try {
            const { bookingId, amount, orderInfo, ipAddr, locale = 'vn', bankCode } = params;

            // Validate booking exists
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: { payments: true },
            });

            if (!booking) {
                throw new NotFoundError(`Booking not found: ${bookingId}`);
            }

            // Check if payment already exists and is pending
            const existingPayment = booking.payments.find((p) => p.status === 'PENDING');
            if (!existingPayment) {
                throw new ValidationError('No pending payment found for this booking');
            }

            // Create payment URL
            const paymentUrl = this.vnpay.buildPaymentUrl({
                vnp_Amount: amount,
                vnp_IpAddr: ipAddr,
                vnp_TxnRef: bookingId, // Use bookingId as transaction reference
                vnp_OrderInfo: orderInfo,
                vnp_OrderType: ProductCode.Other,
                vnp_ReturnUrl: this.returnUrl,
                vnp_Locale: locale === 'en' ? VnpLocale.EN : VnpLocale.VN,
                ...(bankCode && { vnp_BankCode: bankCode }),
            });

            logger.info(`VNPay payment URL created for booking ${bookingId}`, {
                amount,
                paymentUrl: paymentUrl.substring(0, 100) + '...',
            });

            return paymentUrl;
        } catch (error) {
            logger.error('Error creating VNPay payment URL:', error);
            throw error;
        }
    }

    /**
     * Verify VNPay return URL from customer redirect
     */
    async verifyReturnUrl(query: VNPayReturnQuery): Promise<VerifyReturnResult> {
        try {
            // Verify signature
            const verify = this.vnpay.verifyReturnUrl(query);

            const bookingId = query.vnp_TxnRef;
            const responseCode = query.vnp_ResponseCode;
            const transactionNo = query.vnp_TransactionNo;
            const amount = parseInt(query.vnp_Amount, 10) / 100; // VNPay returns amount * 100

            logger.info('VNPay return URL verification:', {
                bookingId,
                responseCode,
                transactionNo,
                isVerified: verify.isVerified,
                isSuccess: verify.isSuccess,
            });

            if (!verify.isVerified) {
                return {
                    isSuccess: false,
                    isVerified: false,
                    bookingId,
                    message: 'Invalid signature',
                    responseCode,
                };
            }

            if (!verify.isSuccess) {
                return {
                    isSuccess: false,
                    isVerified: true,
                    bookingId,
                    transactionNo,
                    amount,
                    message: verify.message || 'Payment failed',
                    responseCode,
                };
            }

            // Payment successful - update database
            await this.updatePaymentStatus(bookingId, 'COMPLETED', transactionNo, amount);

            return {
                isSuccess: true,
                isVerified: true,
                bookingId,
                transactionNo,
                amount,
                message: 'Payment successful',
                responseCode: '00',
            };
        } catch (error) {
            logger.error('Error verifying VNPay return URL:', error);
            throw error;
        }
    }

    /**
     * Verify VNPay IPN (Instant Payment Notification)
     * This is called by VNPay server to confirm payment
     */
    async verifyIPN(query: VNPayReturnQuery): Promise<{ RspCode: string; Message: string }> {
        try {
            const verify = this.vnpay.verifyReturnUrl(query);
            const bookingId = query.vnp_TxnRef;
            const responseCode = query.vnp_ResponseCode;
            const transactionNo = query.vnp_TransactionNo;
            const amount = parseInt(query.vnp_Amount, 10) / 100;

            logger.info('VNPay IPN received:', {
                bookingId,
                responseCode,
                transactionNo,
                isVerified: verify.isVerified,
                isSuccess: verify.isSuccess,
            });

            // Check signature
            if (!verify.isVerified) {
                return { RspCode: '97', Message: 'Invalid signature' };
            }

            // Check if booking exists
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: { payments: true },
            });

            if (!booking) {
                return { RspCode: '01', Message: 'Booking not found' };
            }

            // Check if payment already processed
            const payment = booking.payments.find((p) => p.transactionId === transactionNo);
            if (payment && payment.status === 'COMPLETED') {
                return { RspCode: '02', Message: 'Payment already processed' };
            }

            // Check if payment was successful
            if (verify.isSuccess && responseCode === '00') {
                await this.updatePaymentStatus(bookingId, 'COMPLETED', transactionNo, amount);
                return { RspCode: '00', Message: 'Success' };
            } else {
                await this.updatePaymentStatus(bookingId, 'FAILED', transactionNo, amount);
                return { RspCode: '00', Message: 'Confirmed failure' };
            }
        } catch (error) {
            logger.error('Error verifying VNPay IPN:', error);
            return { RspCode: '99', Message: 'Unknown error' };
        }
    }

    /**
     * Update payment status in database
     */
    private async updatePaymentStatus(
        bookingId: string,
        status: 'COMPLETED' | 'FAILED',
        transactionId: string,
        amount?: number,
    ): Promise<void> {
        try {
            // Find the pending payment for this booking
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: { payments: true },
            });

            if (!booking) {
                throw new NotFoundError(`Booking not found: ${bookingId}`);
            }

            const pendingPayment = booking.payments.find((p) => p.status === 'PENDING');

            if (pendingPayment) {
                // Update the pending payment
                await prisma.payment.update({
                    where: { id: pendingPayment.id },
                    data: {
                        status,
                        transactionId,
                        ...(amount && { amount }),
                        updatedAt: new Date(),
                    },
                });

                logger.info(`Payment updated for booking ${bookingId}:`, {
                    paymentId: pendingPayment.id,
                    status,
                    transactionId,
                });
            } else {
                logger.warn(`No pending payment found for booking ${bookingId}`);
            }
        } catch (error) {
            logger.error('Error updating payment status:', error);
            throw error;
        }
    }

    /**
     * Get payment status by booking ID
     */
    async getPaymentStatus(bookingId: string): Promise<any> {
        try {
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: { payments: true },
            });

            if (!booking) {
                throw new NotFoundError(`Booking not found: ${bookingId}`);
            }

            return {
                bookingId: booking.id,
                referenceNumber: booking.referenceNumber,
                payments: booking.payments,
            };
        } catch (error) {
            logger.error('Error getting payment status:', error);
            throw error;
        }
    }
}

export default new VNPayService();
