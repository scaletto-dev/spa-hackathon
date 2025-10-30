import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SearchIcon, MailIcon, TagIcon } from 'lucide-react';
import { toast } from '../../../utils/toast';
import { BlogCategory } from '../../../types/blog';

interface BlogSidebarProps {
    categories: BlogCategory[];
    onTopicClick?: (category: string) => void;
    onSearch?: (query: string) => void;
}

export function BlogSidebar({ categories, onTopicClick, onSearch }: BlogSidebarProps) {
    const [email, setEmail] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error('Vui lòng nhập địa chỉ email');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error('Vui lòng nhập địa chỉ email hợp lệ');
            return;
        }
        // Mock subscription
        toast.success('Đăng ký nhận tin thành công!');
        setEmail('');
    };

    const handleSearch = () => {
        if (onSearch) {
            onSearch(searchQuery);
        }
    };

    return (
        <>
            <div className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-6'>
                <div className='mb-6'>
                    <div className='flex items-center gap-2 mb-2'>
                        <SearchIcon className='w-5 h-5 text-gray-400' />
                        <input
                            type='text'
                            placeholder='Tìm kiếm bài viết...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className='flex-1 bg-transparent border-b-2 border-gray-200 focus:border-pink-300 outline-none py-2 text-gray-700'
                        />
                    </div>
                    <div className='flex gap-2'>
                        <button
                            onClick={handleSearch}
                            className='px-4 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg text-sm hover:opacity-90 transition-opacity'
                        >
                            Tìm kiếm
                        </button>
                        {searchQuery && (
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    if (onSearch) onSearch('');
                                }}
                                className='px-4 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors'
                            >
                                Xóa
                            </button>
                        )}
                    </div>
                </div>
                <div className='space-y-2'>
                    <h3 className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
                        <TagIcon className='w-5 h-5 text-pink-500' />
                        Danh mục
                    </h3>
                    <div className='flex flex-wrap gap-2 mt-3'>
                        {categories.map((category) => (
                            <motion.button
                                key={category.id}
                                onClick={() => onTopicClick?.(category.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className='px-3 py-1.5 bg-pink-100 text-pink-700 rounded-full text-sm cursor-pointer hover:bg-pink-200 transition-colors flex items-center gap-1'
                            >
                                {category.name}
                                <span className='text-xs opacity-75'>({category.postCount})</span>
                            </motion.button>
                        ))}
                    </div>
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
