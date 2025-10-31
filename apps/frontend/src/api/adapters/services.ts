/**
 * Services API Adapter (MOCK)
 * TODO: Replace with real API integration when backend is ready
 */

// ============= Types =============

export interface ServiceDetail {
    id: number;
    name: string;
    category: string;
    description: string;
    longDescription: string;
    excerpt: string;
    duration: string;
    price: number;
    image: string;
    images: string[];
    beforeAfterPhotos?: { before: string; after: string }[];
    benefits: string[];
    faqs: { question: string; answer: string }[];
    averageRating: number;
    totalReviews: number;
    active: boolean;
}

export interface RelatedService {
    id: number;
    name: string;
    category: string;
    excerpt: string;
    duration: string;
    price: number;
    image: string;
}

// ============= Mock Data =============

const MOCK_SERVICES_DETAIL: Record<number, ServiceDetail> = {
    1: {
        id: 1,
        name: 'AI Skin Analysis Facial',
        category: 'Facial',
        description:
            'Advanced AI technology analyzes your skin and creates a personalized treatment plan',
        longDescription:
            'Our AI Skin Analysis Facial combines cutting-edge technology with expert skincare knowledge. Using advanced AI algorithms, we analyze over 1000 facial data points to create a truly personalized treatment plan.\n\nThe treatment begins with a comprehensive skin analysis using our state-of-the-art AI scanner. This technology evaluates skin texture, hydration levels, pigmentation, pore size, and signs of aging. Based on this analysis, our skincare experts customize a facial treatment specifically for your skin needs.\n\nThe facial includes deep cleansing, gentle exfoliation, extractions if needed, a customized mask, and a relaxing facial massage. We finish with serums and moisturizers selected specifically for your skin type.',
        excerpt:
            'Advanced AI technology analyzes your skin and creates a personalized treatment plan',
        duration: '60 min',
        price: 150,
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&h=600&fit=crop',
        ],
        beforeAfterPhotos: [
            {
                before: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=400&fit=crop',
                after: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
            },
        ],
        benefits: [
            'Personalized treatment based on AI skin analysis',
            'Deep cleansing and exfoliation',
            'Improved skin texture and tone',
            'Reduced appearance of fine lines',
            'Enhanced hydration and glow',
            'Professional skincare recommendations',
        ],
        faqs: [
            {
                question: 'How does the AI skin analysis work?',
                answer: 'Our AI scanner captures high-resolution images of your skin and analyzes over 1000 data points including texture, hydration, pigmentation, and pore size. The results are instant and guide our treatment approach.',
            },
            {
                question: 'Is this suitable for sensitive skin?',
                answer: 'Yes! The AI analysis helps us identify your exact skin type and sensitivity level, allowing us to customize products and techniques specifically for sensitive skin.',
            },
            {
                question: 'How often should I get this treatment?',
                answer: 'For optimal results, we recommend monthly treatments. However, frequency can be adjusted based on your skin goals and the AI analysis recommendations.',
            },
        ],
        averageRating: 4.8,
        totalReviews: 127,
        active: true,
    },
    2: {
        id: 2,
        name: 'Hydrafacial Treatment',
        category: 'Facial',
        description: 'Deep cleansing, exfoliation, and hydration treatment',
        longDescription:
            'The Hydrafacial is a revolutionary skincare treatment that combines cleansing, exfoliation, extraction, hydration, and antioxidant protection all in one session.\n\nThis medical-grade facial uses patented vortex-fusion technology to deeply cleanse pores while simultaneously infusing hydrating serums. The treatment is completely non-invasive, painless, and requires no downtime.\n\nEach Hydrafacial includes three essential steps: Cleanse & Peel to uncover a new layer of skin, Extract & Hydrate to remove impurities while nourishing with intense moisturizers, and Fuse & Protect with antioxidants and peptides to maximize your glow.',
        excerpt:
            'Deep cleansing, exfoliation, and hydration treatment that leaves your skin glowing',
        duration: '45 min',
        price: 180,
        image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=600&fit=crop',
        ],
        benefits: [
            'Instant visible results',
            'Deep pore cleansing',
            'Improved skin hydration',
            'Reduced fine lines and wrinkles',
            'Even skin tone',
            'No downtime required',
        ],
        faqs: [
            {
                question: 'Is there any downtime?',
                answer: 'No! Hydrafacial is gentle and non-invasive. You can return to normal activities immediately after treatment.',
            },
            {
                question: 'Will I see results immediately?',
                answer: 'Yes, most clients notice a visible improvement in skin texture and radiance immediately after the first treatment.',
            },
        ],
        averageRating: 4.9,
        totalReviews: 203,
        active: true,
    },
    3: {
        id: 3,
        name: 'Laser Hair Removal',
        category: 'Laser',
        description: 'Permanent hair reduction using state-of-the-art laser technology',
        longDescription:
            'Our advanced laser hair removal system uses cutting-edge technology to safely and effectively reduce unwanted hair. The laser targets hair follicles with precision, destroying them at the root while leaving surrounding skin undamaged.\n\nTreatment sessions are quick and relatively comfortable. Most clients describe the sensation as similar to a rubber band snap against the skin. Our skilled technicians adjust settings based on your skin type and hair color for optimal safety and results.\n\nMultiple sessions are required for best results, as the laser is most effective during the active growth phase of hair. Most clients see significant hair reduction after 6-8 sessions.',
        excerpt: 'Permanent hair reduction using state-of-the-art laser technology for smooth skin',
        duration: '30-90 min',
        price: 120,
        image: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=800&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=800&h=600&fit=crop',
        ],
        benefits: [
            'Long-lasting hair reduction',
            'Smooth, hair-free skin',
            'No more shaving or waxing',
            'Reduced ingrown hairs',
            'Cost-effective long-term solution',
            'Suitable for most body areas',
        ],
        faqs: [
            {
                question: 'How many sessions will I need?',
                answer: 'Most clients require 6-8 sessions spaced 4-6 weeks apart for optimal results. The exact number depends on hair color, skin type, and treatment area.',
            },
            {
                question: 'Does it hurt?',
                answer: 'Most people experience mild discomfort, similar to a rubber band snap. We use cooling technology to minimize any discomfort during treatment.',
            },
        ],
        averageRating: 4.7,
        totalReviews: 189,
        active: true,
    },
};

