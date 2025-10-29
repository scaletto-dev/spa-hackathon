import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarIcon, ClockIcon, UserIcon, ArrowLeftIcon, ShareIcon, BookmarkIcon, TagIcon } from 'lucide-react';
import { toast } from '../../utils/toast';

// Mock blog data - in real app, this would come from mockDataStore
const blogPosts: Record<string, any> = {
    'ai-revolutionizing-skincare': {
        id: 1,
        slug: 'ai-revolutionizing-skincare',
        title: 'How AI is Revolutionizing Skincare Analysis',
        category: 'AI Technology',
        image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1200&h=600&fit=crop',
        date: 'March 15, 2024',
        author: 'Dr. Sarah Johnson',
        readTime: '8 min read',
        tags: ['AI', 'Technology', 'Skincare', 'Innovation'],
        content: `
      <p>Artificial Intelligence is transforming the beauty and skincare industry in unprecedented ways. From personalized product recommendations to advanced skin analysis, AI is making professional-grade skincare advice accessible to everyone.</p>
      
      <h2>The Power of AI Skin Analysis</h2>
      <p>Modern AI systems can analyze thousands of skin conditions, identifying issues that might be invisible to the naked eye. Using advanced machine learning algorithms, these systems can detect early signs of aging, acne formation, and pigmentation changes.</p>
      
      <h2>Personalized Treatment Plans</h2>
      <p>One of the most significant advantages of AI in skincare is its ability to create highly personalized treatment plans. By analyzing your skin type, concerns, and goals, AI can recommend specific treatments and products tailored to your unique needs.</p>
      
      <h2>Real-Time Monitoring</h2>
      <p>AI-powered apps now allow you to track your skin's progress over time, providing valuable insights into which treatments are working and which might need adjustment. This continuous feedback loop ensures optimal results.</p>
      
      <h2>The Future of Skincare</h2>
      <p>As AI technology continues to evolve, we can expect even more sophisticated skin analysis tools, predictive modeling for aging, and automated treatment adjustments. The future of skincare is intelligent, personalized, and incredibly exciting.</p>
    `,
    },
    'top-aesthetic-treatments-2024': {
        id: 2,
        slug: 'top-aesthetic-treatments-2024',
        title: 'Top 5 Aesthetic Treatments for 2024',
        category: 'Beauty Trends',
        image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1200&h=600&fit=crop',
        date: 'March 10, 2024',
        author: 'Emma Rodriguez',
        readTime: '6 min read',
        tags: ['Treatments', 'Beauty', 'Trends', '2024'],
        content: `
      <p>The aesthetic treatment landscape is constantly evolving, with new innovations emerging every year. Here are the top 5 treatments trending in 2024.</p>
      
      <h2>1. Hydrafacial MD</h2>
      <p>This non-invasive treatment combines cleansing, exfoliation, extraction, and hydration in one session. Perfect for all skin types, it delivers immediate results with no downtime.</p>
      
      <h2>2. LED Light Therapy</h2>
      <p>Using different wavelengths of light, this treatment addresses various skin concerns from acne to aging. It's painless, relaxing, and highly effective.</p>
      
      <h2>3. Microneedling with PRP</h2>
      <p>Also known as the "vampire facial," this treatment uses your body's own growth factors to rejuvenate skin, reduce scarring, and improve texture.</p>
      
      <h2>4. Chemical Peels</h2>
      <p>Modern chemical peels are gentler yet more effective than ever, offering customizable solutions for pigmentation, acne scars, and aging concerns.</p>
      
      <h2>5. Cryotherapy Facials</h2>
      <p>Using controlled cold therapy, these treatments tighten skin, reduce inflammation, and boost collagen production for a youthful glow.</p>
    `,
    },
    'new-branch-opening-downtown': {
        id: 3,
        slug: 'new-branch-opening-downtown',
        title: 'New Branch Opening Downtown',
        category: 'Clinic News',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&h=600&fit=crop',
        date: 'March 5, 2024',
        author: 'Management Team',
        readTime: '4 min read',
        tags: ['News', 'Announcement', 'Location', 'Expansion'],
        content: `
      <p>We're thrilled to announce the opening of our newest location in the heart of downtown! This expansion represents our commitment to making quality aesthetic care accessible to more people.</p>
      
      <h2>State-of-the-Art Facility</h2>
      <p>Our new downtown branch features the latest in aesthetic technology, with dedicated treatment rooms, a relaxation lounge, and a consultation suite designed for your comfort and privacy.</p>
      
      <h2>Expert Team</h2>
      <p>We've assembled a team of highly trained professionals, including board-certified dermatologists, licensed aestheticians, and skincare specialists who are passionate about helping you achieve your beauty goals.</p>
      
      <h2>Grand Opening Special</h2>
      <p>To celebrate our opening, we're offering exclusive discounts on select treatments throughout March. Book your appointment today to take advantage of these limited-time offers!</p>
      
      <h2>Location & Hours</h2>
      <p>Find us at 123 Main Street, Downtown. We're open Monday through Saturday, 9 AM to 7 PM, with extended hours on Fridays until 9 PM.</p>
    `,
    },
};

