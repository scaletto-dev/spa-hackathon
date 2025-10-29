import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Loader2, CheckCircle, MessageCircle, PenSquare } from 'lucide-react';
import { getReviews, type Review, type ReviewsResponse } from '../../api/adapters/reviews';
import { WriteReviewModal } from '../components/reviews/WriteReviewModal';

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState<ReviewsResponse['stats'] | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');

    useEffect(() => {
        loadReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, selectedRating, sortBy]);

    const loadReviews = async () => {
        try {
            setIsLoading(true);
            const response = await getReviews({
                page: currentPage,
                limit: 6,
                ...(selectedRating && { rating: selectedRating }),
                sortBy,
                sortOrder: 'desc',
            });
            setReviews(response.data);
            setStats(response.stats);
            setTotalPages(response.meta.totalPages);
        } catch (error) {
            console.error('Load reviews error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRatingFilter = (rating: number | null) => {
        setSelectedRating(rating);
        setCurrentPage(1); // Reset to page 1 when filter changes
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getPercentage = (count: number, total: number) => {
        return Math.round((count / total) * 100);
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pt-24 pb-16'>
            <div className='max-w-7xl mx-auto px-4'>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-center mb-12'
                >
                    <h1 className='text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4'>
                        Đánh giá từ khách hàng
                    </h1>
                    <p className='text-lg text-gray-600 mb-6'>
                        Trải nghiệm thực tế từ những người đã sử dụng dịch vụ của chúng tôi
                    </p>
                    <button
                        onClick={() => setIsWriteModalOpen(true)}
                        className='inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow'
                    >
                        <PenSquare className='w-5 h-5' />
                        Viết đánh giá
                    </button>
                </motion.div>

                {/* Stats Section */}
                {stats && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className='bg-white rounded-2xl shadow-xl p-8 mb-8'
                    >
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                            {/* Average Rating */}
                            <div className='text-center'>
                                <div className='text-6xl font-bold text-pink-600 mb-2'>
                                    {stats.averageRating.toFixed(1)}
                                </div>
                                <div className='flex items-center justify-center gap-1 mb-2'>
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-6 h-6 ${
                                                i < Math.floor(stats.averageRating)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <p className='text-gray-600'>Dựa trên {stats.totalReviews} đánh giá</p>
                            </div>

                            {/* Rating Distribution */}
                            <div className='space-y-2'>
                                {[5, 4, 3, 2, 1].map((rating) => {
                                    const count =
                                        stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution];
                                    const percentage = getPercentage(count, stats.totalReviews);
                                    return (
                                        <button
                                            key={rating}
                                            onClick={() =>
                                                handleRatingFilter(selectedRating === rating ? null : rating)
                                            }
                                            className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                                                selectedRating === rating
                                                    ? 'bg-pink-100 border-2 border-pink-500'
                                                    : 'hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className='flex items-center gap-1 w-16'>
                                                <span className='text-sm font-medium'>{rating}</span>
                                                <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                                            </div>
                                            <div className='flex-1 h-2 bg-gray-200 rounded-full overflow-hidden'>
                                                <div
                                                    className='h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all'
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <span className='text-sm text-gray-600 w-12 text-right'>{count}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Filter & Sort Bar */}
                <div className='flex flex-wrap items-center justify-between gap-4 mb-6'>
                    <div className='flex items-center gap-2'>
                        <span className='text-sm font-medium text-gray-600'>Lọc theo:</span>
                        <button
                            onClick={() => handleRatingFilter(null)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                selectedRating === null
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            Tất cả
                        </button>
                        {[5, 4, 3].map((rating) => (
                            <button
                                key={rating}
                                onClick={() => handleRatingFilter(rating)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                                    selectedRating === rating
                                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {rating} <Star className='w-4 h-4' />
                            </button>
                        ))}
                    </div>

                    <div className='flex items-center gap-2'>
                        <span className='text-sm font-medium text-gray-600'>Sắp xếp:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'date' | 'rating')}
                            className='px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent'
                        >
                            <option value='date'>Mới nhất</option>
                            <option value='rating'>Điểm cao nhất</option>
                        </select>
                    </div>
                </div>

                {/* Reviews Grid */}
                {isLoading ? (
                    <div className='flex items-center justify-center py-20'>
                        <Loader2 className='w-8 h-8 text-pink-500 animate-spin' />
                        <span className='ml-3 text-gray-600'>Đang tải đánh giá...</span>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className='text-center py-20'>
                        <p className='text-gray-600 mb-4'>Không tìm thấy đánh giá phù hợp</p>
                        <button
                            onClick={() => handleRatingFilter(null)}
                            className='px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors'
                        >
                            Xem tất cả đánh giá
                        </button>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                        {reviews.map((review, index) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className='bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow'
                            >
                                {/* Review Header */}
                                <div className='flex items-start gap-4 mb-4'>
                                    <img
                                        src={review.customerAvatar}
                                        alt={review.customerName}
                                        className='w-12 h-12 rounded-full object-cover'
                                    />
                                    <div className='flex-1'>
                                        <div className='flex items-center gap-2 mb-1'>
                                            <h3 className='font-semibold text-gray-900'>{review.customerName}</h3>
                                            {review.verified && (
                                                <div className='inline-flex' title='Đã xác thực'>
                                                    <CheckCircle className='w-4 h-4 text-green-500' />
                                                </div>
                                            )}
                                        </div>
                                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                                            <span>{formatDate(review.date)}</span>
                                            <span>•</span>
                                            <span>{review.service}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Rating Stars */}
                                <div className='flex items-center gap-1 mb-3'>
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${
                                                i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>

                                {/* Review Comment */}
                                <p className='text-gray-700 leading-relaxed mb-4'>{review.comment}</p>

                                {/* Branch */}
                                <p className='text-sm text-gray-500 mb-3'>📍 {review.branch}</p>

                                {/* Admin Reply */}
                                {review.reply && (
                                    <div className='mt-4 pt-4 border-t border-gray-200'>
                                        <div className='flex items-start gap-3 bg-pink-50 rounded-lg p-4'>
                                            <MessageCircle className='w-5 h-5 text-pink-600 flex-shrink-0 mt-1' />
                                            <div>
                                                <p className='text-sm font-semibold text-pink-800 mb-1'>
                                                    Phản hồi từ Beauty Clinic Care
                                                </p>
                                                <p className='text-sm text-gray-700 mb-2'>{review.reply}</p>
                                                {review.replyDate && (
                                                    <p className='text-xs text-gray-500'>
                                                        {formatDate(review.replyDate)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!isLoading && totalPages > 1 && (
                    <div className='flex items-center justify-center gap-4'>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className='p-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                        >
                            <ChevronLeft className='w-5 h-5 text-gray-600' />
                        </button>

                        <div className='flex items-center gap-2'>
                            {[...Array(totalPages)].map((_, index) => {
                                const page = index + 1;
                                return (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                                            currentPage === page
                                                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className='p-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                        >
                            <ChevronRight className='w-5 h-5 text-gray-600' />
                        </button>
                    </div>
                )}
            </div>

            {/* Write Review Modal */}
            <WriteReviewModal
                isOpen={isWriteModalOpen}
                onClose={() => setIsWriteModalOpen(false)}
                onSubmitSuccess={() => {
                    loadReviews(); // Refresh reviews after submission
                }}
            />
        </div>
    );
}
