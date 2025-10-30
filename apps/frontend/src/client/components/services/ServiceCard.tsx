import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ClockIcon, ArrowRightIcon, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from '../../../utils/toast';
import { formatPrice, type Service } from '../../../services/servicesApi';

interface ServiceCardProps {
    service: Service;
    index: number;
}

export function ServiceCard({ service, index }: ServiceCardProps) {
    const { t } = useTranslation('common');
    const navigate = useNavigate();

    const handleBookNow = () => {
        // Store selected service in sessionStorage
        sessionStorage.setItem('selectedService', JSON.stringify(service));
        toast.success(t('services.selected', { name: service.name }));
        navigate('/booking');
    };

    // Get first image or fallback
    const serviceImage =
        service.images && service.images.length > 0
            ? service.images[0]
            : 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop';

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
                        src={serviceImage}
                        alt={service.name}
                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent' />
                    {service.categoryName && (
                        <div className='absolute top-4 left-4'>
                            <span className='px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-sm font-medium text-pink-600'>
                                {service.categoryName}
                            </span>
                        </div>
                    )}
                </div>
                {/* Content */}
                <div className='p-6 space-y-4'>
                    <h3 className='text-2xl font-bold text-gray-800 group-hover:text-pink-600 transition-colors'>
                        {service.name}
                    </h3>
                    <p className='text-gray-600 leading-relaxed line-clamp-2'>
                        {service.excerpt || service.description}
                    </p>
                    {/* Duration and Price */}
                    <div className='flex items-center justify-between pt-4 border-t border-gray-200'>
                        <div className='flex items-center gap-2 text-gray-700'>
                            <ClockIcon className='w-5 h-5 text-pink-500' />
                            <span className='font-medium'>{service.duration}</span>
                        </div>
                        <div className='text-2xl font-bold text-gray-800'>{formatPrice(service.price)}</div>
                    </div>
                    {/* Action Buttons */}
                    <div className='flex gap-3'>
                        <Link
                            to={`/services/${service.slug}`}
                            className='flex-1 flex items-center justify-center gap-2 py-3 bg-white border-2 border-pink-500 text-pink-600 rounded-2xl font-semibold hover:bg-pink-50 transition-colors'
                        >
                            <Eye className='w-5 h-5' />
                            {t('services.details')}
                        </Link>
                        <motion.button
                            onClick={handleBookNow}
                            data-testid={`book-service-${service.id}`}
                            whileHover={{
                                scale: 1.02,
                            }}
                            whileTap={{
                                scale: 0.98,
                            }}
                            className='flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-shadow group/btn'
                        >
                            {t('services.bookNow')}
                            <ArrowRightIcon className='w-5 h-5 group-hover/btn:translate-x-1 transition-transform' />
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
