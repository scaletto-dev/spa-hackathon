import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BlogHero } from '../components/blog/BlogHero';
import { BlogGrid } from '../components/blog/BlogGrid';
import { BlogSidebar } from '../components/blog/BlogSidebar';
const categories = ['All', 'Skincare Tips', 'Laser Technology', 'AI Trends', 'Clinic Updates'];
export function BlogPage() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    return (
        <div className='w-full min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 pt-24'>
            <div className='max-w-7xl mx-auto px-6 py-12'>
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
                    className='text-center mb-12'
                >
                    <h1 className='text-4xl md:text-5xl font-bold mb-4'>
                        <span className='bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent'>
                            Blog & Insights
                        </span>
                    </h1>
                    <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                        Explore the latest in beauty technology, skincare innovations, and clinic updates
                    </p>
                </motion.div>
                <BlogHero />
                <div className='mt-12 mb-8 flex flex-wrap gap-3 justify-center'>
                    {categories.map((category) => (
                        <motion.button
                            key={category}
                            whileHover={{
                                scale: 1.05,
                            }}
                            whileTap={{
                                scale: 0.95,
                            }}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-2 rounded-full font-medium transition-all ${
                                selectedCategory === category
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-pink-50 border border-pink-100'
                            }`}
                        >
                            {category}
                        </motion.button>
                    ))}
                </div>
                <div className='grid lg:grid-cols-3 gap-8 mb-20'>
                    <div className='lg:col-span-2'>
                        <BlogGrid category={selectedCategory} />
                    </div>
                    <div className='space-y-8'>
                        <BlogSidebar onTopicClick={setSelectedCategory} />
                    </div>
                </div>
            </div>
        </div>
    );
}
