import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../auth/useAuth';
import { useNavigate } from 'react-router-dom';

interface WriteReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    serviceName?: string;
    serviceId?: number;
    onSubmitSuccess?: () => void;
}

export function WriteReviewModal({
    isOpen,
    onClose,
    serviceName = '',
    serviceId: _serviceId,
    onSubmitSuccess,
}: WriteReviewModalProps) {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');
    const [hasCompletedBooking, setHasCompletedBooking] = useState<boolean | null>(null);
    const [isCheckingBooking, setIsCheckingBooking] = useState(false);

    // Check if user has completed booking for this service
    const checkCompletedBooking = async (_svcId: number) => {
        try {
            setIsCheckingBooking(true);
            // Mock API call to check if user has completed booking
            await new Promise((resolve) => setTimeout(resolve, 800));

            // Mock: Assume user has completed booking for demo purposes
            // In real implementation: await api.checkCompletedBooking(user.id, _svcId);
            const hasCompleted = true; // Change to false to test
            setHasCompletedBooking(hasCompleted);
        } catch {
            setHasCompletedBooking(false);
        } finally {
            setIsCheckingBooking(false);
        }
    };

    // Check booking status when modal opens (only if authenticated)
    useEffect(() => {
        if (isOpen && isAuthenticated && _serviceId) {
            checkCompletedBooking(_serviceId);
        } else if (isOpen && !isAuthenticated) {
            setHasCompletedBooking(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, isAuthenticated, _serviceId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (rating === 0) {
            setError('Vui lòng chọn số sao đánh giá');
            return;
        }

        if (comment.trim().length < 10) {
            setError('Nội dung đánh giá phải có ít nhất 10 ký tự');
            return;
        }

        try {
            setIsSubmitting(true);

            // Mock API call - simulate submission
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // In real app: await submitReview({ rating, comment, serviceId });

            setShowSuccess(true);

            setTimeout(() => {
                setShowSuccess(false);
                onSubmitSuccess?.();
                handleClose();
            }, 2000);
        } catch {
            setError('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setRating(0);
            setHoverRating(0);
            setComment('');
            setError('');
            setShowSuccess(false);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className='w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto'
                        >
                            {/* Header */}
                            <div className='sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl'>
                                <h2 className='text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent'>
                                    Viết đánh giá
                                </h2>
                                <button
                                    onClick={handleClose}
                                    disabled={isSubmitting}
                                    className='p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50'
                                >
                                    <X className='w-5 h-5 text-gray-600' />
                                </button>
                            </div>

                            {/* Content */}
                            {!isAuthenticated ? (
                                // Not Logged In State
                                <div className='p-6 text-center'>
                                    <div className='w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                                        <AlertCircle className='w-8 h-8 text-pink-600' />
                                    </div>
                                    <h3 className='text-xl font-semibold text-gray-900 mb-2'>Bạn cần đăng nhập</h3>
                                    <p className='text-gray-600 mb-6'>
                                        Vui lòng đăng nhập để viết đánh giá về dịch vụ của chúng tôi
                                    </p>
                                    <div className='flex gap-3'>
                                        <button
                                            onClick={handleClose}
                                            className='flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium'
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleClose();
                                                navigate('/login');
                                            }}
                                            className='flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-shadow font-medium'
                                        >
                                            Đăng nhập
                                        </button>
                                    </div>
                                </div>
                            ) : isCheckingBooking ? (
                                // Checking Booking Status
                                <div className='p-6 text-center py-12'>
                                    <Loader2 className='w-12 h-12 text-pink-500 animate-spin mx-auto mb-4' />
                                    <p className='text-gray-600'>Đang kiểm tra lịch sử đặt hẹn...</p>
                                </div>
                            ) : hasCompletedBooking === false ? (
                                // No Completed Booking State
                                <div className='p-6 text-center'>
                                    <div className='w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                                        <AlertCircle className='w-8 h-8 text-orange-600' />
                                    </div>
                                    <h3 className='text-xl font-semibold text-gray-900 mb-2'>Chưa thể đánh giá</h3>
                                    <p className='text-gray-600 mb-6'>
                                        Bạn cần hoàn thành ít nhất 1 lần sử dụng dịch vụ này trước khi có thể viết đánh
                                        giá.
                                    </p>
                                    <div className='flex gap-3'>
                                        <button
                                            onClick={handleClose}
                                            className='flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium'
                                        >
                                            Đóng
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleClose();
                                                navigate('/booking', { state: { serviceId: _serviceId, serviceName } });
                                            }}
                                            className='flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-shadow font-medium'
                                        >
                                            Đặt lịch ngay
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // Logged In & Has Completed Booking - Show Review Form
                                <form onSubmit={handleSubmit} className='p-6 space-y-6'>
                                    {/* Service Name */}
                                    {serviceName && (
                                        <div className='bg-pink-50 rounded-lg p-4'>
                                            <p className='text-sm text-gray-600 mb-1'>Dịch vụ:</p>
                                            <p className='font-semibold text-gray-900'>{serviceName}</p>
                                        </div>
                                    )}

                                    {/* Rating Stars */}
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-3'>
                                            Đánh giá của bạn <span className='text-red-500'>*</span>
                                        </label>
                                        <div className='flex items-center gap-2'>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type='button'
                                                    onClick={() => setRating(star)}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    className='transition-transform hover:scale-110'
                                                >
                                                    <Star
                                                        className={`w-10 h-10 ${
                                                            star <= (hoverRating || rating)
                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                : 'text-gray-300'
                                                        }`}
                                                    />
                                                </button>
                                            ))}
                                            {rating > 0 && (
                                                <span className='ml-2 text-sm font-medium text-gray-600'>
                                                    {rating === 5 && 'Xuất sắc'}
                                                    {rating === 4 && 'Tốt'}
                                                    {rating === 3 && 'Trung bình'}
                                                    {rating === 2 && 'Tệ'}
                                                    {rating === 1 && 'Rất tệ'}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Comment */}
                                    <div>
                                        <label
                                            htmlFor='comment'
                                            className='block text-sm font-medium text-gray-700 mb-2'
                                        >
                                            Nội dung đánh giá <span className='text-red-500'>*</span>
                                        </label>
                                        <textarea
                                            id='comment'
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder='Chia sẻ trải nghiệm của bạn về dịch vụ này...'
                                            rows={5}
                                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none'
                                            disabled={isSubmitting}
                                        />
                                        <p className='mt-1 text-xs text-gray-500'>
                                            Tối thiểu 10 ký tự ({comment.length}/500)
                                        </p>
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm'
                                        >
                                            {error}
                                        </motion.div>
                                    )}

                                    {/* Success Message */}
                                    {showSuccess && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className='bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3'
                                        >
                                            <CheckCircle className='w-6 h-6 text-green-500 flex-shrink-0' />
                                            <div>
                                                <p className='font-semibold text-green-900'>Gửi đánh giá thành công!</p>
                                                <p className='text-sm text-green-700'>
                                                    Cảm ơn bạn đã chia sẻ trải nghiệm.
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Buttons */}
                                    <div className='flex gap-3 pt-4'>
                                        <button
                                            type='button'
                                            onClick={handleClose}
                                            disabled={isSubmitting}
                                            className='flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium'
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type='submit'
                                            disabled={isSubmitting || showSuccess}
                                            className='flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 font-medium flex items-center justify-center gap-2'
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className='w-5 h-5 animate-spin' />
                                                    Đang gửi...
                                                </>
                                            ) : (
                                                'Gửi đánh giá'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
