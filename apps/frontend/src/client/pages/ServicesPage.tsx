import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ServicesBanner } from '../components/services/ServicesBanner';
import { CategoryFilter } from '../components/services/CategoryFilter';
import { ServiceCard } from '../components/services/ServiceCard';
import { ServicesCTA } from '../components/services/ServicesCTA';
import { servicesApi, type Service, type ServiceCategory } from '../../services/servicesApi';

export function ServicesPage() {
    const { t } = useTranslation('common');
    const [services, setServices] = useState<Service[]>([]);
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [initialLoading, setInitialLoading] = useState(true); // First time loading
    const [loading, setLoading] = useState(false); // Subsequent loading
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 9; // 3x3 grid

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                const data = await servicesApi.getAllCategories();
                setCategories(data);
            } catch (err) {
                console.error('Failed to load categories:', err);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    // Fetch services when category or page changes
    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);

                const response = await servicesApi.getServices({
                    page,
                    limit,
                    ...(selectedCategory !== 'All' && { categoryId: selectedCategory }),
                });
                setServices(response.data);
                setTotalPages(response.meta.totalPages);
                setError(null);
            } catch (err) {
                console.error('Failed to load services:', err);
                setError(t('home.services.error'));
            } finally {
                setLoading(false);
                setInitialLoading(false);
            }
        };

        fetchServices();
    }, [selectedCategory, page, t]);

    // Reset page when category changes
    useEffect(() => {
        setPage(1);
    }, [selectedCategory]);

    // Show full page loading only on initial load
    if (initialLoading) {
        return (
            <div className='w-full min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center'>
                <Loader2 className='w-12 h-12 text-pink-500 animate-spin' />
            </div>
        );
    }

    return (
        <div className='w-full min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50'>
            <ServicesBanner />
            <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                loading={loadingCategories}
            />
            <section className='w-full py-16 px-6'>
                <div className='max-w-7xl mx-auto relative'>
                    {/* Loading overlay for subsequent loads */}
                    {loading && !initialLoading && (
                        <div className='absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-3xl'>
                            <Loader2 className='w-8 h-8 text-pink-500 animate-spin' />
                        </div>
                    )}

                    {error ? (
                        <div className='text-center text-red-600 py-12 bg-red-50 rounded-2xl'>
                            <p>{error}</p>
                        </div>
                    ) : services.length === 0 ? (
                        <div className='text-center text-gray-600 py-12'>
                            <p>{t('services.noServicesFound')}</p>
                        </div>
                    ) : (
                        <>
                            <motion.div layout className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
                                {services.map((service, index) => (
                                    <ServiceCard key={service.id} service={service} index={index} />
                                ))}
                            </motion.div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className='flex justify-center items-center gap-2 mt-12'>
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className='p-2 rounded-lg border border-gray-300 hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                                    >
                                        <ChevronLeft className='w-5 h-5' />
                                    </button>

                                    <div className='flex gap-2'>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                            <button
                                                key={pageNum}
                                                onClick={() => setPage(pageNum)}
                                                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                                    page === pageNum
                                                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                                                        : 'border border-gray-300 hover:bg-pink-50'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className='p-2 rounded-lg border border-gray-300 hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                                    >
                                        <ChevronRight className='w-5 h-5' />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
            <ServicesCTA />
        </div>
    );
}

export default ServicesPage;
