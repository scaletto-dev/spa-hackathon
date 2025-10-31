import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, SparklesIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BookingStepProps } from './types';
import { getFeaturedServices } from '../../../services/servicesApi';
import { formatPrice } from '../../../utils/format';
import type { Service } from '../../../types/service';

export function BookingServiceSelect({ bookingData, updateBookingData, onNext }: Omit<BookingStepProps, 'onPrev'>) {
    const { t } = useTranslation('common');
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadServices = async () => {
            try {
                setLoading(true);
                const data = await getFeaturedServices();
                setServices(data);
            } catch (err) {
                setError('Failed to load services');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadServices();
    }, []);

    const selectedServiceIds = bookingData.serviceIds || [];

    const handleToggleService = (serviceId: string) => {
        const newIds = selectedServiceIds.includes(serviceId)
            ? selectedServiceIds.filter(id => id !== serviceId)
            : [...selectedServiceIds, serviceId];
        
        // Get all selected services details
        const selectedServicesList = newIds
            .map(id => services.find(s => s.id === id))
            .filter((s): s is Service => s !== undefined)
            .map(selectedService => ({
                id: selectedService.id,
                name: selectedService.name,
                categoryName: selectedService.categoryName || 'Service',
                price: parseFloat(selectedService.price),
                duration: selectedService.duration.toString(),
                images: selectedService.images,
                excerpt: selectedService.excerpt,
            }));

        // Update with all selected services
        const updateData: any = { 
            serviceIds: newIds,
            selectedServices: selectedServicesList,
        };
        if (selectedServicesList.length > 0) {
            updateData.service = selectedServicesList[0];
        }
        updateBookingData(updateData);
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
                <h2 className='text-2xl font-bold text-gray-800 mb-4'>{t('bookings.selectService')}</h2>
                <p className='text-gray-600 mb-2'>{t('bookings.selectServiceDesc')}</p>
                {selectedServiceIds.length > 0 && (
                    <p className='text-pink-600 font-medium'>
                        {selectedServiceIds.length} service{selectedServiceIds.length !== 1 ? 's' : ''} selected
                    </p>
                )}
            </div>

            {loading && <div className='text-center py-12 text-gray-500'>Loading services...</div>}
            {error && <div className='text-center py-12 text-red-500'>{error}</div>}

            {!loading && !error && (
                <>
                    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
                        {services.map((service) => {
                            const isSelected = selectedServiceIds.includes(service.id);
                            const imageUrl = service.images && service.images.length > 0 
                                ? service.images[0] 
                                : 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(service.name);
                            
                            return (
                                <motion.div
                                    key={service.id}
                                    whileHover={{
                                        y: -5,
                                    }}
                                    onClick={() => handleToggleService(service.id)}
                                    className={`cursor-pointer bg-white/70 backdrop-blur-xl rounded-3xl border-2 ${
                                        isSelected
                                            ? 'border-pink-500 shadow-lg shadow-pink-200'
                                            : 'border-white/50 shadow-lg'
                                    } overflow-hidden transition-all`}
                                >
                                    <div className='relative h-44 overflow-hidden'>
                                        <img src={imageUrl} alt={service.name} className='w-full h-full object-cover' />
                                        <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
                                        <div className='absolute bottom-4 left-4 right-4'>
                                            <span className='px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-xs font-medium text-pink-600'>
                                                {service.categoryName}
                                            </span>
                                            <h3 className='text-xl font-bold text-white mt-2'>{service.name}</h3>
                                        </div>
                                        {isSelected && (
                                            <div className='absolute top-4 right-4 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center'>
                                                <SparklesIcon className='w-5 h-5 text-white' />
                                            </div>
                                        )}
                                    </div>
                                    <div className='p-5'>
                                        <div className='flex justify-between text-sm text-gray-700 mb-3'>
                                            <span>{service.duration}</span>
                                            <span className='font-semibold'>{formatPrice(service.price)}</span>
                                        </div>
                                        <p className='text-gray-600 text-sm line-clamp-2'>{service.excerpt}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
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
                            disabled={selectedServiceIds.length === 0}
                            className={`flex items-center gap-2 px-8 py-4 rounded-full font-semibold shadow-xl ${
                                selectedServiceIds.length > 0
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {t('common.continue')}
                            <ArrowRightIcon className='w-5 h-5' />
                        </motion.button>
                    </div>
                </>
            )}
        </motion.div>
    );
}
