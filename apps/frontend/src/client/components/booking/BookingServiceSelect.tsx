import { motion } from 'framer-motion';
import { ArrowRightIcon, SparklesIcon } from 'lucide-react';
import { BookingStepProps } from './types';

const services = [
    {
        id: 1,
        category: 'Facial',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop',
        title: 'AI Skin Analysis Facial',
        description:
            'Advanced AI technology analyzes your skin and creates a personalized treatment plan for optimal results',
        duration: '60 min',
        price: '$150',
    },
    {
        id: 2,
        category: 'Facial',
        image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&h=400&fit=crop',
        title: 'Hydrafacial Treatment',
        description: 'Deep cleansing, exfoliation, and hydration treatment that leaves your skin glowing and refreshed',
        duration: '45 min',
        price: '$180',
    },
    {
        id: 3,
        category: 'Laser',
        image: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=600&h=400&fit=crop',
        title: 'Laser Hair Removal',
        description: 'Permanent hair reduction using state-of-the-art laser technology for smooth, hair-free skin',
        duration: '30-90 min',
        price: '$120',
    },
    {
        id: 4,
        category: 'Anti-Aging',
        image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=400&fit=crop',
        title: 'Botox & Fillers',
        description: 'FDA-approved injectables to reduce wrinkles and restore volume for a youthful appearance',
        duration: '30 min',
        price: '$350',
    },
    {
        id: 5,
        category: 'Body',
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop',
        title: 'Body Contouring',
        description: 'Non-invasive body sculpting to reduce fat and tighten skin for your desired body shape',
        duration: '90 min',
        price: '$450',
    },
    {
        id: 6,
        category: 'Facial',
        image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=600&h=400&fit=crop',
        title: 'Chemical Peel',
        description: 'Exfoliating treatment that removes dead skin cells and reveals brighter, smoother skin',
        duration: '45 min',
        price: '$200',
    },
];
export function BookingServiceSelect({ bookingData, updateBookingData, onNext }: Omit<BookingStepProps, 'onPrev'>) {
    const handleSelectService = (service: (typeof services)[number]) => {
        updateBookingData({
            service,
        });
    };
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 20,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            exit={{
                opacity: 0,
                y: -20,
            }}
            transition={{
                duration: 0.5,
            }}
        >
            <div className='mb-8'>
                <h2 className='text-2xl font-bold text-gray-800 mb-4'>Select a Service</h2>
                <p className='text-gray-600'>Choose from our range of AI-enhanced beauty treatments</p>
            </div>
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
                {services.map((service) => (
                    <motion.div
                        key={service.id}
                        whileHover={{
                            y: -5,
                        }}
                        onClick={() => handleSelectService(service)}
                        className={`cursor-pointer bg-white/70 backdrop-blur-xl rounded-3xl border-2 ${bookingData.service?.id === service.id ? 'border-pink-500 shadow-lg shadow-pink-200' : 'border-white/50 shadow-lg'} overflow-hidden transition-all`}
                    >
                        <div className='relative h-44 overflow-hidden'>
                            <img src={service.image} alt={service.title} className='w-full h-full object-cover' />
                            <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
                            <div className='absolute bottom-4 left-4 right-4'>
                                <span className='px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-xs font-medium text-pink-600'>
                                    {service.category}
                                </span>
                                <h3 className='text-xl font-bold text-white mt-2'>{service.title}</h3>
                            </div>
                            {bookingData.service?.id === service.id && (
                                <div className='absolute top-4 right-4 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center'>
                                    <SparklesIcon className='w-5 h-5 text-white' />
                                </div>
                            )}
                        </div>
                        <div className='p-5'>
                            <div className='flex justify-between text-sm text-gray-700 mb-3'>
                                <span>{service.duration}</span>
                                <span className='font-semibold'>{service.price}</span>
                            </div>
                            <p className='text-gray-600 text-sm line-clamp-2'>{service.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
            <div className='flex justify-end mt-12'>
                <motion.button
                    whileHover={{
                        scale: 1.05,
                    }}
                    whileTap={{
                        scale: 0.95,
                    }}
                    onClick={onNext}
                    disabled={!bookingData.service}
                    className={`flex items-center gap-2 px-8 py-4 rounded-full font-semibold shadow-xl ${bookingData.service ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                >
                    Continue
                    <ArrowRightIcon className='w-5 h-5' />
                </motion.button>
            </div>
        </motion.div>
    );
}