export default function BlogDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();

    const post = slug ? blogPosts[slug] : null;

    if (!post) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center px-6'>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='text-center'>
                    <h1 className='text-4xl font-bold text-gray-800 mb-4'>Article Not Found</h1>
                    <p className='text-gray-600 mb-8'>The article you're looking for doesn't exist.</p>
                    <motion.button
                        onClick={() => navigate('/blog')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold shadow-xl'
                    >
                        Back to Blog
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
    };

    const handleBookmark = () => {
        toast.success('Article bookmarked!');
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 pt-16'>
            {/* Hero Image */}
            <div className='relative h-[60vh] overflow-hidden'>
                <img src={post.image} alt={post.title} className='w-full h-full object-cover' />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent' />

                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/blog')}
                    className='absolute top-8 left-8 flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-md rounded-full font-medium text-gray-800 shadow-lg hover:bg-white transition-colors'
                >
                    <ArrowLeftIcon className='w-5 h-5' />
                    Back to Blog
                </motion.button>

                {/* Category Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className='absolute bottom-8 left-8'
                >
                    <span className='px-6 py-3 bg-white/90 backdrop-blur-md rounded-full text-sm font-medium text-pink-600'>
                        {post.category}
                    </span>
                </motion.div>
            </div>

            {/* Content */}
            <div className='max-w-4xl mx-auto px-6 py-12'>
                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {/* Title */}
                    <h1 className='text-5xl font-bold text-gray-800 mb-6'>{post.title}</h1>

                    {/* Meta Info */}
                    <div className='flex flex-wrap items-center gap-6 mb-8 text-gray-600'>
                        <div className='flex items-center gap-2'>
                            <UserIcon className='w-5 h-5' />
                            <span>{post.author}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <CalendarIcon className='w-5 h-5' />
                            <span>{post.date}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <ClockIcon className='w-5 h-5' />
                            <span>{post.readTime}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex items-center gap-4 mb-12 pb-8 border-b border-gray-200'>
                        <motion.button
                            onClick={handleShare}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className='flex items-center gap-2 px-6 py-3 bg-white rounded-full border-2 border-pink-200 text-gray-700 font-medium shadow-md hover:border-pink-300 transition-colors'
                        >
                            <ShareIcon className='w-5 h-5' />
                            Share
                        </motion.button>
                        <motion.button
                            onClick={handleBookmark}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className='flex items-center gap-2 px-6 py-3 bg-white rounded-full border-2 border-pink-200 text-gray-700 font-medium shadow-md hover:border-pink-300 transition-colors'
                        >
                            <BookmarkIcon className='w-5 h-5' />
                            Bookmark
                        </motion.button>
                    </div>

                    {/* Article Content */}
                    <div
                        className='prose prose-lg prose-pink max-w-none mb-12'
                        dangerouslySetInnerHTML={{ __html: post.content }}
                        style={{
                            fontSize: '1.125rem',
                            lineHeight: '1.75',
                            color: '#374151',
                        }}
                    />

                    {/* Tags */}
                    <div className='flex items-center gap-3 mb-12'>
                        <TagIcon className='w-5 h-5 text-gray-600' />
                        <div className='flex flex-wrap gap-2'>
                            {post.tags.map((tag: string) => (
                                <motion.button
                                    key={tag}
                                    onClick={() => {
                                        toast.info(`Filtering by #${tag}...`);
                                        navigate('/blog');
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className='px-4 py-2 bg-gradient-to-r from-pink-50 to-purple-50 text-pink-600 rounded-full text-sm font-medium cursor-pointer hover:from-pink-100 hover:to-purple-100 transition-colors'
                                >
                                    #{tag}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='bg-gradient-to-r from-pink-500 to-purple-500 rounded-3xl p-12 text-center text-white'
                    >
                        <h3 className='text-3xl font-bold mb-4'>Ready to Transform Your Skin?</h3>
                        <p className='text-lg mb-8 text-white/90'>
                            Book a consultation with our experts and start your journey to beautiful skin today.
                        </p>
                        <motion.button
                            onClick={() => navigate('/booking')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className='px-8 py-4 bg-white text-pink-600 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-shadow'
                        >
                            Book Appointment
                        </motion.button>
                    </motion.div>
                </motion.article>
            </div>
        </div>
    );
}
