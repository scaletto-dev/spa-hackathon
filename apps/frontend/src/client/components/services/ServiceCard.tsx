import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ClockIcon, DollarSignIcon, ArrowRightIcon } from 'lucide-react';
import { toast } from '../../../utils/toast';

interface Service {
    id: number;
    category: string;
    image: string;
    title: string;
    description: string;
    duration: string;
    price: string;
}

interface ServiceCardProps {
    service: Service;
    index: number;
}

export function ServiceCard({ service, index }: ServiceCardProps) {
    const navigate = useNavigate();

    const handleBookNow = () => {
        // Store selected service in sessionStorage
        sessionStorage.setItem('selectedService', JSON.stringify(service));
        toast.success(`Selected: ${service.title}`);
        navigate('/booking');
    };
    return (
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
                delay: index * 0.1,
            }}
            whileHover={{
                y: -10,
                scale: 1.02,
            }}
            className='group'
        >
            <div className='h-full bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl overflow-hidden hover:shadow-2xl transition-all'>
                {/* Image */}
                <div className='relative h-56 overflow-hidden'>
                    <img
                        src={service.image}
                        alt={service.title}
                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent' />
                    <div className='absolute top-4 left-4'>
                        <span className='px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-sm font-medium text-pink-600'>
                            {service.category}
                        </span>
                    </div>
                </div>
                {/* Content */}
                <div className='p-6 space-y-4'>
                    <h3 className='text-2xl font-bold text-gray-800 group-hover:text-pink-600 transition-colors'>
                        {service.title}
                    </h3>
                    <p className='text-gray-600 leading-relaxed line-clamp-2'>{service.description}</p>
                    {/* Duration and Price */}
                    <div className='flex items-center justify-between pt-4 border-t border-gray-200'>
                        <div className='flex items-center gap-2 text-gray-700'>
                            <ClockIcon className='w-5 h-5 text-pink-500' />
                            <span className='font-medium'>{service.duration}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                            <DollarSignIcon className='w-5 h-5 text-purple-500' />
                            <span className='text-2xl font-bold text-gray-800'>{service.price.replace('$', '')}</span>
                        </div>
                    </div>
                    {/* Book Now Button */}
                    <motion.button
                        onClick={handleBookNow}
                        data-testid={`book-service-${service.id}`}
                        whileHover={{
                            scale: 1.02,
                        }}
                        whileTap={{
                            scale: 0.98,
                        }}
                        className='w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-shadow group/btn'
                    >
                        Book Now
                        <ArrowRightIcon className='w-5 h-5 group-hover/btn:translate-x-1 transition-transform' />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
