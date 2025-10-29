import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, ScanIcon, ZapIcon, HeartIcon, Loader2 } from 'lucide-react';
import { getFeaturedServices, formatPrice, formatDuration, type Service } from '../../../services/servicesApi';
import { Link } from 'react-router-dom';

// Map category names to icons and gradients
const categoryStyles: Record<string, { icon: typeof SparklesIcon; gradient: string }> = {
  'Facial Treatments': { icon: SparklesIcon, gradient: 'from-pink-400 to-rose-400' },
  'Laser Treatments': { icon: ZapIcon, gradient: 'from-rose-400 to-pink-400' },
  'Anti-Aging': { icon: HeartIcon, gradient: 'from-pink-400 to-purple-400' },
  'Body Treatments': { icon: ScanIcon, gradient: 'from-purple-400 to-rose-400' },
};

// Default fallback style
const defaultStyle = { icon: SparklesIcon, gradient: 'from-purple-400 to-pink-400' };

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await getFeaturedServices(6);
        setServices(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load services:', err);
        setError('Không thể tải dịch vụ. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-24 px-6">
        <div className="max-w-7xl mx-auto flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-500 p-8 bg-red-50 rounded-2xl">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Dịch Vụ Của Chúng Tôi
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Trải nghiệm các dịch vụ chăm sóc sắc đẹp hàng đầu với công nghệ AI tiên tiến
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const style = categoryStyles[service.categoryName || ''] || defaultStyle;
            const IconComponent = style.icon;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Link to={`/services/${service.slug}`} className="block h-full">
                  <div className="h-full bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl overflow-hidden hover:shadow-2xl transition-all">
                    {/* Service Image */}
                    {service.images && service.images.length > 0 && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={service.images[0]}
                          alt={service.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        
                        {/* Category Badge */}
                        {service.categoryName && (
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                            {service.categoryName}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-6">
                      {/* Icon */}
                      <div className={`w-14 h-14 bg-gradient-to-br ${style.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                        {service.name}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                        {service.excerpt}
                      </p>

                      {/* Duration and Price */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500">
                          ⏱️ {formatDuration(service.duration)}
                        </span>
                        <span className="text-lg font-bold text-pink-600">
                          {formatPrice(service.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View All Services Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all"
          >
            Xem Tất Cả Dịch Vụ
            <span className="text-xl">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}