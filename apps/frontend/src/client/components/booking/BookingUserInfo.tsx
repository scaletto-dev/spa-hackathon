import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ArrowLeftIcon, UserIcon, MailIcon, PhoneIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FormField, Input, Textarea } from '../../../components/ui';

export function BookingUserInfo({ bookingData, updateBookingData, onNext, onPrev }: any) {
    const { t } = useTranslation('common');
    const [formData, setFormData] = useState({
        name: bookingData.name || '',
        email: bookingData.email || '',
        phone: bookingData.phone || '',
        notes: bookingData.notes || '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const updatedFormData = {
            ...formData,
            [name]: value,
        };
        setFormData(updatedFormData);
        // Update bookingData immediately for validation
        updateBookingData({ [name]: value });
        // Clear error when user types
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = t('bookings.pleaseEnterName');
        if (!formData.email.trim()) newErrors.email = t('bookings.pleaseEnterEmail');
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t('bookings.invalidEmail');
        if (!formData.phone.trim()) newErrors.phone = t('bookings.pleaseEnterPhone');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            updateBookingData(formData);
            onNext();
        }
    };

    // Check if form is valid for enabling button
    const isFormValid = () => {
        return (
            formData.name.trim() !== '' &&
            formData.email.trim() !== '' &&
            /\S+@\S+\.\S+/.test(formData.email) &&
            formData.phone.trim() !== ''
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
        >
            <div className='mb-8'>
                <h2 className='text-2xl font-bold text-gray-800 mb-4'>{t('bookings.yourInformation')}</h2>
                <p className='text-gray-600'>{t('bookings.provideContactInfo')}</p>
            </div>
            <div className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-8 mb-8'>
                <div className='grid md:grid-cols-2 gap-6 mb-6'>
                    <FormField label={t('bookings.fullName')} name='name' error={errors.name} required>
                        <Input
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                            leftIcon={UserIcon}
                            placeholder={t('bookings.enterFullName')}
                        />
                    </FormField>

                    <FormField label={t('bookings.emailAddress')} name='email' error={errors.email} required>
                        <Input
                            type='email'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            leftIcon={MailIcon}
                            placeholder='email@example.com'
                            disabled={bookingData.isLoggedIn}
                            readOnly={bookingData.isLoggedIn}
                        />
                    </FormField>

                    <div className='md:col-span-2'>
                        <FormField label={t('bookings.phoneNumber')} name='phone' error={errors.phone} required>
                            <Input
                                type='phone'
                                name='phone'
                                value={formData.phone}
                                onChange={handleChange}
                                leftIcon={PhoneIcon}
                                placeholder='0912 345 678'
                            />
                        </FormField>
                    </div>

                    <div className='md:col-span-2'>
                        <FormField
                            label={t('bookings.specialNotes')}
                            name='notes'
                            helpText={t('bookings.specialNotesHelp')}
                        >
                            <Textarea
                                name='notes'
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder={t('bookings.specialNotesPlaceholder')}
                                rows={4}
                                maxLength={300}
                            />
                        </FormField>
                    </div>
                </div>
                <div className='bg-pink-50 rounded-2xl p-6 border border-pink-200'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-2'>{t('bookings.appointmentSummary')}</h3>
                    <div className='space-y-2 text-gray-700'>
                        <p>
                            <span className='font-medium'>{t('bookings.service')}:</span>{' '}
                            {bookingData.selectedServices && bookingData.selectedServices.length > 0
                                ? bookingData.selectedServices.map((s: any) => s.name).join(' + ')
                                : bookingData.service?.name || t('bookings.notSelected')}
                        </p>
                        <p>
                            <span className='font-medium'>{t('bookings.branch')}:</span>{' '}
                            {bookingData.branch?.name || t('bookings.notSelected')}
                        </p>
                        <p>
                            <span className='font-medium'>{t('bookings.date')}:</span>{' '}
                            {bookingData.date
                                ? new Date(bookingData.date).toLocaleDateString('vi-VN', {
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                  })
                                : t('bookings.notSelected')}
                        </p>
                        <p>
                            <span className='font-medium'>{t('bookings.time')}:</span>{' '}
                            {bookingData.time || t('bookings.notSelected')}
                        </p>
                        <p>
                            <span className='font-medium'>{t('bookings.price')}:</span>{' '}
                            {(() => {
                                let totalPrice = 0;
                                if (bookingData.selectedServices && bookingData.selectedServices.length > 0) {
                                    totalPrice = bookingData.selectedServices.reduce((sum: number, s: any) => sum + (s.price || 0), 0);
                                } else if (bookingData.service?.price) {
                                    totalPrice = bookingData.service.price;
                                }
                                return totalPrice > 0
                                    ? new Intl.NumberFormat('vi-VN', {
                                          style: 'currency',
                                          currency: 'VND',
                                      }).format(totalPrice)
                                    : t('bookings.notSelected');
                            })()}
                        </p>
                        <p>
                            <span className='font-medium'>{t('bookings.duration')}:</span>{' '}
                            {bookingData.selectedServices && bookingData.selectedServices.length > 0
                                ? bookingData.selectedServices.map((s: any) => s.duration).join(', ')
                                : bookingData.service?.duration || t('bookings.notSelected')}
                        </p>
                    </div>
                </div>
            </div>
            <div className='flex justify-between mt-12'>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onPrev}
                    className='flex items-center gap-2 px-8 py-4 bg-white border-2 border-pink-200 text-gray-700 rounded-full font-semibold shadow-lg'
                >
                    <ArrowLeftIcon className='w-5 h-5' />
                    {t('common.back')}
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    disabled={!isFormValid()}
                    className={`flex items-center gap-2 px-8 py-4 rounded-full font-semibold shadow-xl ${
                        isFormValid()
                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    {t('bookings.completeBooking')}
                    <ArrowRightIcon className='w-5 h-5' />
                </motion.button>
            </div>
        </motion.div>
    );
}
