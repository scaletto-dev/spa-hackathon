import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, CalendarIcon, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { blogApi } from '../../../services/blogApi';
import { BlogPost, BlogPostBackend } from '../../../types/blog';

// Transform backend data to frontend format
const transformBlogPost = (backendPost: BlogPostBackend, t: (key: string) => string): BlogPost => {
    // Helper function to calculate read time
    const calculateReadTime = (content: string): string => {
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} ${t('blog.minRead')}`;
    };

    return {
        id: backendPost.id,
        title: backendPost.title,
        slug: backendPost.slug,
        excerpt: backendPost.excerpt,
        image: backendPost.featuredImage,
        author: backendPost.author.fullName,
        date: backendPost.publishedAt
            ? new Date(backendPost.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
              })
            : new Date(backendPost.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
              }),
        category: backendPost.category.name,
        readTime: calculateReadTime(backendPost.content),
    };
};

export function Blog() {
    const navigate = useNavigate();
    const { t } = useTranslation('common');
    const [articles, setArticles] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                const response = await blogApi.getAllPosts({ page: 1, limit: 3 });
                // Transform backend data to frontend format
                const transformedArticles = response.data.map((post) => transformBlogPost(post, t));
                setArticles(transformedArticles);
            } catch (err) {
                console.error('Error fetching blog posts:', err);
                setError(t('blog.failedToLoad'));
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [t]);

    if (loading) {
        return (
            <section className="w-full py-24 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="text-gray-600">{t('blog.loadingPosts')}</div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="w-full py-24 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="text-red-600">{error}</div>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full py-24 px-6">
            <div className="max-w-7xl mx-auto">
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
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                            {t('blog.insightsAndNews')}
                        </span>
                    </h2>
                    <p className="text-gray-600 text-lg">{t('blog.stayUpdated')}</p>
                </motion.div>
                <div className="grid md:grid-cols-3 gap-8">
                    {articles.length === 0 ? (
                        <div className="col-span-3 text-center text-gray-600">
                            {t('blog.noPostsAvailable')}
                        </div>
                    ) : (
                        articles.map((article, index) => (
                            <motion.div
                                key={article.id}
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
                                    y: -10,
                                }}
                                onClick={() => navigate(`/blog/${article.slug}`)}
                                data-testid={`blog-card-${article.id}`}
                                className="group cursor-pointer"
                            >
                                <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl overflow-hidden hover:shadow-2xl transition-all">
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-sm font-medium text-pink-600">
                                                {article.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="w-4 h-4" />
                                                {article.date}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                {article.readTime}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-pink-600 transition-colors">
                                            {article.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4 line-clamp-2">
                                            {article.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">
                                                {t('blog.by')} {article.author}
                                            </span>
                                            <div className="flex items-center gap-2 text-pink-600 font-medium">
                                                {t('blog.readMore')}
                                                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* View All Blog Posts Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-center mt-12"
                >
                    <button
                        onClick={() => navigate('/blog')}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all"
                    >
                        {t('blog.viewAll')}
                        <ArrowRightIcon className="w-5 h-5" />
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
