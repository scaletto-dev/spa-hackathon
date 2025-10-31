import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserIcon, MailIcon, PhoneIcon, SendIcon, MessageSquareIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from '../../../utils/toast';
import { FormField, Input, Textarea, Select } from '../../../components/ui';
import { contactApi, type ContactFormData } from '../../../services/contactApi';

export function ContactForm() {
    const { t } = useTranslation('common');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        messageType: 'general_inquiry' as ContactFormData['messageType'],
        message: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const messageTypeOptions = [
        { value: 'general_inquiry', label: t('contact.messageTypes.generalInquiry') },
        { value: 'service_question', label: t('contact.messageTypes.serviceQuestion') },
        { value: 'booking_assistance', label: t('contact.messageTypes.bookingAssistance') },
        { value: 'feedback', label: t('contact.messageTypes.feedback') },
        { value: 'other', label: t('contact.messageTypes.other') },
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

    const handleMessageTypeChange = (value: string) => {
        setFormData({ ...formData, messageType: value as ContactFormData['messageType'] });
        if (errors.messageType) {
            setErrors({ ...errors, messageType: '' });
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = t('contact.nameRequired');
        if (!formData.email.trim()) newErrors.email = t('contact.emailRequired');
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t('contact.emailInvalid');
        if (!formData.message.trim()) newErrors.message = t('contact.messageRequired');
        if (formData.message.length > 2000) newErrors.message = t('contact.messageTooLong');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            toast.error(t('contact.fillRequired'));
            return;
        }

        try {
            setIsSubmitting(true);
            const submitData: ContactFormData = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                messageType: formData.messageType,
                message: formData.message.trim(),
            };

            // Only add phone if it's not empty
            if (formData.phone.trim()) {
                submitData.phone = formData.phone.trim();
            }

            const response = await contactApi.submitContactForm(submitData);

            setIsSubmitted(true);
            toast.success(response.message || t('contact.successToast'));
            
            // Reset form after 3 seconds
            setTimeout(() => {
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    messageType: 'general_inquiry',
                    message: '',
                });
            }, 3000);
        } catch (error) {
            console.error('Failed to submit contact form:', error);
            const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || t('contact.submitError');
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
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
            className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-8 md:p-10'
        >
            <div className='flex items-center gap-3 mb-6'>
                <div className='w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center'>
                    <MessageSquareIcon className='w-6 h-6 text-white' />
                </div>
                <h2 className='text-2xl md:text-3xl font-bold text-gray-800'>{t('contact.sendMessage')}</h2>
            </div>
            <p className='text-gray-600 mb-8'>{t('contact.formDescription')}</p>

            <AnimatePresence mode='wait'>
                {isSubmitted ? (
                    <motion.div
                        key='success'
                        initial={{
                            opacity: 0,
                            scale: 0.9,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.9,
                        }}
                        className='bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 md:p-12 text-center border border-green-200'
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: 'spring',
                                stiffness: 200,
                                damping: 15,
                            }}
                            className='w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg'
                        >
                            <CheckCircle2 className='w-10 h-10 text-white' />
                        </motion.div>
                        <h3 className='text-2xl font-bold text-gray-800 mb-3'>{t('contact.messageSentSuccess')}</h3>
                        <p className='text-gray-600 mb-6 max-w-md mx-auto'>
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
                            className='px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow'
                        >
                            {t('contact.sendAnother')}
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.form
                        key='form'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleSubmit}
                    >
                        <div className='space-y-6'>
                            <div className='grid md:grid-cols-2 gap-6'>
                                <FormField label={t('contact.yourName')} name='name' error={errors.name} required>
                                    <Input
                                        name='name'
                                        value={formData.name}
                                        onChange={handleChange}
                                        leftIcon={UserIcon}
                                        placeholder={t('contact.namePlaceholder')}
                                        disabled={isSubmitting}
                                    />
                                </FormField>

                                <FormField label={t('contact.emailAddress')} name='email' error={errors.email} required>
                                    <Input
                                        type='email'
                                        name='email'
                                        value={formData.email}
                                        onChange={handleChange}
                                        leftIcon={MailIcon}
                                        placeholder='your.email@example.com'
                                        disabled={isSubmitting}
                                    />
                                </FormField>
                            </div>

                            <div className='grid md:grid-cols-2 gap-6'>
                                <FormField label={t('contact.phoneNumber')} name='phone' helpText={t('contact.phoneOptional')}>
                                    <Input
                                        type='tel'
                                        name='phone'
                                        value={formData.phone}
                                        onChange={handleChange}
                                        leftIcon={PhoneIcon}
                                        placeholder='0912 345 678'
                                        disabled={isSubmitting}
                                    />
                                </FormField>

                                <FormField label={t('contact.messageTypeLabel')} name='messageType' required>
                                    <Select
                                        name='messageType'
                                        value={formData.messageType}
                                        onChange={handleMessageTypeChange}
                                        options={messageTypeOptions}
                                        disabled={isSubmitting}
                                    />
                                </FormField>
                            </div>

                            <FormField label={t('contact.messageContent')} name='message' error={errors.message} required>
                                <Textarea
                                    name='message'
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder={t('contact.messagePlaceholder')}
                                    rows={6}
                                    maxLength={2000}
                                    showCounter
                                    disabled={isSubmitting}
                                />
                            </FormField>
                        </div>

                        <div className='flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200'>
                            <p className='text-sm text-gray-500'>
                                <span className='text-pink-500 font-medium'>*</span> {t('contact.requiredFields')}
                            </p>
                            <motion.button
                                whileHover={{
                                    scale: isSubmitting ? 1 : 1.05,
                                }}
                                whileTap={{
                                    scale: isSubmitting ? 1 : 0.95,
                                }}
                                type='submit'
                                disabled={isSubmitting}
                                className='px-8 py-3.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold shadow-xl hover:shadow-2xl transition-shadow flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed'
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className='w-5 h-5 animate-spin' />
                                        {t('contact.sending')}
                                    </>
                                ) : (
                                    <>
                                        <SendIcon className='w-5 h-5' />
                                        {t('contact.sendMessageBtn')}
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
