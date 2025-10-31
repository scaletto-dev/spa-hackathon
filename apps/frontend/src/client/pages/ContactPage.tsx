import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ContactForm } from '../components/contact/ContactForm';
import { ContactInfo } from '../components/contact/ContactInfo';

export function ContactPage() {
    const { t } = useTranslation('common');
    
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
                            {t('contact.title')}
                        </span>
                    </h1>
                    <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                        {t('contact.subtitle')}
                    </p>
                </motion.div>
                <div className='grid md:grid-cols-2 gap-8 mb-20'>
                    <ContactForm />
                    <ContactInfo />
                </div>
                <div className='grid md:grid-cols-3 gap-6'>
                    {[
                        {
                            titleKey: 'contact.features.securePayments',
                            descKey: 'contact.features.securePaymentsDesc',
                            icon: '🔒',
                        },
                        {
                            titleKey: 'contact.features.privacyGuarantee',
                            descKey: 'contact.features.privacyGuaranteeDesc',
                            icon: '🛡️',
                        },
                        {
                            titleKey: 'contact.features.professionalSupport',
                            descKey: 'contact.features.professionalSupportDesc',
                            icon: '💬',
                        },
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{
                                opacity: 0,
                                y: 20,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                delay: index * 0.1,
                                duration: 0.5,
                            }}
                            className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg p-6 text-center'
                        >
                            <div className='text-4xl mb-4'>{item.icon}</div>
                            <h3 className='text-xl font-bold text-gray-800 mb-2'>{t(item.titleKey)}</h3>
                            <p className='text-gray-600'>{t(item.descKey)}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ContactPage;