const MOCK_RELATED_SERVICES: Record<number, RelatedService[]> = {
    1: [
        {
            id: 2,
            name: 'Hydrafacial Treatment',
            category: 'Facial',
            excerpt: 'Deep cleansing and hydration for glowing skin',
            duration: '45 min',
            price: 180,
            image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop',
        },
        {
            id: 6,
            name: 'Chemical Peel',
            category: 'Facial',
            excerpt: 'Exfoliating treatment for brighter, smoother skin',
            duration: '45 min',
            price: 200,
            image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop',
        },
        {
            id: 8,
            name: 'Microneedling',
            category: 'Anti-Aging',
            excerpt: 'Collagen induction therapy for improved texture',
            duration: '75 min',
            price: 320,
            image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=300&fit=crop',
        },
    ],
    2: [
        {
            id: 1,
            name: 'AI Skin Analysis Facial',
            category: 'Facial',
            excerpt: 'Personalized facial with AI technology',
            duration: '60 min',
            price: 150,
            image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop',
        },
        {
            id: 6,
            name: 'Chemical Peel',
            category: 'Facial',
            excerpt: 'Exfoliating treatment for brighter skin',
            duration: '45 min',
            price: 200,
            image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop',
        },
    ],
    3: [
        {
            id: 7,
            name: 'Laser Skin Rejuvenation',
            category: 'Laser',
            excerpt: 'Advanced laser therapy for improved skin',
            duration: '60 min',
            price: 280,
            image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&h=300&fit=crop',
        },
    ],
};

// ============= API Functions (MOCK) =============

export async function getServiceDetail(id: number): Promise<ServiceDetail> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const service = MOCK_SERVICES_DETAIL[id];
    if (!service) {
        throw new Error(`Service with id ${id} not found`);
    }
    return service;
}

export async function getRelatedServices(id: number): Promise<RelatedService[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return MOCK_RELATED_SERVICES[id] || [];
}
