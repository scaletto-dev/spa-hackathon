import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BlogHero } from '../components/blog/BlogHero';
import { BlogGrid } from '../components/blog/BlogGrid';
import { BlogSidebar } from '../components/blog/BlogSidebar';
import { blogApi, type BlogCategory } from '../../services/blogApi';

export function BlogPage() {
    const { t } = useTranslation('common');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoadingCategories(true);
                const data = await blogApi.getAllCategories();
                setCategories(data);
            } catch (error) {
                console.error('Failed to load categories:', error);
            } finally {
                setIsLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 pt-24">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.6,
                    }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                            {t('blog.title')}
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('blog.subtitle')}</p>
                </motion.div>
                <BlogHero categories={categories} />

                {/* Categories Filter */}
                <div className="mt-12 mb-8 flex flex-wrap gap-3 justify-center">
                    {isLoadingCategories ? (
                        <div className="flex items-center gap-2 text-gray-500">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{t('blog.loadingCategories')}</span>
                        </div>
                    ) : (
                        <>
                            <motion.button
                                key="All"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedCategory('All')}
                                className={`px-6 py-2 rounded-full font-medium transition-all ${
                                    selectedCategory === 'All'
                                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                                        : 'bg-white text-gray-700 hover:bg-pink-50 border border-pink-100'
                                }`}
                            >
                                {t('blog.allCategories')}
                            </motion.button>
                            {categories.map((category) => (
                                <motion.button
                                    key={category.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-6 py-2 rounded-full font-medium transition-all ${
                                        selectedCategory === category.id
                                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                                            : 'bg-white text-gray-700 hover:bg-pink-50 border border-pink-100'
                                    }`}
                                >
                                    {category.name} ({category.postCount})
                                </motion.button>
                            ))}
                        </>
                    )}
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mb-20">
                    <div className="lg:col-span-2">
                        <BlogGrid
                            category={selectedCategory}
                            categories={categories}
                            searchQuery={searchQuery}
                        />
                    </div>
                    <div className="space-y-8">
                        <BlogSidebar
                            categories={categories}
                            onTopicClick={setSelectedCategory}
                            onSearch={setSearchQuery}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogPage;
