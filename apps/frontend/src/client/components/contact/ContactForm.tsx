import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserIcon, MailIcon, PhoneIcon, SendIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from '../../../utils/toast';
import { FormField, Input, Textarea, Select } from '../../../components/ui';

export function ContactForm() {
    const { t } = useTranslation('common');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const serviceOptions = [
        { value: '', label: t('contact.selectService') },
        { value: 'facial', label: t('contact.services.facial') },
        { value: 'laser', label: t('contact.services.laser') },
        { value: 'body', label: t('contact.services.body') },
        { value: 'consultation', label: t('contact.services.consultation') },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        // Clear error when user types
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleServiceChange = (value: string) => {
        setFormData({ ...formData, service: value });
        if (errors.service) {
            setErrors({ ...errors, service: '' });
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = t('contact.nameRequired');
        if (!formData.email.trim()) newErrors.email = t('contact.emailRequired');
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t('contact.emailInvalid');
        if (!formData.message.trim()) newErrors.message = t('contact.messageRequired');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            setIsSubmitting(true);
            // Mock submission
            setTimeout(() => {
                setIsSubmitting(false);
                setIsSubmitted(true);
                toast.success(t('contact.successToast'));
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    service: '',
                    message: '',
                });
            }, 1000);
        } else {
            toast.error(t('contact.fillRequired'));
        }
    };
    return (
        <motion.div
            initial={{
                opacity: 0,
                x: -20,
            }}
            animate={{
                opacity: 1,
                x: 0,
            }}
            transition={{
                duration: 0.6,
            }}
            className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-8'
        >
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>{t('contact.sendMessage')}</h2>
            {isSubmitted ? (
                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.9,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    className='bg-green-50 rounded-2xl p-8 text-center'
                >
                    <div className='w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6'>
                        <SendIcon className='w-10 h-10 text-white' />
                    </div>
                    <h3 className='text-xl font-bold text-gray-800 mb-2'>{t('contact.messageSentSuccess')}</h3>
                    <p className='text-gray-600 mb-4'>
                        {t('contact.messageSentDescription')}
                    </p>
                    <motion.button
                        whileHover={{
                            scale: 1.05,
                        }}
                        whileTap={{
                            scale: 0.95,
                        }}
                        onClick={() => setIsSubmitted(false)}
                        className='px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium shadow-lg'
                    >
                        {t('contact.sendAnother')}
                    </motion.button>
                </motion.div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className='grid md:grid-cols-2 gap-6 mb-6'>
                        <FormField label={t('contact.yourName')} name='name' error={errors.name} required>
                            <Input
                                name='name'
                                value={formData.name}
                                onChange={handleChange}
                                leftIcon={UserIcon}
                                placeholder={t('contact.yourName')}
                            />
                        </FormField>

                        <FormField label={t('contact.emailAddress')} name='email' error={errors.email} required>
                            <Input
                                type='email'
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                leftIcon={MailIcon}
                                placeholder='email@example.com'
                            />
                        </FormField>

                        <FormField label={t('contact.phoneNumber')} name='phone' helpText={t('contact.phoneFormat')}>
                            <Input
                                type='phone'
                                name='phone'
                                value={formData.phone}
                                onChange={handleChange}
                                leftIcon={PhoneIcon}
                                placeholder='0912 345 678'
                            />
                        </FormField>

                        <FormField label={t('contact.serviceInterest')} name='service'>
                            <Select
                                name='service'
                                value={formData.service}
                                onChange={handleServiceChange}
                                options={serviceOptions}
                                placeholder={t('contact.selectService')}
                            />
                        </FormField>

                        <div className='md:col-span-2'>
                            <FormField label={t('contact.messageContent')} name='message' error={errors.message} required>
                                <Textarea
                                    name='message'
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder={t('contact.messagePlaceholder')}
                                    rows={5}
                                    maxLength={500}
                                    showCounter
                                />
                            </FormField>
                        </div>
                    </div>
                    <div className='flex items-center justify-between mt-8'>
                        <p className='text-sm text-gray-500'>{t('contact.requiredFields')}</p>
                        <motion.button
                            whileHover={{
                                scale: 1.05,
                            }}
                            whileTap={{
                                scale: 0.95,
                            }}
                            type='submit'
                            disabled={isSubmitting}
                            className='px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium shadow-xl flex items-center gap-2'
                        >
                            {isSubmitting ? t('contact.sending') : t('contact.sendMessageBtn')}
                            <SendIcon className='w-5 h-5' />
                        </motion.button>
                    </div>
                </form>
            )}
        </motion.div>
    );
}
