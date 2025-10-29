import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPinIcon, PhoneIcon, ClockIcon, ArrowRightIcon } from 'lucide-react';
import { BranchMap } from '../components/branches/BranchMap';
const branches = [
    {
        id: 1,
        name: 'Downtown Clinic',
        image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=400&fit=crop',
        address: '123 Main Street, Downtown, New York, NY 10001',
        phone: '(555) 123-4567',
        email: 'downtown@beautyai.com',
        hours: 'Monday - Friday: 9AM - 7PM\nSaturday: 10AM - 5PM\nSunday: Closed',
        location: {
            lat: 40.7128,
            lng: -74.006,
        },
        services: ['Facial Treatments', 'Laser Therapy', 'Skin Analysis', 'Anti-Aging'],
    },
    {
        id: 2,
        name: 'Westside Center',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop',
        address: '456 West Avenue, Westside, Los Angeles, CA 90001',
        phone: '(555) 234-5678',
        email: 'westside@beautyai.com',
        hours: 'Monday - Friday: 9AM - 8PM\nSaturday: 9AM - 6PM\nSunday: 11AM - 4PM',
        location: {
            lat: 34.0522,
            lng: -118.2437,
        },
        services: ['Body Contouring', 'Laser Hair Removal', 'Botox & Fillers', 'Chemical Peels'],
    },
    {
        id: 3,
        name: 'Eastside Spa',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop',
        address: '789 East Boulevard, Eastside, Chicago, IL 60007',
        phone: '(555) 345-6789',
        email: 'eastside@beautyai.com',
        hours: 'Monday - Friday: 10AM - 7PM\nSaturday: 10AM - 5PM\nSunday: Closed',
        location: {
            lat: 41.8781,
            lng: -87.6298,
        },
        services: ['AI Skin Analysis', 'Microneedling', 'Facial Rejuvenation', 'Wellness Consultations'],
    },
    {
        id: 4,
        name: 'North Point Clinic',
        image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&h=400&fit=crop',
        address: '321 North Road, Seattle, WA 98101',
        phone: '(555) 456-7890',
        email: 'northpoint@beautyai.com',
        hours: 'Monday - Friday: 9AM - 7PM\nSaturday: 9AM - 5PM\nSunday: Closed',
        location: {
            lat: 47.6062,
            lng: -122.3321,
        },
        services: ['Laser Treatments', 'Hydrafacial', 'Botox & Fillers', 'Body Contouring'],
    },
];
export function BranchesPage() {
    const [selectedBranch, setSelectedBranch] = useState<(typeof branches)[0] | null>(branches[0] ?? null);

    if (!selectedBranch) {
        return null; // Early return if no branch is selected
    }

    return (
        <div className='w-full min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 pt-24'>
            <div className='max-w-7xl mx-auto px-6 py-12'>
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
                    }}
                    className='text-center mb-16'
                >
                    <h1 className='text-4xl md:text-5xl font-bold mb-4'>
                        <span className='bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent'>
                            Our Locations
                        </span>
                    </h1>
                    <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                        Find your nearest BeautyAI Clinic and experience premium beauty treatments powered by
                        cutting-edge technology
                    </p>
                </motion.div>
                <div className='grid lg:grid-cols-3 gap-8 mb-16'>
                    <div className='lg:col-span-2'>
                        <BranchMap
                            branches={branches}
                            selectedBranch={selectedBranch}
                            setSelectedBranch={setSelectedBranch}
                        />
                    </div>
                    <div>
                        <motion.div
                            key={selectedBranch.id}
                            initial={{
                                opacity: 0,
                                x: 20,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            transition={{
                                duration: 0.4,
                            }}
                            className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl overflow-hidden h-full'
                        >
                            <div className='relative h-48 overflow-hidden'>
                                <img
                                    src={selectedBranch.image}
                                    alt={selectedBranch.name}
                                    className='w-full h-full object-cover'
                                />
                                <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
                                <div className='absolute bottom-4 left-4'>
                                    <h2 className='text-2xl font-bold text-white'>{selectedBranch.name}</h2>
                                </div>
                            </div>
                            <div className='p-6 space-y-5'>
                                <div className='flex items-start gap-3'>
                                    <MapPinIcon className='w-5 h-5 text-pink-500 flex-shrink-0 mt-1' />
                                    <p className='text-gray-700'>{selectedBranch.address}</p>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <PhoneIcon className='w-5 h-5 text-pink-500 flex-shrink-0' />
                                    <p className='text-gray-700'>{selectedBranch.phone}</p>
                                </div>
                                <div className='flex items-start gap-3'>
                                    <ClockIcon className='w-5 h-5 text-pink-500 flex-shrink-0 mt-1' />
                                    <div className='text-gray-700 whitespace-pre-line'>{selectedBranch.hours}</div>
                                </div>
                                <div className='border-t border-gray-200 pt-5'>
                                    <h3 className='text-lg font-semibold text-gray-800 mb-2'>Available Services</h3>
                                    <div className='flex flex-wrap gap-2'>
                                        {selectedBranch.services.map((service) => (
                                            <span
                                                key={service}
                                                className='px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm'
                                            >
                                                {service}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className='pt-4'>
                                    <a
                                        href={`https://maps.google.com/?q=${selectedBranch.location.lat},${selectedBranch.location.lng}`}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='inline-flex items-center gap-2 text-pink-600 font-medium hover:text-pink-700 transition-colors'
                                    >
                                        Get Directions
                                        <ArrowRightIcon className='w-4 h-4' />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
                <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20'>
                    {branches.map((branch) => (
                        <motion.div
                            key={branch.id}
                            whileHover={{
                                y: -5,
                            }}
                            onClick={() => setSelectedBranch(branch)}
                            className={`cursor-pointer bg-white/70 backdrop-blur-xl rounded-3xl border-2 ${
                                selectedBranch.id === branch.id
                                    ? 'border-pink-500 shadow-lg shadow-pink-200'
                                    : 'border-white/50 shadow-lg'
                            } overflow-hidden transition-all`}
                        >
                            <div className='relative h-40 overflow-hidden'>
                                <img src={branch.image} alt={branch.name} className='w-full h-full object-cover' />
                                <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
                                <div className='absolute bottom-3 left-3'>
                                    <h3 className='text-lg font-bold text-white'>{branch.name}</h3>
                                </div>
                            </div>
                            <div className='p-4'>
                                <div className='flex items-center gap-2 text-gray-700 text-sm mb-1'>
                                    <MapPinIcon className='w-4 h-4 text-pink-500 flex-shrink-0' />
                                    <p className='line-clamp-1'>{branch.address.split(',')[0]}</p>
                                </div>
                                <div className='flex items-center gap-2 text-gray-700 text-sm'>
                                    <PhoneIcon className='w-4 h-4 text-pink-500 flex-shrink-0' />
                                    <p>{branch.phone}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
                    transition={{
                        duration: 0.6,
                    }}
                    className='bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 rounded-3xl p-1'
                >
                    <div className='bg-white/95 backdrop-blur-xl rounded-3xl p-8 md:p-12 text-center'>
                        <h2 className='text-3xl font-bold text-gray-800 mb-4'>Ready to Schedule Your Visit?</h2>
                        <p className='text-lg text-gray-600 mb-8 max-w-2xl mx-auto'>
                            Book your appointment now and experience the perfect blend of luxury and technology at your
                            nearest BeautyAI clinic.
                        </p>
                        <motion.a
                            href='/booking'
                            whileHover={{
                                scale: 1.05,
                            }}
                            whileTap={{
                                scale: 0.95,
                            }}
                            className='inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold shadow-xl'
                        >
                            Book Your Visit Now
                            <ArrowRightIcon className='w-5 h-5' />
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
