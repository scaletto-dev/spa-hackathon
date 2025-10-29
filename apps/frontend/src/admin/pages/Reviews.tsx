import React, { useState } from 'react';
import { StarIcon, ThumbsUpIcon, MessageSquareIcon, TrendingUpIcon, FilterIcon } from 'lucide-react';
import { ReviewReplyModal } from '../components/modals/ReviewReplyModal';
const reviews = [
    {
        id: 1,
        customer: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        rating: 5,
        service: 'Luxury Facial Treatment',
        date: '2 days ago',
        comment:
            'Absolutely amazing experience! The therapist was so professional and the results were incredible. My skin has never looked better!',
        sentiment: 'positive',
        replied: true,
    },
    {
        id: 2,
        customer: 'Michael Chen',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        rating: 4,
        service: 'Deep Tissue Massage',
        date: '3 days ago',
        comment:
            'Great massage, very relaxing. The only reason for 4 stars is the waiting area could be more comfortable.',
        sentiment: 'positive',
        replied: false,
    },
    {
        id: 3,
        customer: 'Emily Davis',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
        rating: 5,
        service: 'Hair Styling',
        date: '5 days ago',
        comment:
            'Sophie is a hair magician! She knew exactly what I wanted and delivered perfectly. Will definitely come back!',
        sentiment: 'positive',
        replied: true,
    },
    {
        id: 4,
        customer: 'James Wilson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        rating: 3,
        service: 'Manicure',
        date: '1 week ago',
        comment: 'Service was okay but the appointment started 20 minutes late. The nail work itself was good though.',
        sentiment: 'neutral',
        replied: false,
    },
];
export function Reviews() {
    const [selectedReview, setSelectedReview] = useState<number | null>(null);

    const handleReplySuccess = () => {
        setSelectedReview(null);
        // Modal itself shows toast
    };
    const getSentimentColor = (sentiment: string) => {
        switch (sentiment) {
            case 'positive':
                return 'bg-green-100 text-green-700';
            case 'neutral':
                return 'bg-yellow-100 text-yellow-700';
            case 'negative':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };
    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold text-gray-800'>Reviews & Feedback</h1>
                    <p className='text-gray-600 mt-1'>Manage customer reviews and responses</p>
                </div>
            </div>

            <div className='bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100'>
                <div className='flex items-start justify-between'>
                    <div className='flex items-center gap-2'>
                        <div className='w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center'>
                            <TrendingUpIcon className='w-4 h-4 text-white' />
                        </div>
                        <div>
                            <p className='text-sm font-semibold text-gray-800'>AI Sentiment Analysis</p>
                            <p className='text-xs text-gray-600'>
                                85% positive sentiment this month - up 12% from last month!
                            </p>
                        </div>
                    </div>
                    <span className='text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full'>
                        4.7 avg rating
                    </span>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
                <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100 shadow-sm'>
                    <div className='flex items-center justify-between mb-2'>
                        <h3 className='text-sm text-gray-600'>Total Reviews</h3>
                        <ThumbsUpIcon className='w-5 h-5 text-pink-400' />
                    </div>
                    <p className='text-3xl font-bold text-gray-800'>248</p>
                </div>
                <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100 shadow-sm'>
                    <div className='flex items-center justify-between mb-2'>
                        <h3 className='text-sm text-gray-600'>Positive</h3>
                        <div className='w-2 h-2 bg-green-500 rounded-full' />
                    </div>
                    <p className='text-3xl font-bold text-gray-800'>85%</p>
                </div>
                <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100 shadow-sm'>
                    <div className='flex items-center justify-between mb-2'>
                        <h3 className='text-sm text-gray-600'>Pending Reply</h3>
                        <MessageSquareIcon className='w-5 h-5 text-orange-400' />
                    </div>
                    <p className='text-3xl font-bold text-gray-800'>12</p>
                </div>
                <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100 shadow-sm'>
                    <div className='flex items-center justify-between mb-2'>
                        <h3 className='text-sm text-gray-600'>Avg Response Time</h3>
                        <div className='w-2 h-2 bg-blue-500 rounded-full' />
                    </div>
                    <p className='text-3xl font-bold text-gray-800'>2.4h</p>
                </div>
            </div>

            <div className='bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 shadow-sm'>
                <div className='p-4 border-b border-pink-100 flex items-center gap-4'>
                    <input
                        type='text'
                        placeholder='Search reviews...'
                        className='flex-1 px-4 py-2 rounded-lg bg-pink-50/50 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm'
                    />
                    <select className='px-4 py-2 rounded-lg bg-pink-50/50 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm'>
                        <option>All Ratings</option>
                        <option>5 Stars</option>
                        <option>4 Stars</option>
                        <option>3 Stars</option>
                        <option>2 Stars</option>
                        <option>1 Star</option>
                    </select>
                    <select className='px-4 py-2 rounded-lg bg-pink-50/50 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm'>
                        <option>All Sentiment</option>
                        <option>Positive</option>
                        <option>Neutral</option>
                        <option>Negative</option>
                    </select>
                    <button className='p-2 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors'>
                        <FilterIcon className='w-5 h-5 text-gray-600' />
                    </button>
                </div>
                <div className='p-6 space-y-4'>
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className='bg-gradient-to-br from-pink-50/30 to-purple-50/30 rounded-2xl p-5 border border-pink-100 hover:shadow-md transition-all'
                        >
                            <div className='flex items-start gap-4'>
                                <img
                                    src={review.avatar}
                                    alt={review.customer}
                                    className='w-12 h-12 rounded-full border-2 border-pink-200'
                                />
                                <div className='flex-1'>
                                    <div className='flex items-start justify-between mb-2'>
                                        <div>
                                            <h4 className='font-semibold text-gray-800'>{review.customer}</h4>
                                            <p className='text-xs text-gray-500'>
                                                {review.date} • {review.service}
                                            </p>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${getSentimentColor(
                                                    review.sentiment,
                                                )}`}
                                            >
                                                {review.sentiment}
                                            </span>
                                            <div className='flex items-center gap-1'>
                                                {[...Array(5)].map((_, i) => (
                                                    <StarIcon
                                                        key={i}
                                                        className={`w-4 h-4 ${
                                                            i < review.rating
                                                                ? 'text-yellow-400 fill-yellow-400'
                                                                : 'text-gray-300'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p className='text-sm text-gray-700 mb-3'>{review.comment}</p>
                                    <div className='flex items-center gap-2'>
                                        {review.replied ? (
                                            <span className='text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full flex items-center gap-1'>
                                                <MessageSquareIcon className='w-3 h-3' />
                                                Replied
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => setSelectedReview(review.id)}
                                                className='text-xs text-pink-600 bg-pink-50 px-3 py-1 rounded-full hover:bg-pink-100 transition-colors flex items-center gap-1'
                                            >
                                                <MessageSquareIcon className='w-3 h-3' />
                                                Reply
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ReviewReplyModal
                isOpen={!!selectedReview}
                onClose={() => setSelectedReview(null)}
                reviewId={selectedReview || 0}
                onSuccess={handleReplySuccess}
            />
        </div>
    );
}
