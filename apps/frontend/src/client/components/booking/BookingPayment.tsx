import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ArrowLeftIcon, CreditCardIcon, BanknoteIcon, CheckCircleIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BookingStepProps } from './types';

interface PaymentOption {
    id: 'ATM' | 'CLINIC' | 'WALLET' | 'CASH' | 'BANK_TRANSFER';
    label: string;
    description: string;
    icon: React.ReactNode;
}

export function BookingPayment({ bookingData, updateBookingData, onNext, onPrev }: BookingStepProps) {
    const { t } = useTranslation('common');
    const [selectedPayment, setSelectedPayment] = useState<'ATM' | 'CLINIC' | 'WALLET' | 'CASH' | 'BANK_TRANSFER'>(
        (bookingData.paymentMethod as any) || 'CLINIC',
    );
    const [isProcessing, setIsProcessing] = useState(false);

    // Calculate total from services
    let subtotal = 0;
    if (bookingData.selectedServices && bookingData.selectedServices.length > 0) {
        // Calculate from actual selected services with real prices
        subtotal = bookingData.selectedServices.reduce((sum, service) => {
            const price = typeof service.price === 'number' ? service.price : parseFloat(String(service.price)) || 0;
            return sum + price;
        }, 0);
    } else if (bookingData.service?.price) {
        // Fallback to single service if no selectedServices
        const price =
            typeof bookingData.service.price === 'number'
                ? bookingData.service.price
                : parseFloat(String(bookingData.service.price)) || 0;
        subtotal = price;
    }

    const tax = Math.round(subtotal * 0.08);
    const total = subtotal + tax;

    const paymentOptions: PaymentOption[] = [
        {
            id: 'CLINIC',
            label: t('payment.payAtClinic') || 'Pay at Clinic',
            description: 'Pay directly when you visit',
            icon: <BanknoteIcon className='w-6 h-6' />,
        },
        {
            id: 'ATM',
            label: 'VNPay',
            description: 'Pay online via VNPay gateway',
            icon: <CreditCardIcon className='w-6 h-6' />,
        },
        {
            id: 'WALLET',
            label: t('payment.eWallet') || 'E-Wallet',
            description: 'Momo, Zalopay (Coming Soon)',
            icon: <BanknoteIcon className='w-6 h-6' />,
        },
    ];

    const handleSelectPayment = (paymentType: 'ATM' | 'CLINIC' | 'WALLET' | 'CASH' | 'BANK_TRANSFER') => {
        setSelectedPayment(paymentType);
        updateBookingData({ paymentMethod: paymentType });
    };

    const handleConfirmPayment = async () => {
        setIsProcessing(true);
        try {
            // Update booking data with payment info
            updateBookingData({
                paymentMethod: selectedPayment,
            });

            // Proceed to next step
            await new Promise((resolve) => setTimeout(resolve, 500));
            onNext();
        } catch (error) {
            console.error('Error confirming payment:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 20,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            exit={{
                opacity: 0,
                y: -20,
            }}
            transition={{
                duration: 0.5,
            }}
        >
            <div className='mb-8'>
                <h2 className='text-2xl font-bold text-gray-800 mb-2'>
                    {t('payment.selectPaymentMethod') || 'Payment Method'}
                </h2>
                <p className='text-gray-600'>{'Choose how you want to pay for your appointment'}</p>
            </div>

            {/* Payment Options Grid */}
            <div className='grid md:grid-cols-3 gap-4 mb-8'>
                {paymentOptions.map((option) => {
                    const isDisabled = option.id === 'WALLET'; // Disable E-Wallet (coming soon)
                    return (
                        <motion.button
                            key={option.id}
                            whileHover={{ scale: isDisabled ? 1 : 1.02 }}
                            whileTap={{ scale: isDisabled ? 1 : 0.98 }}
                            onClick={() => !isDisabled && handleSelectPayment(option.id)}
                            disabled={isDisabled}
                            className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
                                isDisabled
                                    ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                                    : selectedPayment === option.id
                                    ? 'border-pink-500 bg-pink-50 shadow-lg'
                                    : 'border-gray-200 bg-white hover:border-pink-200'
                            }`}
                        >
                            <div
                                className={`flex items-center gap-3 mb-3 ${
                                    isDisabled
                                        ? 'text-gray-300'
                                        : selectedPayment === option.id
                                        ? 'text-pink-600'
                                        : 'text-gray-400'
                                }`}
                            >
                                {option.icon}
                                <h3 className={`font-semibold ${isDisabled ? 'text-gray-400' : 'text-gray-800'}`}>
                                    {option.label}
                                </h3>
                            </div>
                            <p className={`text-sm ${isDisabled ? 'text-gray-400' : 'text-gray-500'}`}>
                                {option.description}
                            </p>

                            {selectedPayment === option.id && !isDisabled && (
                                <div className='absolute top-3 right-3'>
                                    <CheckCircleIcon className='w-5 h-5 text-pink-500' />
                                </div>
                            )}

                            {isDisabled && (
                                <div className='absolute top-3 right-3'>
                                    <span className='text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full'>
                                        Coming Soon
                                    </span>
                                </div>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Order Summary */}
            <div className='bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 p-6 mb-8'>
                <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                    {t('payment.orderSummary') || 'Order Summary'}
                </h3>

                <div className='space-y-3 mb-4'>
                    <div className='flex justify-between text-gray-600'>
                        <span>{t('payment.subtotal') || 'Subtotal'}</span>
                        <span className='font-medium'>₫ {subtotal.toLocaleString()}</span>
                    </div>
                    <div className='flex justify-between text-gray-600'>
                        <span>{t('payment.tax') || 'Tax (8%)'}</span>
                        <span className='font-medium'>₫ {tax.toLocaleString()}</span>
                    </div>
                </div>

                <div className='border-t pt-3 flex justify-between'>
                    <span className='font-semibold text-gray-800'>{t('payment.total') || 'Total'}</span>
                    <span className='text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent'>
                        ₫ {total.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Payment Details Info */}
            {selectedPayment === 'CLINIC' && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='bg-blue-50 rounded-2xl p-4 mb-8 border border-blue-200'
                >
                    <p className='text-sm text-blue-800'>
                        <span className='font-semibold'>💳 Pay at Clinic:</span> You can pay when you arrive at our
                        clinic. We accept cash and card payments.
                    </p>
                </motion.div>
            )}

            {selectedPayment === 'ATM' && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4 mb-8 border border-pink-200'
                >
                    <p className='text-sm text-gray-800'>
                        <span className='font-semibold'>🏦 VNPay Payment:</span> You will be redirected to VNPay secure
                        payment gateway to complete your payment. Supports ATM cards, Visa, Mastercard, and Internet
                        Banking.
                    </p>
                </motion.div>
            )}

            {/* Action Buttons */}
            <div className='flex gap-4'>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onPrev}
                    className='flex items-center gap-2 px-8 py-4 bg-white border-2 border-pink-200 text-gray-700 rounded-full font-semibold shadow-lg'
                >
                    <ArrowLeftIcon className='w-5 h-5' />
                    {t('common.back') || 'Back'}
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleConfirmPayment}
                    disabled={isProcessing || !selectedPayment}
                    className={`flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold shadow-xl ${
                        isProcessing || !selectedPayment
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-2xl'
                    }`}
                >
                    {isProcessing ? (
                        <>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className='w-5 h-5 border-2 border-white border-t-transparent rounded-full'
                            />
                            Processing...
                        </>
                    ) : (
                        <>
                            {t('common.continue') || 'Continue'}
                            <ArrowRightIcon className='w-5 h-5' />
                        </>
                    )}
                </motion.button>
            </div>
        </motion.div>
    );
}
