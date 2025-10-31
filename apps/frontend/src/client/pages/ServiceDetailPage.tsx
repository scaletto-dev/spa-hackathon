import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    Clock,
    DollarSign,
    Star,
    Check,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Calendar,
    ArrowRight,
    PenSquare,
} from 'lucide-react';
import { servicesApi, type Service, formatPrice, formatDuration } from '../../services/servicesApi';
import { WriteReviewModal } from '../components/reviews/WriteReviewModal';

export default function ServiceDetailPage() {
    const { t } = useTranslation('common');
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);

    const [service, setService] = useState<Service | null>(null);
    const [relatedServices, setRelatedServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

    useEffect(() => {
        if (!id) return;
        loadServiceData(id);
    }, [id]);

    const loadServiceData = async (serviceId: string) => {
        try {
            setIsLoading(true);
            setError(null);

            // Fetch service detail
            const serviceData = await servicesApi.getServiceById(serviceId);
            setService(serviceData);

            // Fetch related services (same category)
            if (serviceData.categoryId) {
                const relatedResponse = await servicesApi.getServices({
                    categoryId: serviceData.categoryId,
                    limit: 3,
                });
                // Filter out current service
                const related = relatedResponse.data.filter((s) => s.id !== serviceId);
                setRelatedServices(related.slice(0, 3));
            }
        } catch (err) {
            setError(t('services.loadError'));
            console.error('Load service error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBookNow = () => {
        navigate('/booking', {
            state: {
                preSelectedService: service
                    ? {
                          id: service.id,
                          title: service.name,
                          category: service.categoryName || 'Service',
                          price: formatPrice(service.price),
                          duration: formatDuration(typeof service.duration === 'number' ? service.duration : parseInt(service.duration) || 60),
                          image: service.images[0],
                          description: service.description,
                      }
                    : null,
            },
        });
    };

    const handleRelatedServiceClick = (relatedId: string) => {
        navigate(`/services/${relatedId}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isLoading) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pt-20 flex items-center justify-center'>
                <div className='flex flex-col items-center gap-4'>
                    <Loader2 className='w-12 h-12 text-pink-500 animate-spin' />
                    <p className='text-gray-600'>{t('services.loadingServiceInfo')}</p>
                </div>
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pt-20'>
                <div className='max-w-4xl mx-auto px-4 py-16'>
                    <div className='bg-white rounded-2xl shadow-lg p-8 text-center'>
                        <p className='text-red-600 mb-4'>⚠️ {error || t('services.serviceNotFound')}</p>
                        <Link
                            to='/services'
                            className='inline-block px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors'
                        >
                            {t('services.backToServiceList')}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pt-24 pb-16'>
            <div className='max-w-7xl mx-auto px-4'>
                {/* Back Button */}
                <Link
                    to='/services'
                    className='inline-flex items-center text-pink-600 hover:text-pink-700 mb-6 transition-colors'
                >
                    <ChevronLeft className='w-4 h-4 mr-1' />
                    {t('services.backToServiceList')}
                </Link>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12'>
                    {/* Left Column - Images */}
                    <div className='space-y-4'>
                        {/* Main Image */}
                        <motion.div
                            key={selectedImageIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className='relative w-full h-96 rounded-2xl overflow-hidden bg-white shadow-xl'
                        >
                            <img
                                src={service.images[selectedImageIndex]}
                                alt={service.name}
                                className='w-full h-full object-cover'
                            />
                            <div className='absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full'>
                                <span className='text-sm font-semibold text-pink-600'>{service.categoryName || 'Service'}</span>
                            </div>
                        </motion.div>

                        {/* Image Gallery Thumbnails */}
                        {service.images.length > 1 && (
                            <div className='flex gap-3 overflow-x-auto pb-2'>
                                {service.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                                            selectedImageIndex === index
                                                ? 'border-pink-500 ring-2 ring-pink-200'
                                                : 'border-gray-200 hover:border-pink-300'
                                        }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`${service.name} ${index + 1}`}
                                            className='w-full h-full object-cover'
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column - Service Info */}
                    <div className='space-y-6'>
                        <div>
                            <h1 className='text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4'>
                                {service.name}
                            </h1>
                            <p className='text-lg text-gray-600'>{service.excerpt}</p>
                        </div>

                        {/* Rating - Placeholder for now */}
                        <div className='flex items-center gap-4'>
                            <div className='flex items-center gap-1'>
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${
                                            i < 5 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className='text-gray-600'>{t('services.qualityService')}</span>
                        </div>

                        {/* Price & Duration */}
                        <div className='flex items-center gap-6 p-6 bg-white rounded-2xl shadow-lg'>
                            <div className='flex items-center gap-3'>
                                <div className='p-3 bg-pink-100 rounded-full'>
                                    <DollarSign className='w-6 h-6 text-pink-600' />
                                </div>
                                <div>
                                    <p className='text-sm text-gray-500'>{t('services.servicePrice')}</p>
                                    <p className='text-2xl font-bold text-gray-900'>{formatPrice(service.price)}</p>
                                </div>
                            </div>
                            <div className='w-px h-12 bg-gray-200' />
                            <div className='flex items-center gap-3'>
                                <div className='p-3 bg-purple-100 rounded-full'>
                                    <Clock className='w-6 h-6 text-purple-600' />
                                </div>
                                <div>
                                    <p className='text-sm text-gray-500'>{t('bookings.duration')}</p>
                                    <p className='text-xl font-bold text-gray-900'>
                                        {formatDuration(typeof service.duration === 'number' ? service.duration : parseInt(service.duration) || 60)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={handleBookNow}
                            className='w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all'
                        >
                            <Calendar className='w-6 h-6' />
                            {t('services.bookNow')}
                            <ArrowRight className='w-5 h-5' />
                        </button>

                        {/* Write Review Button */}
                        <button
                            onClick={() => setIsWriteReviewOpen(true)}
                            className='w-full flex items-center justify-center gap-2 px-8 py-3 border-2 border-pink-500 text-pink-600 rounded-2xl font-semibold hover:bg-pink-50 transition-all'
                        >
                            <PenSquare className='w-5 h-5' />
                            {t('services.writeReview')}
                        </button>

                        <p className='text-sm text-gray-500 text-center'>{t('services.quickBookingConfirm')}</p>
                    </div>
                </div>

                {/* Description Section */}
                <div className='bg-white rounded-2xl shadow-xl p-8 mb-8'>
                    <h2 className='text-2xl font-bold text-gray-900 mb-4'>{t('services.detailedDescription')}</h2>
                    <div className='prose prose-lg max-w-none text-gray-700 whitespace-pre-line'>
                        {service.longDescription}
                    </div>
                </div>

                {/* Benefits Section */}
                <div className='bg-white rounded-2xl shadow-xl p-8 mb-8'>
                    <h2 className='text-2xl font-bold text-gray-900 mb-6'>{t('services.serviceBenefits')}</h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {(service.benefits || []).map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className='flex items-start gap-3'
                            >
                                <div className='flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1'>
                                    <Check className='w-4 h-4 text-green-600' />
                                </div>
                                <p className='text-gray-700'>{benefit}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Before/After Photos */}
                {service.beforeAfterPhotos && service.beforeAfterPhotos.length > 0 && (
                    <div className='bg-white rounded-2xl shadow-xl p-8 mb-8'>
                        <h2 className='text-2xl font-bold text-gray-900 mb-6'>{t('services.resultPhotos')}</h2>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                            {service.beforeAfterPhotos.map((photo, index) => (
                                <div key={index} className='rounded-xl overflow-hidden shadow-lg'>
                                    <img
                                        src={photo}
                                        alt={t('services.result', { index: index + 1 })}
                                        className='w-full h-64 object-cover hover:scale-105 transition-transform'
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* FAQs Section */}
                {service.faqs && service.faqs.length > 0 && (
                    <div className='bg-white rounded-2xl shadow-xl p-8 mb-8'>
                        <h2 className='text-2xl font-bold text-gray-900 mb-6'>{t('services.faqs')}</h2>
                        <div className='space-y-4'>
                            {service.faqs.map((faq, index) => (
                                <div key={index} className='border border-gray-200 rounded-xl overflow-hidden'>
                                    <button
                                        onClick={() => setExpandedFaqIndex(expandedFaqIndex === index ? null : index)}
                                        className='w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors'
                                    >
                                        <span className='font-semibold text-gray-900'>{faq.question}</span>
                                        <ChevronRight
                                            className={`w-5 h-5 text-gray-400 transition-transform ${
                                                expandedFaqIndex === index ? 'rotate-90' : ''
                                            }`}
                                        />
                                    </button>
                                    {expandedFaqIndex === index && (
                                        <div className='px-5 pb-5 text-gray-600'>{faq.answer}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Related Services */}
                {relatedServices.length > 0 && (
                    <div className='bg-white rounded-2xl shadow-xl p-8'>
                        <h2 className='text-2xl font-bold text-gray-900 mb-6'>{t('services.relatedServices')}</h2>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                            {relatedServices.map((related) => (
                                <motion.div
                                    key={related.id}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => handleRelatedServiceClick(related.id)}
                                    className='cursor-pointer bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all'
                                >
                                    <div className='relative h-48'>
                                        <img
                                            src={related.images[0]}
                                            alt={related.name}
                                            className='w-full h-full object-cover'
                                        />
                                        <div className='absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-pink-600'>
                                            {related.categoryName || t('services.service')}
                                        </div>
                                    </div>
                                    <div className='p-4'>
                                        <h3 className='font-bold text-gray-900 mb-2'>{related.name}</h3>
                                        <p className='text-sm text-gray-600 mb-3 line-clamp-2'>{related.excerpt}</p>
                                        <div className='flex items-center justify-between'>
                                            <span className='text-sm text-gray-500'>
                                                {formatDuration(typeof related.duration === 'number' ? related.duration : parseInt(related.duration) || 60)}
                                            </span>
                                            <span className='text-lg font-bold text-pink-600'>
                                                {formatPrice(related.price)}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Write Review Modal */}
            <WriteReviewModal
                isOpen={isWriteReviewOpen}
                onClose={() => setIsWriteReviewOpen(false)}
                serviceName={service?.name}
                serviceId={service?.id}
            />
        </div>
    );
}
