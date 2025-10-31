import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, CalendarIcon, UserIcon, Clock, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { blogApi } from '../../services/blogApi';
import { BlogPostDetail } from '../../types/blog';

export function BlogDetailPage() {
    const { t, i18n } = useTranslation('common');
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<BlogPostDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) return;

        const fetchPost = async () => {
            try {
                setLoading(true);
                const data = await blogApi.getPostBySlug(slug);
                setPost(data);
                // Scroll to top when post loads
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (err) {
                console.error('Failed to load blog post:', err);
                setError(t('blog.failedToLoad'));
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug, t]);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '';
        const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
        return new Date(dateString).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const calculateReadTime = (content: string): string => {
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/).length;
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return `${minutes} ${t('blog.readTime')}`;
    };

    if (loading) {
        return (
            <div className='w-full min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center pt-24'>
                <Loader2 className='w-12 h-12 text-pink-500 animate-spin' />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className='w-full min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center pt-24'>
                <div className='text-center max-w-md'>
                    <p className='text-red-600 mb-4'>{error || t('blog.postNotFound')}</p>
                    <button
                        onClick={() => navigate('/blog')}
                        className='px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity'
                    >
                        {t('blog.backToBlog')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='w-full min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 pt-24'>
            <div className='max-w-7xl mx-auto px-6 py-12'>
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/blog')}
                    className='flex items-center gap-2 text-gray-600 hover:text-pink-600 mb-8 transition-colors'
                >
                    <ArrowLeftIcon className='w-5 h-5' />
                    <span>{t('blog.backToBlog')}</span>
                </motion.button>

                {/* Featured Image - Full Width */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className='relative aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl mb-12'
                >
                    <img src={post.featuredImage} alt={post.title} className='w-full h-full object-cover' />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent' />

                    {/* Category Badge */}
                    <div className='absolute top-6 left-6'>
                        <span className='px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-sm font-semibold shadow-lg'>
                            {post.category.name}
                        </span>
                    </div>

                    {/* Meta Info on Image */}
                    <div className='absolute bottom-6 left-6 right-6'>
                        <div className='flex flex-wrap gap-4 text-white/90'>
                            <div className='flex items-center gap-2'>
                                <UserIcon className='w-4 h-4' />
                                <span className='text-sm font-medium'>{post.author.fullName}</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <CalendarIcon className='w-4 h-4' />
                                <span className='text-sm'>{formatDate(post.publishedAt)}</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <Clock className='w-4 h-4' />
                                <span className='text-sm'>{calculateReadTime(post.content)}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Article Content - Centered for readability */}
                <div className='max-w-5xl mx-auto'>
                    <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className='bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-8 md:p-12'
                    >
                        {/* Title */}
                        <h1 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight'>
                            {post.title}
                        </h1>

                        {/* Excerpt */}
                        <div className='bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 mb-8 border-l-4 border-pink-500'>
                            <p className='text-lg text-gray-800 leading-relaxed italic'>{post.excerpt}</p>
                        </div>

                        {/* Content */}
                        <div className='prose prose-lg max-w-none'>
                            <style>{`
                            .blog-content h1 { 
                                font-size: 2em; 
                                font-weight: bold; 
                                margin-top: 2em; 
                                margin-bottom: 0.5em;
                                color: #1f2937;
                            }
                            .blog-content h2 { 
                                font-size: 1.5em; 
                                font-weight: bold; 
                                margin-top: 1.5em; 
                                margin-bottom: 0.5em;
                                color: #374151;
                            }
                            .blog-content h3 { 
                                font-size: 1.25em; 
                                font-weight: 600; 
                                margin-top: 1.5em; 
                                margin-bottom: 0.5em;
                                color: #4b5563;
                            }
                            .blog-content p { 
                                margin-bottom: 1.25em; 
                                line-height: 1.8;
                                color: #374151;
                            }
                            .blog-content ul, .blog-content ol { 
                                margin: 1.5em 0; 
                                padding-left: 1.5em;
                            }
                            .blog-content li { 
                                margin-bottom: 0.5em;
                                line-height: 1.8;
                            }
                            .blog-content strong { 
                                font-weight: 600; 
                                color: #1f2937;
                            }
                            .blog-content a { 
                                color: #ec4899; 
                                text-decoration: underline;
                            }
                            .blog-content blockquote {
                                border-left: 4px solid #ec4899;
                                padding-left: 1em;
                                margin: 1.5em 0;
                                font-style: italic;
                                color: #6b7280;
                            }
                            .blog-content code {
                                background: #f3f4f6;
                                padding: 0.2em 0.4em;
                                border-radius: 0.25em;
                                font-size: 0.9em;
                            }
                            .blog-content pre {
                                background: #1f2937;
                                color: #f9fafb;
                                padding: 1em;
                                border-radius: 0.5em;
                                overflow-x: auto;
                                margin: 1.5em 0;
                            }
                        `}</style>
                            <div
                                className='blog-content'
                                dangerouslySetInnerHTML={{
                                    __html: post.content
                                        .replace(/\n\n/g, '</p><p>')
                                        .replace(/\n/g, '<br />')
                                        .replace(/^/, '<p>')
                                        .replace(/$/, '</p>')
                                        .replace(/# (.*?)(\n|<br \/>)/g, '<h1>$1</h1>')
                                        .replace(/## (.*?)(\n|<br \/>)/g, '<h2>$1</h2>')
                                        .replace(/### (.*?)(\n|<br \/>)/g, '<h3>$1</h3>')
                                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                        .replace(/- (.*?)(<br \/>|<\/p>)/g, '<li>$1</li>'),
                                }}
                            />
                        </div>
                    </motion.article>
                </div>

                {/* Related Posts */}
                {post.relatedPosts && post.relatedPosts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className='mt-16'
                    >
                        <div className='text-center mb-10'>
                            <h2 className='text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2'>
                                {t('blog.relatedPosts')}
                            </h2>
                            <p className='text-gray-600'>{t('blog.exploreMorePosts')}</p>
                        </div>
                        <div className='grid md:grid-cols-3 gap-8'>
                            {post.relatedPosts.map((relatedPost, index) => (
                                <motion.div
                                    key={relatedPost.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    onClick={() => navigate(`/blog/${relatedPost.slug}`)}
                                    className='bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg overflow-hidden cursor-pointer group'
                                >
                                    <div className='relative h-48 overflow-hidden'>
                                        <img
                                            src={relatedPost.featuredImage}
                                            alt={relatedPost.title}
                                            className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                                        />
                                        <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                                        <div className='absolute top-3 left-3'>
                                            <span className='px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-xs font-semibold'>
                                                {relatedPost.category.name}
                                            </span>
                                        </div>
                                    </div>
                                    <div className='p-5'>
                                        <h3 className='text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-pink-600 transition-colors mb-2 min-h-[3.5rem]'>
                                            {relatedPost.title}
                                        </h3>
                                        <p className='text-sm text-gray-600 line-clamp-2 mb-3'>{relatedPost.excerpt}</p>
                                        <div className='flex items-center gap-2 text-xs text-gray-500'>
                                            <CalendarIcon className='w-3 h-3' />
                                            <span>{formatDate(relatedPost.publishedAt)}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default BlogDetailPage;
