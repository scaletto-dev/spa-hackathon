import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, UserIcon, ArrowRightIcon } from 'lucide-react';

const articles = [
    {
        id: 1,
        slug: 'ai-revolutionizing-skincare',
        title: 'How AI Skin Analysis is Changing the Beauty Industry',
        excerpt:
            'Explore how artificial intelligence is revolutionizing skin analysis and providing unprecedented accuracy in treatment recommendations.',
        image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=400&fit=crop',
        category: 'AI Trends',
        author: 'Dr. Emma Chen',
        date: 'April 10, 2024',
        readTime: '5 min read',
    },
    {
        id: 2,
        slug: 'top-aesthetic-treatments-2024',
        title: '5 Benefits of Laser Treatment for Acne Scars',
        excerpt:
            'Learn about the latest advancements in laser technology and how they can effectively reduce the appearance of acne scars.',
        image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&h=400&fit=crop',
        category: 'Laser Technology',
        author: 'Dr. Michael Johnson',
        date: 'April 8, 2024',
        readTime: '4 min read',
    },
    {
        id: 3,
        slug: 'personalized-skincare-science',
        title: 'The Science Behind Personalized Skincare Formulations',
        excerpt:
            'Discover how AI algorithms are creating truly personalized skincare formulations based on individual skin needs and concerns.',
        image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&h=400&fit=crop',
        category: 'Skincare Tips',
        author: 'Sarah Williams',
        date: 'April 5, 2024',
        readTime: '7 min read',
    },
    {
        id: 4,
        slug: 'new-branch-opening-downtown',
        title: 'New AI-Powered Body Contouring Technology at BeautyAI',
        excerpt:
            "We're excited to announce our newest treatment offering: AI-optimized body contouring that delivers personalized results.",
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop',
        category: 'Clinic Updates',
        author: 'Lisa Thompson',
        date: 'April 2, 2024',
        readTime: '3 min read',
    },
    {
        id: 5,
        slug: 'winter-spring-skincare-transition',
        title: 'Winter to Spring Skincare Transition Tips',
        excerpt:
            'Learn how to adjust your skincare routine when transitioning from winter to spring for healthy, glowing skin.',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop',
        category: 'Skincare Tips',
        author: 'Jennifer Lopez',
        date: 'March 28, 2024',
        readTime: '6 min read',
    },
];

export function BlogGrid({ category }: { category: string }) {
    const navigate = useNavigate();
    const filteredArticles =
        category === 'All' ? articles : articles.filter((article) => article.category === category);
    return (
        <motion.div layout className='grid md:grid-cols-2 gap-6'>
            {filteredArticles.map((article) => (
                <motion.div
                    key={article.id}
                    layout
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    exit={{
                        opacity: 0,
                    }}
                    transition={{
                        duration: 0.5,
                    }}
                    onClick={() => navigate(`/blog/${article.slug}`)}
                    data-testid={`blog-grid-card-${article.id}`}
                    className='group cursor-pointer'
                >
                    <div className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl overflow-hidden hover:shadow-2xl transition-all h-full'>
                        <div className='relative h-56 overflow-hidden'>
                            <img
                                src={article.image}
                                alt={article.title}
                                className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                            />
                            <div className='absolute top-4 left-4'>
                                <span className='px-4 py-1 bg-white/90 backdrop-blur-md rounded-full text-sm font-medium text-pink-600'>
                                    {article.category}
                                </span>
                            </div>
                        </div>
                        <div className='p-6'>
                            <h3 className='text-xl font-bold text-gray-800 mb-3 group-hover:text-pink-600 transition-colors'>
                                {article.title}
                            </h3>
                            <p className='text-gray-600 mb-4 line-clamp-2'>{article.excerpt}</p>
                            <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
                                <div className='flex items-center gap-2 text-sm text-gray-500'>
                                    <UserIcon className='w-4 h-4' />
                                    <span>{article.author}</span>
                                </div>
                                <div className='flex items-center gap-2 text-sm text-gray-500'>
                                    <CalendarIcon className='w-4 h-4' />
                                    <span>{article.date}</span>
                                </div>
                            </div>
                            <div className='mt-4 flex items-center gap-2 text-pink-600 font-medium'>
                                Read More
                                <ArrowRightIcon className='w-4 h-4 group-hover:translate-x-2 transition-transform' />
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}
