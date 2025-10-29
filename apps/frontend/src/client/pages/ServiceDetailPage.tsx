import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { getServiceDetail, getRelatedServices, type ServiceDetail, type RelatedService } from '../../api/adapters/services';

export default function ServiceDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [service, setService] = useState<ServiceDetail | null>(null);
    const [relatedServices, setRelatedServices] = useState<RelatedService[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

    useEffect(() => {
        if (!id) return;
        loadServiceData(parseInt(id));
    }, [id]);

    const loadServiceData = async (serviceId: number) => {
        try {
            setIsLoading(true);
            setError(null);
            const [serviceData, related] = await Promise.all([
                getServiceDetail(serviceId),
                getRelatedServices(serviceId),
            ]);
            setService(serviceData);
            setRelatedServices(related);
        } catch (err) {
            setError('Không thể tải thông tin dịch vụ. Vui lòng thử lại.');
            console.error('Load service error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBookNow = () => {
        navigate('/booking', {
            state: {
                preSelectedService: service ? {
                    id: service.id,
                    title: service.name,
                    category: service.category,
                    price: `$${service.price}`,
                    duration: service.duration,
                    image: service.image,
                    description: service.description,
                } : null,
            },
        });
    };

    const handleRelatedServiceClick = (relatedId: number) => {
        navigate(`/services/${relatedId}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pt-20 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
                    <p className="text-gray-600">Đang tải thông tin dịch vụ...</p>
                </div>
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pt-20">
                <div className="max-w-4xl mx-auto px-4 py-16">
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        <p className="text-red-600 mb-4">⚠️ {error || 'Không tìm thấy dịch vụ'}</p>
                        <Link
                            to="/services"
                            className="inline-block px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                        >
                            Quay lại danh sách dịch vụ
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4">
                {/* Back Button */}
                <Link
                    to="/services"
                    className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-6 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Quay lại danh sách dịch vụ
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Left Column - Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <motion.div
                            key={selectedImageIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="relative w-full h-96 rounded-2xl overflow-hidden bg-white shadow-xl"
                        >
                            <img
                                src={service.images[selectedImageIndex]}
                                alt={service.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                                <span className="text-sm font-semibold text-pink-600">{service.category}</span>
                            </div>
                        </motion.div>

                        {/* Image Gallery Thumbnails */}
                        {service.images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
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
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column - Service Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                                {service.name}
                            </h1>
                            <p className="text-lg text-gray-600">{service.excerpt}</p>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${
                                            i < Math.floor(service.averageRating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-gray-600">
                                {service.averageRating} ({service.totalReviews} đánh giá)
                            </span>
                        </div>

                        {/* Price & Duration */}
                        <div className="flex items-center gap-6 p-6 bg-white rounded-2xl shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-pink-100 rounded-full">
                                    <DollarSign className="w-6 h-6 text-pink-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Giá dịch vụ</p>
                                    <p className="text-2xl font-bold text-gray-900">${service.price}</p>
                                </div>
                            </div>
                            <div className="w-px h-12 bg-gray-200" />
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-purple-100 rounded-full">
                                    <Clock className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Thời gian</p>
                                    <p className="text-xl font-bold text-gray-900">{service.duration}</p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={handleBookNow}
                            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all"
                        >
                            <Calendar className="w-6 h-6" />
                            Đặt lịch ngay
                            <ArrowRight className="w-5 h-5" />
                        </button>

                        <p className="text-sm text-gray-500 text-center">
                            Đặt lịch nhanh chóng, xác nhận trong vòng 24h
                        </p>
                    </div>
                </div>

                {/* Description Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Mô tả chi tiết</h2>
                    <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-line">
                        {service.longDescription}
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Lợi ích của dịch vụ</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {service.benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-3"
                            >
                                <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                                    <Check className="w-4 h-4 text-green-600" />
                                </div>
                                <p className="text-gray-700">{benefit}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Before/After Photos */}
                {service.beforeAfterPhotos && service.beforeAfterPhotos.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Kết quả trước & sau</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {service.beforeAfterPhotos.map((photo, index) => (
                                <div key={index} className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-600 mb-2">Trước</p>
                                            <img
                                                src={photo.before}
                                                alt="Before"
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-600 mb-2">Sau</p>
                                            <img
                                                src={photo.after}
                                                alt="After"
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* FAQs Section */}
                {service.faqs && service.faqs.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Câu hỏi thường gặp</h2>
                        <div className="space-y-4">
                            {service.faqs.map((faq, index) => (
                                <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => setExpandedFaqIndex(expandedFaqIndex === index ? null : index)}
                                        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="font-semibold text-gray-900">{faq.question}</span>
                                        <ChevronRight
                                            className={`w-5 h-5 text-gray-400 transition-transform ${
                                                expandedFaqIndex === index ? 'rotate-90' : ''
                                            }`}
                                        />
                                    </button>
                                    {expandedFaqIndex === index && (
                                        <div className="px-5 pb-5 text-gray-600">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Related Services */}
                {relatedServices.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dịch vụ liên quan</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedServices.map((related) => (
                                <motion.div
                                    key={related.id}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => handleRelatedServiceClick(related.id)}
                                    className="cursor-pointer bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                                >
                                    <div className="relative h-48">
                                        <img
                                            src={related.image}
                                            alt={related.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-pink-600">
                                            {related.category}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900 mb-2">{related.name}</h3>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{related.excerpt}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">{related.duration}</span>
                                            <span className="text-lg font-bold text-pink-600">${related.price}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
