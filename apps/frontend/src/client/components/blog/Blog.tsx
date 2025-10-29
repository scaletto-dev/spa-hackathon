import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, CalendarIcon } from 'lucide-react';

const articles = [
    {
        id: 1,
        slug: 'ai-revolutionizing-skincare',
        image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=400&fit=crop',
        category: 'AI Technology',
        title: 'How AI is Revolutionizing Skincare Analysis',
        date: 'March 15, 2024',
        excerpt:
            'Discover how artificial intelligence is transforming the way we understand and treat skin conditions.',
    },
    {
        id: 2,
        slug: 'top-aesthetic-treatments-2024',
        image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&h=400&fit=crop',
        category: 'Beauty Trends',
        title: 'Top 5 Aesthetic Treatments for 2024',
        date: 'March 10, 2024',
        excerpt: 'Explore the most popular and effective beauty treatments that are trending this year.',
    },
    {
        id: 3,
        slug: 'new-branch-opening-downtown',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop',
        category: 'Clinic News',
        title: 'New Branch Opening Downtown',
        date: 'March 5, 2024',
        excerpt: 'We are excited to announce the opening of our newest location in the heart of downtown.',
    },
];

export function Blog() {
    const navigate = useNavigate();
    return (
        <section className='w-full py-24 px-6'>
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
                            Insights & News
                        </span>
                    </h2>
                    <p className='text-gray-600 text-lg'>
                        Stay updated with the latest in beauty technology and skincare trends
                    </p>
                </motion.div>
                <div className='grid md:grid-cols-3 gap-8'>
                    {articles.map((article, index) => (
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
                            className='group cursor-pointer'
                        >
                            <div className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl overflow-hidden hover:shadow-2xl transition-all'>
                                <div className='relative h-56 overflow-hidden'>
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                                    />
                                    <div className='absolute top-4 left-4'>
                                        <span className='px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-sm font-medium text-pink-600'>
                                            {article.category}
                                        </span>
                                    </div>
                                </div>
                                <div className='p-6'>
                                    <div className='flex items-center gap-2 text-sm text-gray-500 mb-3'>
                                        <CalendarIcon className='w-4 h-4' />
                                        {article.date}
                                    </div>
                                    <h3 className='text-xl font-bold text-gray-800 mb-3 group-hover:text-pink-600 transition-colors'>
                                        {article.title}
                                    </h3>
                                    <p className='text-gray-600 mb-4 line-clamp-2'>{article.excerpt}</p>
                                    <div className='flex items-center gap-2 text-pink-600 font-medium'>
                                        Read More
                                        <ArrowRightIcon className='w-4 h-4 group-hover:translate-x-2 transition-transform' />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
