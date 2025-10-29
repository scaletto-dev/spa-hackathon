import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { SearchIcon, CalendarIcon, TrendingUpIcon, ArrowRightIcon, MailIcon } from 'lucide-react';
import { toast } from '../../../utils/toast';

const popularPosts = [
    {
        id: 1,
        slug: 'ai-revolutionizing-skincare',
        title: 'The Future of AI in Aesthetic Medicine',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=100&h=100&fit=crop',
        date: 'April 12, 2024',
    },
    {
        id: 2,
        slug: 'top-aesthetic-treatments-2024',
        title: 'Top 10 Skincare Ingredients to Look For',
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&h=100&fit=crop',
        date: 'April 7, 2024',
    },
    {
        id: 3,
        slug: 'new-branch-opening-downtown',
        title: 'How to Prepare for Your First Laser Treatment',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=100&h=100&fit=crop',
        date: 'April 3, 2024',
    },
];

const popularTopics = [
    { name: 'Skincare', category: 'Skincare Tips' },
    { name: 'Anti-Aging', category: 'Skincare Tips' },
    { name: 'Laser', category: 'Laser Technology' },
    { name: 'AI', category: 'AI Trends' },
    { name: 'Technology', category: 'AI Trends' },
    { name: 'Clinic News', category: 'Clinic Updates' },
];

interface BlogSidebarProps {
    onTopicClick?: (category: string) => void;
}

export function BlogSidebar({ onTopicClick }: BlogSidebarProps) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error('Please enter your email address');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error('Please enter a valid email address');
            return;
        }
        // Mock subscription
        toast.success('Successfully subscribed to newsletter! (Mocked)');
        setEmail('');
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            toast.info(`Searching for "${searchQuery}"... (Mocked)`);
        }
    };

    return (
        <>
            <div className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-6'>
                <div className='flex items-center gap-2 mb-6'>
                    <SearchIcon className='w-5 h-5 text-gray-400' />
                    <input
                        type='text'
                        placeholder='Search articles...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className='w-full bg-transparent border-b-2 border-gray-200 focus:border-pink-300 outline-none py-2 text-gray-700'
                    />
                </div>
                <div className='space-y-2'>
                    <h3 className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
                        <TrendingUpIcon className='w-5 h-5 text-pink-500' />
                        Popular Topics
                    </h3>
                    <div className='flex flex-wrap gap-2 mt-3'>
                        {popularTopics.map((topic) => (
                            <motion.button
                                key={topic.name}
                                onClick={() => onTopicClick?.(topic.category)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className='px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm cursor-pointer hover:bg-pink-200 transition-colors'
                            >
                                {topic.name}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
            <div className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-6'>
                <h3 className='text-lg font-semibold text-gray-800 mb-6'>Popular Articles</h3>
                <div className='space-y-4'>
                    {popularPosts.map((post) => (
                        <motion.div
                            key={post.id}
                            onClick={() => navigate(`/blog/${post.slug}`)}
                            whileHover={{ x: 5 }}
                            className='flex gap-4 group cursor-pointer'
                        >
                            <img
                                src={post.image}
                                alt={post.title}
                                className='w-16 h-16 rounded-lg object-cover flex-shrink-0'
                            />
                            <div>
                                <h4 className='font-medium text-gray-800 group-hover:text-pink-600 transition-colors line-clamp-2'>
                                    {post.title}
                                </h4>
                                <div className='flex items-center gap-1 text-xs text-gray-500 mt-1'>
                                    <CalendarIcon className='w-3 h-3' />
                                    <span>{post.date}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <div className='mt-6 text-right'>
                    <Link
                        to='/blog'
                        className='text-sm text-pink-600 font-medium flex items-center gap-1 justify-end hover:text-pink-700 transition-colors'
                    >
                        View All Articles
                        <ArrowRightIcon className='w-4 h-4' />
                    </Link>
                </div>
            </div>
            <motion.div
                whileHover={{
                    y: -5,
                }}
                className='bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 rounded-3xl p-1'
            >
                <div className='bg-white rounded-3xl p-6'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-3'>Subscribe to Newsletter</h3>
                    <p className='text-gray-600 text-sm mb-4'>
                        Get the latest beauty tips and exclusive offers directly to your inbox
                    </p>
                    <div className='relative mb-4'>
                        <MailIcon className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                        <input
                            type='email'
                            placeholder='Your email address'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full pl-10 pr-4 py-3 bg-pink-50 rounded-xl border-2 border-pink-100 focus:outline-none focus:border-pink-300'
                        />
                    </div>
                    <motion.button
                        onClick={handleSubscribe}
                        whileHover={{
                            scale: 1.02,
                        }}
                        whileTap={{
                            scale: 0.98,
                        }}
                        className='w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium'
                    >
                        Subscribe
                    </motion.button>
                </div>
            </motion.div>
        </>
    );
}
