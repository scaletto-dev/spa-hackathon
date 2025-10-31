import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    CalendarIcon,
    UserIcon,
    ArrowRightIcon,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Clock,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { blogApi, type BlogCategory } from '../../../services/blogApi';
import { BlogPostBackend } from '../../../types/blog';

interface BlogGridProps {
    category: string;
    categories: BlogCategory[];
    searchQuery?: string;
}

export function BlogGrid({ category, categories, searchQuery }: BlogGridProps) {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation('common');
    const [posts, setPosts] = useState<BlogPostBackend[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 6;

    const calculateReadTime = (content: string): string => {
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/).length;
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return `${minutes} ${t('blog.readTime')}`;
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await blogApi.getAllPosts({
                    page,
                    limit,
                    ...(category !== 'All' && { categoryId: category }),
                    ...(searchQuery && searchQuery.trim() && { search: searchQuery.trim() }),
                });
                setPosts(response.data);
                setTotalPages(response.meta.totalPages);
            } catch (err) {
                console.error('Failed to load blog posts:', err);
                setError(t('blog.failedToLoad'));
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, [category, page, searchQuery, t]);

    // Reset page when category or search changes
    useEffect(() => {
        setPage(1);
    }, [category, searchQuery]);

    const getCategoryName = (categoryId: string) => {
        const cat = categories.find((c) => c.id === categoryId);
        return cat?.name || t('blog.uncategorized');
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return t('blog.notPublished');
        const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
        return new Date(dateString).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-pink-500 animate-spin mb-4" />
                <p className="text-gray-600">{t('blog.loadingPosts')}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="bg-gray-50 rounded-2xl p-12 text-center">
                <p className="text-gray-600 text-lg">{t('blog.noPosts')}</p>
            </div>
        );
    }

    return (
        <div>
            <motion.div layout className="grid md:grid-cols-2 gap-6">
                {posts.map((article) => (
                    <motion.div
                        key={article.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        onClick={() => navigate(`/blog/${article.slug}`)}
                        data-testid={`blog-grid-card-${article.id}`}
                        className="group cursor-pointer"
                    >
                        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl overflow-hidden hover:shadow-2xl transition-all h-full">
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={article.featuredImage}
                                    alt={article.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="px-4 py-1 bg-white/90 backdrop-blur-md rounded-full text-sm font-medium text-pink-600">
                                        {article.category?.name ||
                                            getCategoryName(article.categoryId)}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-pink-600 transition-colors">
                                    {article.title}
                                </h3>
                                <p className="text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <UserIcon className="w-4 h-4" />
                                        <span>{article.author?.fullName || t('blog.author')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <CalendarIcon className="w-4 h-4" />
                                        <span>{formatDate(article.publishedAt)}</span>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Clock className="w-4 h-4" />
                                        <span>{calculateReadTime(article.content)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-pink-600 font-medium">
                                        {t('blog.readMore')}
                                        <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                    page === pageNum
                                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                                        : 'border border-gray-300 hover:bg-pink-50'
                                }`}
                            >
                                {pageNum}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}
