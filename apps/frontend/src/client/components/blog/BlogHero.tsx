import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarIcon, ArrowRightIcon, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { blogApi } from '../../../services/blogApi';
import { BlogPostBackend, BlogCategory } from '../../../types/blog';

interface BlogHeroProps {
    categories: BlogCategory[];
}

export function BlogHero({ categories }: BlogHeroProps) {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation('common');
    const [featuredPost, setFeaturedPost] = useState<BlogPostBackend | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedPost = async () => {
            try {
                setLoading(true);
                // Get the latest published post as featured
                const response = await blogApi.getAllPosts({ page: 1, limit: 1 });
                if (response.data.length > 0) {
                    setFeaturedPost(response.data[0] || null);
                }
            } catch (error) {
                console.error('Failed to load featured post:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeaturedPost();
    }, []);

    const getCategoryName = (categoryId: string) => {
        return categories.find((c) => c.id === categoryId)?.name || t('blog.uncategorized');
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '';
        const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
        return new Date(dateString).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className='relative rounded-3xl overflow-hidden shadow-2xl bg-gray-200 aspect-[21/9] flex items-center justify-center'>
                <Loader2 className='w-8 h-8 text-pink-500 animate-spin' />
            </div>
        );
    }

    if (!featuredPost) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='relative rounded-3xl overflow-hidden shadow-2xl cursor-pointer group'
            onClick={() => navigate(`/blog/${featuredPost.slug}`)}
        >
            <div className='relative aspect-[21/9] overflow-hidden'>
                <img
                    src={featuredPost.featuredImage}
                    alt={featuredPost.title}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent' />
            </div>
            <div className='absolute bottom-0 left-0 right-0 p-6 md:p-12'>
                <div className='flex gap-3 mb-4'>
                    <span className='px-4 py-1 bg-pink-500 text-white rounded-full text-sm font-medium'>
                        {t('blog.featured')}
                    </span>
                    <span className='px-4 py-1 bg-purple-500 text-white rounded-full text-sm font-medium'>
                        {featuredPost.category?.name || getCategoryName(featuredPost.categoryId)}
                    </span>
                </div>
                <h2 className='text-2xl md:text-4xl font-bold text-white mb-4 line-clamp-2'>{featuredPost.title}</h2>
                <div className='flex flex-col md:flex-row md:items-center gap-4 md:gap-8'>
                    <div className='flex items-center gap-2 text-pink-200'>
                        <CalendarIcon className='w-5 h-5' />
                        <span>{formatDate(featuredPost.publishedAt)}</span>
                    </div>
                    <p className='text-white/80 md:max-w-xl line-clamp-2'>{featuredPost.excerpt}</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className='mt-6 flex items-center gap-2 text-white font-medium group'
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/blog/${featuredPost.slug}`);
                    }}
                >
                    {t('blog.readFullArticle')}
                    <ArrowRightIcon className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
                </motion.button>
            </div>
        </motion.div>
    );
}
