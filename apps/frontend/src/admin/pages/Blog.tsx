import React, { useState } from 'react';
import { PlusIcon, Edit3Icon, EyeIcon, EyeOffIcon, Trash2Icon, SparklesIcon } from 'lucide-react';
import { BlogPostModal } from '../components/modals/BlogPostModal';
import { toast } from '../../utils/toast';
const posts = [
    {
        id: 1,
        title: 'Top 10 Skincare Tips for Radiant Skin',
        excerpt: 'Discover the secrets to achieving glowing, healthy skin with our expert-approved skincare routine...',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop',
        status: 'published',
        date: '2024-01-10',
        views: 1243,
    },
    {
        id: 2,
        title: 'The Benefits of Regular Massage Therapy',
        excerpt:
            'Learn how incorporating massage into your wellness routine can improve your overall health and wellbeing...',
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop',
        status: 'published',
        date: '2024-01-08',
        views: 892,
    },
    {
        id: 3,
        title: 'Hair Care Trends for 2024',
        excerpt: 'Stay ahead of the curve with the latest hair care trends and styling techniques for the new year...',
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop',
        status: 'draft',
        date: '2024-01-15',
        views: 0,
    },
];
export function Blog() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePostCreated = () => {
        setIsModalOpen(false);
        // Modal itself shows toast
    };

    const handleEditPost = (postId: number, title: string) => {
        console.log(`✏️ Mock: Editing post #${postId}`);
        toast.info(`Chức năng chỉnh sửa "${title}" đang được phát triển...`);
    };

    const handleTogglePublish = (postId: number, currentStatus: string, title: string) => {
        const newStatus = currentStatus === 'published' ? 'draft' : 'published';
        console.log(`👁️ Mock: Toggled post #${postId} status from ${currentStatus} to ${newStatus}`);
        toast.success(
            `Đã ${newStatus === 'published' ? 'xuất bản' : 'chuyển sang nháp'} bài viết "${title}"! (Mocked)`,
        );
    };

    const handleDeletePost = (postId: number, title: string) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa bài viết "${title}"?`)) {
            console.log(`🗑️ Mock: Deleted post #${postId}`);
            toast.success(`Đã xóa bài viết "${title}"! (Mocked)`);
        }
    };

    const handleAIContentGenerator = () => {
        toast.info('Tính năng tạo nội dung AI đang được phát triển...');
    };
    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold text-gray-800'>Blog & Content</h1>
                    <p className='text-gray-600 mt-1'>Manage your blog posts and articles</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className='px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-xl font-medium hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm flex items-center gap-2'
                >
                    <PlusIcon className='w-5 h-5' />
                    New Post
                </button>
            </div>
            <div className='bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100'>
                <div className='flex items-center gap-2'>
                    <div className='w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center'>
                        <SparklesIcon className='w-4 h-4 text-white' />
                    </div>
                    <p className='text-sm text-gray-700'>
                        <span className='font-semibold'>AI Content Generator:</span> Let AI help you write engaging blog
                        posts in seconds
                    </p>
                    <button
                        onClick={handleAIContentGenerator}
                        className='ml-auto px-4 py-2 bg-white rounded-lg text-sm font-medium text-pink-600 hover:bg-pink-50 transition-colors'
                    >
                        Try Now
                    </button>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className='bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-pink-100 shadow-sm hover:shadow-lg transition-all group'
                    >
                        <div className='relative h-48 overflow-hidden'>
                            <img
                                src={post.image}
                                alt={post.title}
                                className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                            />
                            <div className='absolute top-3 right-3'>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        post.status === 'published'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-orange-500 text-white'
                                    }`}
                                >
                                    {post.status}
                                </span>
                            </div>
                        </div>
                        <div className='p-5'>
                            <h3 className='text-lg font-semibold text-gray-800 mb-2 line-clamp-2'>{post.title}</h3>
                            <p className='text-sm text-gray-600 mb-4 line-clamp-2'>{post.excerpt}</p>
                            <div className='flex items-center justify-between text-xs text-gray-500 mb-4'>
                                <span>{post.date}</span>
                                <span>{post.views} views</span>
                            </div>
                            <div className='flex gap-2'>
                                <button
                                    onClick={() => handleEditPost(post.id, post.title)}
                                    className='flex-1 py-2 bg-pink-50 text-pink-600 rounded-lg text-sm font-medium hover:bg-pink-100 transition-colors flex items-center justify-center gap-1'
                                >
                                    <Edit3Icon className='w-4 h-4' />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleTogglePublish(post.id, post.status, post.title)}
                                    className='p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors'
                                >
                                    {post.status === 'published' ? (
                                        <EyeIcon className='w-4 h-4' />
                                    ) : (
                                        <EyeOffIcon className='w-4 h-4' />
                                    )}
                                </button>
                                <button
                                    onClick={() => handleDeletePost(post.id, post.title)}
                                    className='p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors'
                                >
                                    <Trash2Icon className='w-4 h-4' />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <BlogPostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handlePostCreated} />
        </div>
    );
}
