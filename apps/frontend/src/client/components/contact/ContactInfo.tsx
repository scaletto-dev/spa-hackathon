import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    MapPinIcon, 
    PhoneIcon, 
    MailIcon, 
    ClockIcon, 
    InstagramIcon, 
    FacebookIcon, 
    TwitterIcon, 
    ExternalLinkIcon,
    BuildingIcon,
    HeadphonesIcon,
    Loader2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getAllBranches, type Branch } from '../../../services/branchesApi';
import { formatOperatingHours } from '../../../utils/format';

export function ContactInfo() {
    const { t } = useTranslation('common');
    const [mainBranch, setMainBranch] = useState<Branch | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMainBranch = async () => {
            try {
                setLoading(true);
                const response = await getAllBranches({ limit: 1 }); // Get first/main branch
                if (response.data.length > 0) {
                    setMainBranch(response.data[0] || null);
                }
            } catch (error) {
                console.error('Failed to load branch info:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMainBranch();
    }, []);

    return (
        <motion.div
            initial={{
                opacity: 0,
                x: 20,
            }}
            animate={{
                opacity: 1,
                x: 0,
            }}
            transition={{
                duration: 0.6,
            }}
            className='space-y-6'
        >
            {/* Contact Information Card */}
            <div className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-8 md:p-10'>
                <div className='flex items-center gap-3 mb-8'>
                    <div className='w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center'>
                        <HeadphonesIcon className='w-6 h-6 text-white' />
                    </div>
                    <h2 className='text-2xl md:text-3xl font-bold text-gray-800'>
                        {t('contact.contactInformation')}
                    </h2>
                </div>

                {loading ? (
                    <div className='flex justify-center py-12'>
                        <Loader2 className='w-8 h-8 text-pink-500 animate-spin' />
                    </div>
                ) : (
                    <div className='space-y-6'>
                        {/* Main Branch */}
                        <motion.div
                            whileHover={{ x: 4 }}
                            className='flex items-start gap-4 p-4 rounded-2xl hover:bg-pink-50/50 transition-colors'
                        >
                            <div className='w-14 h-14 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center flex-shrink-0'>
                                <MapPinIcon className='w-7 h-7 text-pink-600' />
                            </div>
                            <div className='flex-1'>
                                <h3 className='font-semibold text-gray-800 mb-1.5 text-lg'>
                                    {mainBranch?.name || t('contact.mainOffice')}
                                </h3>
                                <p className='text-gray-600 leading-relaxed'>
                                    {mainBranch?.address || t('contact.defaultAddress')}
                                </p>
                                <Link
                                    to='/branches'
                                    className='inline-flex items-center gap-1 text-pink-600 font-medium hover:text-pink-700 transition-colors mt-2 text-sm'
                                >
                                    {t('contact.viewAllBranches')}
                                    <ExternalLinkIcon className='w-4 h-4' />
                                </Link>
                            </div>
                        </motion.div>

                        {/* Phone */}
                        <motion.div
                            whileHover={{ x: 4 }}
                            className='flex items-start gap-4 p-4 rounded-2xl hover:bg-purple-50/50 transition-colors'
                        >
                            <div className='w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center flex-shrink-0'>
                                <PhoneIcon className='w-7 h-7 text-purple-600' />
                            </div>
                            <div className='flex-1'>
                                <h3 className='font-semibold text-gray-800 mb-1.5 text-lg'>{t('contact.phone')}</h3>
                                {mainBranch?.phone ? (
                                    <a
                                        href={`tel:${mainBranch.phone}`}
                                        className='text-gray-600 hover:text-purple-600 transition-colors block'
                                    >
                                        {mainBranch.phone}
                                    </a>
                                ) : (
                                    <p className='text-gray-600'>{t('contact.defaultPhone')}</p>
                                )}
                            </div>
                        </motion.div>

                        {/* Email */}
                        <motion.div
                            whileHover={{ x: 4 }}
                            className='flex items-start gap-4 p-4 rounded-2xl hover:bg-blue-50/50 transition-colors'
                        >
                            <div className='w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center flex-shrink-0'>
                                <MailIcon className='w-7 h-7 text-blue-600' />
                            </div>
                            <div className='flex-1'>
                                <h3 className='font-semibold text-gray-800 mb-1.5 text-lg'>{t('contact.email')}</h3>
                                {mainBranch?.email ? (
                                    <a
                                        href={`mailto:${mainBranch.email}`}
                                        className='text-gray-600 hover:text-blue-600 transition-colors block'
                                    >
                                        {mainBranch.email}
                                    </a>
                                ) : (
                                    <div className='space-y-1'>
                                        <a
                                            href='mailto:info@beautyai.com'
                                            className='text-gray-600 hover:text-blue-600 transition-colors block'
                                        >
                                            info@beautyai.com
                                        </a>
                                        <a
                                            href='mailto:support@beautyai.com'
                                            className='text-gray-600 hover:text-blue-600 transition-colors block'
                                        >
                                            support@beautyai.com
                                        </a>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Operating Hours */}
                        <motion.div
                            whileHover={{ x: 4 }}
                            className='flex items-start gap-4 p-4 rounded-2xl hover:bg-green-50/50 transition-colors'
                        >
                            <div className='w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center flex-shrink-0'>
                                <ClockIcon className='w-7 h-7 text-green-600' />
                            </div>
                            <div className='flex-1'>
                                <h3 className='font-semibold text-gray-800 mb-1.5 text-lg'>
                                    {t('contact.operatingHours')}
                                </h3>
                                <div className='text-gray-600 leading-relaxed'>
                                    {mainBranch?.operatingHours
                                        ? formatOperatingHours(mainBranch.operatingHours)
                                        : t('contact.defaultHours')}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Social Media */}
                <div className='mt-8 pt-8 border-t border-gray-200'>
                    <h3 className='font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                        <span>{t('contact.followUs')}</span>
                        <span className='text-2xl'>✨</span>
                    </h3>
                    <div className='flex gap-3'>
                        {[
                            {
                                icon: InstagramIcon,
                                href: '#',
                                color: 'bg-gradient-to-br from-pink-500 to-purple-500',
                                label: 'Instagram',
                            },
                            {
                                icon: FacebookIcon,
                                href: '#',
                                color: 'bg-blue-600',
                                label: 'Facebook',
                            },
                            {
                                icon: TwitterIcon,
                                href: '#',
                                color: 'bg-sky-500',
                                label: 'Twitter',
                            },
                        ].map((social, index) => (
                            <motion.a
                                key={index}
                                href={social.href}
                                aria-label={social.label}
                                whileHover={{
                                    y: -4,
                                    scale: 1.05,
                                }}
                                whileTap={{
                                    scale: 0.95,
                                }}
                                className={`w-12 h-12 ${social.color} rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow`}
                            >
                                <social.icon className='w-5 h-5' />
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Visit Us CTA Card */}
            <motion.div
                whileHover={{ y: -4 }}
                className='bg-gradient-to-br from-pink-500 to-purple-500 rounded-3xl shadow-xl overflow-hidden'
            >
                <div className='p-8 md:p-10 text-white'>
                    <div className='flex items-center gap-3 mb-4'>
                        <BuildingIcon className='w-8 h-8' />
                        <h3 className='text-2xl font-bold'>{t('contact.visitUs')}</h3>
                    </div>
                    <p className='text-white/90 mb-6 leading-relaxed'>
                        {t('contact.visitUsDescription')}
                    </p>
                    <Link
                        to='/branches'
                        className='inline-flex items-center gap-2 px-6 py-3 bg-white text-pink-600 rounded-full font-semibold hover:bg-pink-50 transition-colors shadow-lg'
                    >
                        {t('contact.viewAllLocations')}
                        <MapPinIcon className='w-5 h-5' />
                    </Link>
                </div>
            </motion.div>
        </motion.div>
    );
}