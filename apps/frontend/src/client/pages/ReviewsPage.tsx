import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Loader2, MessageCircle, PenSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { reviewsApi, type Review } from '../../services/reviewsApi';
import { WriteReviewModal } from '../components/reviews/WriteReviewModal';

interface ReviewStats {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
}

export default function ReviewsPage() {
    const { t, i18n } = useTranslation('common');
    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState<ReviewStats | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState<'recent' | 'rating'>('recent');

    useEffect(() => {
        loadReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, sortBy]);

    const loadReviews = async () => {
        try {
            setIsLoading(true);
            
            // Fetch reviews with filters
            const response = await reviewsApi.getAllReviews({
                page: currentPage,
                limit: 6,
                sort: sortBy,
            });
            
            setReviews(response.data);
            setTotalPages(response.meta.totalPages);
            
            // Calculate stats from all reviews (fetch all to get accurate stats)
            const allReviewsResponse = await reviewsApi.getAllReviews({
                page: 1,
                limit: 100, // Get all reviews for stats
                sort: 'recent',
            });
            
            const allReviews = allReviewsResponse.data;
            const totalReviews = allReviews.length;
            
            if (totalReviews > 0) {
                const ratingDistribution = {
                    1: allReviews.filter(r => r.rating === 1).length,
                    2: allReviews.filter(r => r.rating === 2).length,
                    3: allReviews.filter(r => r.rating === 3).length,
                    4: allReviews.filter(r => r.rating === 4).length,
                    5: allReviews.filter(r => r.rating === 5).length,
                };
                
                const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
                const averageRating = totalRating / totalReviews;
                
                setStats({
                    averageRating: Math.round(averageRating * 10) / 10,
                    totalReviews,
                    ratingDistribution,
                });
            }
        } catch (error) {
            console.error('Load reviews error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
        return date.toLocaleDateString(locale, {
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
                        {t('reviews.title')}
                    </h1>
                    <p className='text-lg text-gray-600 mb-6'>
                        {t('reviews.subtitle')}
                    </p>
                    <button
                        onClick={() => setIsWriteModalOpen(true)}
                        className='inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow'
                    >
                        <PenSquare className='w-5 h-5' />
                        {t('reviews.writeReview')}
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
                                <p className='text-gray-600'>
                                    {t('reviews.basedOn')} {stats.totalReviews} {t('reviews.reviews')}
                                </p>
                            </div>

                            {/* Rating Distribution */}
                            <div className='space-y-2'>
                                {[5, 4, 3, 2, 1].map((rating) => {
                                    const count =
                                        stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution];
                                    const percentage = getPercentage(count, stats.totalReviews);
                                    return (
                                        <div
                                            key={rating}
                                            className='w-full flex items-center gap-3 p-2 rounded-lg'
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
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Sort Bar */}
                <div className='flex items-center justify-end gap-4 mb-6'>
                    <div className='flex items-center gap-2'>
                        <span className='text-sm font-medium text-gray-600'>{t('reviews.sortBy')}:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'recent' | 'rating')}
                            className='px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent'
                        >
                            <option value='recent'>{t('reviews.latest')}</option>
                            <option value='rating'>{t('reviews.highestRating')}</option>
                        </select>
                    </div>
                </div>

                {/* Reviews Grid */}
                {isLoading ? (
                    <div className='flex items-center justify-center py-20'>
                        <Loader2 className='w-8 h-8 text-pink-500 animate-spin' />
                        <span className='ml-3 text-gray-600'>{t('reviews.loading')}</span>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className='text-center py-20'>
                        <p className='text-gray-600 mb-4'>{t('reviews.noReviews')}</p>
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
                                        src={
                                            review.customerAvatar ||
                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(review.customerName)}&background=ec4899&color=fff`
                                        }
                                        alt={review.customerName}
                                        className='w-12 h-12 rounded-full object-cover'
                                    />
                                    <div className='flex-1'>
                                        <div className='flex items-center gap-2 mb-1'>
                                            <h3 className='font-semibold text-gray-900'>{review.customerName}</h3>
                                        </div>
                                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                                            <span>{formatDate(review.createdAt)}</span>
                                            {review.service && (
                                                <>
                                                    <span>•</span>
                                                    <span>{review.service.name}</span>
                                                </>
                                            )}
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

                                {/* Review Text */}
                                <p className='text-gray-700 leading-relaxed mb-4'>{review.reviewText}</p>

                                {/* Admin Response */}
                                {review.adminResponse && (
                                    <div className='mt-4 pt-4 border-t border-gray-200'>
                                        <div className='flex items-start gap-3 bg-pink-50 rounded-lg p-4'>
                                            <MessageCircle className='w-5 h-5 text-pink-600 flex-shrink-0 mt-1' />
                                            <div>
                                                <p className='text-sm font-semibold text-pink-800 mb-1'>
                                                    {t('reviews.response')}
                                                </p>
                                                <p className='text-sm text-gray-700'>{review.adminResponse}</p>
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
