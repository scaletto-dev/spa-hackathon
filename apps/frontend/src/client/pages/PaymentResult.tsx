import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, LoaderIcon, ArrowRightIcon } from 'lucide-react';
import { verifyVNPayReturn, getVNPayPaymentStatus } from '../../services/bookingApi';
import { toast } from '../../utils/toast';

/**
 * Payment Result Page
 * Handles VNPay payment return and displays result
 */
interface PaymentResult {
    isSuccess: boolean;
    isVerified: boolean;
    bookingId: string;
    transactionNo?: string;
    amount?: number;
    message: string;
    responseCode?: string;
}

interface BookingDetails {
    referenceNumber: string;
    [key: string]: unknown;
}

export function PaymentResult() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isVerifying, setIsVerifying] = useState(true);
    const [result, setResult] = useState<PaymentResult | null>(null);
    const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                // Get all query parameters
                const queryParams: Record<string, string> = {};
                searchParams.forEach((value, key) => {
                    queryParams[key] = value;
                });

                console.log('VNPay return query params:', queryParams);

                // Verify with backend
                const verifyResult = await verifyVNPayReturn(queryParams);
                setResult(verifyResult);

                console.log('Verification result:', verifyResult);

                if (verifyResult.isSuccess) {
                    toast.success('Thanh toán thành công!');

                    // Fetch booking details using VNPay payment status API
                    try {
                        const paymentStatus = await getVNPayPaymentStatus(verifyResult.bookingId);
                        setBookingDetails({
                            referenceNumber: paymentStatus.referenceNumber,
                            bookingId: paymentStatus.bookingId,
                            payments: paymentStatus.payments,
                        });
                    } catch (error) {
                        console.error('Error fetching booking details:', error);
                    }
                } else {
                    toast.error(verifyResult.message || 'Thanh toán thất bại');
                }
            } catch (error) {
                console.error('Error verifying payment:', error);
                toast.error('Không thể xác thực thanh toán');
                setResult({
                    isSuccess: false,
                    isVerified: false,
                    bookingId: '',
                    message: 'Lỗi xác thực thanh toán',
                });
            } finally {
                setIsVerifying(false);
            }
        };

        verifyPayment();
    }, [searchParams]);

    if (isVerifying) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4'>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className='text-center'
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className='w-16 h-16 mx-auto mb-4'
                    >
                        <LoaderIcon className='w-16 h-16 text-pink-500' />
                    </motion.div>
                    <h2 className='text-2xl font-bold text-gray-800 mb-2'>Đang xác thực thanh toán...</h2>
                    <p className='text-gray-600'>Vui lòng đợi trong giây lát</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 pt-24 pb-12'>
            <div className='max-w-3xl mx-auto px-6'>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-8'
                >
                    {/* Success or Failure Icon */}
                    <div className='text-center mb-8'>
                        {result?.isSuccess ? (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                                className='inline-block'
                            >
                                <div className='w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-xl shadow-green-500/30'>
                                    <CheckCircleIcon className='w-14 h-14 text-white' />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                                className='inline-block'
                            >
                                <div className='w-24 h-24 mx-auto bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-xl shadow-red-500/30'>
                                    <XCircleIcon className='w-14 h-14 text-white' />
                                </div>
                            </motion.div>
                        )}

                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className={`text-3xl md:text-4xl font-bold mt-6 mb-3 ${
                                result?.isSuccess ? 'text-green-600' : 'text-red-600'
                            }`}
                        >
                            {result?.isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className='text-gray-600 text-lg'
                        >
                            {result?.message}
                        </motion.p>
                    </div>

                    {/* Payment Details */}
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className='space-y-4 mb-8'
                        >
                            <div className='bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6'>
                                <h3 className='text-lg font-semibold text-gray-800 mb-4'>Thông tin thanh toán</h3>
                                <div className='space-y-3'>
                                    {result.transactionNo && (
                                        <div className='flex justify-between items-center py-2 border-b border-gray-200'>
                                            <span className='text-gray-600'>Mã giao dịch:</span>
                                            <span className='font-semibold text-gray-800'>{result.transactionNo}</span>
                                        </div>
                                    )}
                                    {result.amount && (
                                        <div className='flex justify-between items-center py-2 border-b border-gray-200'>
                                            <span className='text-gray-600'>Số tiền:</span>
                                            <span className='font-semibold text-gray-800'>
                                                {result.amount.toLocaleString('vi-VN')} VNĐ
                                            </span>
                                        </div>
                                    )}
                                    {bookingDetails && (
                                        <>
                                            <div className='flex justify-between items-center py-2 border-b border-gray-200'>
                                                <span className='text-gray-600'>Mã đặt lịch:</span>
                                                <span className='font-semibold text-gray-800'>
                                                    #{bookingDetails.referenceNumber}
                                                </span>
                                            </div>
                                            <div className='flex justify-between items-center py-2'>
                                                <span className='text-gray-600'>Trạng thái:</span>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                        result.isSuccess
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                    }`}
                                                >
                                                    {result.isSuccess ? 'Đã thanh toán' : 'Thất bại'}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className='flex flex-col sm:flex-row gap-4'
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/')}
                            className='flex-1 px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all'
                        >
                            Về trang chủ
                        </motion.button>
                        {result?.isSuccess && bookingDetails && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate(`/booking/confirmation?ref=${bookingDetails.referenceNumber}`)}
                                className='flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl font-semibold shadow-lg shadow-pink-500/30 hover:shadow-xl transition-all'
                            >
                                Xem chi tiết đặt lịch
                                <ArrowRightIcon className='w-5 h-5' />
                            </motion.button>
                        )}
                        {!result?.isSuccess && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/booking')}
                                className='flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl font-semibold shadow-lg shadow-pink-500/30 hover:shadow-xl transition-all'
                            >
                                Đặt lịch lại
                                <ArrowRightIcon className='w-5 h-5' />
                            </motion.button>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

export default PaymentResult;
