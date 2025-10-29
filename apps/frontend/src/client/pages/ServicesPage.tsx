import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ServicesBanner } from '../components/services/ServicesBanner';
import { CategoryFilter } from '../components/services/CategoryFilter';
import { ServiceCard } from '../components/services/ServiceCard';
import { ServicesCTA } from '../components/services/ServicesCTA';
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
    {
        id: 7,
        category: 'Laser',
        image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&h=400&fit=crop',
        title: 'Laser Skin Rejuvenation',
        description: 'Advanced laser therapy to improve skin texture, tone, and reduce signs of aging',
        duration: '60 min',
        price: '$280',
    },
    {
        id: 8,
        category: 'Anti-Aging',
        image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&h=400&fit=crop',
        title: 'Microneedling',
        description: 'Collagen induction therapy that improves skin texture, scars, and fine lines',
        duration: '75 min',
        price: '$320',
    },
    {
        id: 9,
        category: 'Body',
        image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&h=400&fit=crop',
        title: 'Cellulite Reduction',
        description: 'Advanced treatment to reduce the appearance of cellulite and improve skin smoothness',
        duration: '60 min',
        price: '$250',
    },
];
const categories = ['All', 'Facial', 'Body', 'Laser', 'Anti-Aging'];
export function ServicesPage() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const filteredServices =
        selectedCategory === 'All' ? services : services.filter((service) => service.category === selectedCategory);
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
                    <motion.div layout className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {filteredServices.map((service, index) => (
                            <ServiceCard key={service.id} service={service} index={index} />
                        ))}
                    </motion.div>
                </div>
            </section>
            <ServicesCTA />
        </div>
    );
}
