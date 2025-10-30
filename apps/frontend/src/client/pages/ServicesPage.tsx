import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ServicesBanner } from '../components/services/ServicesBanner';
import { CategoryFilter } from '../components/services/CategoryFilter';
import { ServiceCard } from '../components/services/ServiceCard';
import { ServicesCTA } from '../components/services/ServicesCTA';
import { servicesApi, type Service } from '../../services/servicesApi';

export function ServicesPage() {
    const { t } = useTranslation('common');
    const [services, setServices] = useState<Service[]>([]);
    const [categories, setCategories] = useState<string[]>(['All']);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchServicesAndCategories = async () => {
            try {
                setLoading(true);
                // Fetch all services
                const response = await servicesApi.getServices();
                setServices(response.data);

                // Extract unique categories from services
                const uniqueCategories = Array.from(
                    new Set(response.data.map((service) => service.categoryName).filter(Boolean)),
                ) as string[];
                setCategories(['All', ...uniqueCategories]);

                setError(null);
            } catch (err) {
                console.error('Failed to load services:', err);
                setError(t('home.services.error'));
            } finally {
                setLoading(false);
            }
        };

        fetchServicesAndCategories();
    }, []);

    // Filter services by selected category
    const filteredServices =
        selectedCategory === 'All' ? services : services.filter((service) => service.categoryName === selectedCategory);

    if (loading) {
        return (
            <div className='w-full min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center'>
                <Loader2 className='w-12 h-12 text-pink-500 animate-spin' />
            </div>
        );
    }

    if (error) {
        return (
            <div className='w-full min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center'>
                <div className='text-center text-red-500 p-8 bg-red-50 rounded-2xl max-w-md'>
                    <p>{error}</p>
                </div>
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
            />
            <section className='w-full py-16 px-6'>
                <div className='max-w-7xl mx-auto'>
                    {filteredServices.length === 0 ? (
                        <div className='text-center text-gray-600 py-12'>
                            <p>{t('services.noServicesFound')}</p>
                        </div>
                    ) : (
                        <motion.div layout className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
                            {filteredServices.map((service, index) => (
                                <ServiceCard key={service.id} service={service} index={index} />
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>
            <ServicesCTA />
        </div>
    );
}

export default ServicesPage;
