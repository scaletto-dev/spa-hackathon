import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StarIcon, QuoteIcon, Loader2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getReviews, type Review } from '../../../api/adapters/reviews';

export function Testimonials() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalReviews, setTotalReviews] = useState(0);

    const loadReviews = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await getReviews({
                page: 1,
                limit: 3,
                rating: 5, // Only 5-star reviews for testimonials
                sortBy: 'date',
                sortOrder: 'desc',
            });

            if (!response.success) {
                throw new Error('Failed to load reviews');
            }

            setReviews(response.data);
            setTotalReviews(response.meta.total);
        } catch (error) {
            console.error('Failed to load reviews:', error);
            setError('Không thể tải đánh giá. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadReviews();
    }, []);
    return (
        <section className='w-full py-24 px-6 bg-gradient-to-b from-transparent to-pink-50/30'>
            <div className='max-w-7xl mx-auto'>
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
                    transition={{
                        duration: 0.6,
                    }}
                    className='text-center mb-16'
                >
                    <h2 className='text-5xl font-bold mb-4'>
                        <span className='bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent'>
                            Client Stories
                        </span>
                    </h2>
                    <p className='text-gray-600 text-lg'>
                        {totalReviews > 0
                            ? `Over ${totalReviews.toLocaleString()}+ satisfied clients trust us with their beauty journey`
                            : 'Over 10,000 satisfied clients trust us with their beauty journey'}
                    </p>
                </motion.div>

                {isLoading ? (
                    <div className='flex items-center justify-center py-20'>
                        <Loader2 className='w-8 h-8 text-pink-500 animate-spin' />
                        <span className='ml-3 text-gray-600'>Đang tải đánh giá...</span>
                    </div>
                ) : error ? (
                    <div className='text-center py-20'>
                        <p className='text-red-500'>{error}</p>
                        <button 
                            onClick={() => loadReviews()} 
                            className='mt-4 text-pink-500 hover:text-pink-600 underline'
                        >
                            Thử lại
                        </button>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className='text-center py-20'>
                        <p className='text-gray-600'>Chưa có đánh giá nào</p>
                    </div>
                ) : (
                    <div className='grid md:grid-cols-3 gap-8'>
                        {reviews.map((review, index) => (
                            <motion.div
                                key={review.id}
                                initial={{
                                    opacity: 0,
                                    y: 30,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                viewport={{
                                    once: true,
                                }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                }}
                                whileHover={{
                                    y: -5,
                                }}
                                className='relative'
                            >
                                <div className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-8 h-full'>
                                    <QuoteIcon className='w-10 h-10 text-pink-300 mb-4' />
                                    <div className='flex gap-1 mb-4'>
                                        {[...Array(review.rating)].map((_, i) => (
                                            <StarIcon key={i} className='w-5 h-5 fill-yellow-400 text-yellow-400' />
                                        ))}
                                    </div>
                                    <p className='text-gray-700 leading-relaxed mb-6 line-clamp-4'>{review.reviewText}</p>
                                    <div className='flex items-center gap-4'>
                                        {review.customerAvatar ? (
                                            <img
                                                src={review.customerAvatar}
                                                alt={review.customerName}
                                                className='w-14 h-14 rounded-full object-cover border-2 border-pink-200'
                                            />
                                        ) : (
                                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center border-2 border-pink-200">
                                                <span className="text-xl font-semibold text-pink-500">
                                                    {review.customerName.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <div className='flex items-center gap-2'>
                                                <p className='font-semibold text-gray-800'>{review.customerName}</p>
                                                {review.approved && <CheckCircle className='w-4 h-4 text-green-500' />}
                                            </div>
                                            <p className='text-sm text-gray-500'>
                                                {review.service?.name || 'Verified Client'}
                                            </p>
                                        </div>
                                    </div>
                                    {review.adminResponse && (
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <p className="text-sm text-gray-600 italic">
                                                <span className="font-medium text-pink-600">Reply:</span> {review.adminResponse}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* View All Reviews Button */}
                <div className='text-center mt-12'>
                    <Link
                        to='/reviews'
                        className='inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105'
                    >
                        Xem tất cả {totalReviews} đánh giá
                    </Link>
                </div>
            </div>
        </section>
    );
}
