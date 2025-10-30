import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, CalendarIcon, MapPinIcon, ClockIcon, ArrowLeftIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BookingConfirmationProps } from './types';

export function BookingConfirmation({ bookingData, onPrev, onSubmit }: BookingConfirmationProps) {
    const { t } = useTranslation('common');
    // Generate booking reference once and keep it stable
    const bookingReference = useMemo(() => {
        return Math.floor(100000 + Math.random() * 900000);
    }, []);

    // Calculate total price from selected services
    const totalPrice = useMemo(() => {
        if (bookingData.selectedServices && bookingData.selectedServices.length > 0) {
            return bookingData.selectedServices.reduce((sum, s) => sum + (s.price || 0), 0);
        } else if (bookingData.service?.price) {
            return bookingData.service.price;
        }
        return 0;
    }, [bookingData.selectedServices, bookingData.service]);

    // Get service names
    const serviceNames = useMemo(() => {
        if (bookingData.selectedServices && bookingData.selectedServices.length > 0) {
            return bookingData.selectedServices.map(s => s.name).join(' + ');
        }
        return bookingData.service?.name || 'N/A';
    }, [bookingData.selectedServices, bookingData.service]);

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 20,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            exit={{
                opacity: 0,
                y: -20,
            }}
            transition={{
                duration: 0.5,
            }}
            className='text-center'
        >
            <motion.div
                initial={{
                    scale: 0,
                }}
                animate={{
                    scale: 1,
                }}
                transition={{
                    delay: 0.2,
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                }}
                className='w-24 h-24 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-8'
            >
                <CheckCircleIcon className='w-14 h-14 text-white' />
            </motion.div>
            <h2 className='text-3xl font-bold text-gray-800 mb-4'>{t('bookings.bookingConfirmed')}</h2>
            <p className='text-xl text-gray-600 mb-12'>{t('bookings.appointmentScheduled')}</p>
            <div className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-8 mb-12 max-w-2xl mx-auto'>
                <h3 className='text-2xl font-bold text-gray-800 mb-6'>{t('bookings.appointmentDetails')}</h3>
                <div className='space-y-6'>
                    <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0'>
                            <CalendarIcon className='w-6 h-6 text-pink-600' />
                        </div>
                        <div className='text-left flex-1'>
                            <p className='text-sm text-gray-500'>{t('bookings.dateLabel')}</p>
                            <p className='text-lg font-medium text-gray-800'>
                                {bookingData.date
                                    ? new Date(bookingData.date).toLocaleDateString('en-US', {
                                          weekday: 'long',
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric',
                                      })
                                    : t('bookings.notSelected')}
                            </p>
                        </div>
                    </div>
                    <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0'>
                            <ClockIcon className='w-6 h-6 text-purple-600' />
                        </div>
                        <div className='text-left flex-1'>
                            <p className='text-sm text-gray-500'>{t('bookings.timeLabel')}</p>
                            <p className='text-lg font-medium text-gray-800'>{bookingData.time}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0'>
                            <MapPinIcon className='w-6 h-6 text-blue-600' />
                        </div>
                        <div className='text-left flex-1'>
                            <p className='text-sm text-gray-500'>{t('bookings.locationSummary')}</p>
                            <p className='text-lg font-medium text-gray-800'>{bookingData.branch?.name}</p>
                            <p className='text-sm text-gray-600'>{bookingData.branch?.address}</p>
                        </div>
                    </div>
                    <div className='pt-6 border-t border-gray-200'>
                        <div className='text-left'>
                            <p className='text-sm text-gray-500 mb-2'>Services</p>
                            <p className='text-lg font-bold text-gray-800'>
                                {serviceNames}
                            </p>
                        </div>
                        <div className='mt-4 pt-4 border-t border-gray-200'>
                            <div className='flex justify-between items-center'>
                                <p className='text-lg font-medium text-gray-800'>Total Price</p>
                                <p className='text-2xl font-bold text-pink-600'>
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    }).format(totalPrice)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mt-8 p-4 bg-pink-50 rounded-2xl border border-pink-200 text-left'>
                    <p className='text-sm text-gray-700'>
                        <span className='font-medium'>{t('bookings.confirmationSentTo')}</span> {bookingData.email}
                    </p>
                    <p className='text-sm text-gray-700 mt-1'>
                        <span className='font-medium'>{t('bookings.bookingReferenceLabel')}</span> #BEA
                        {bookingReference}
                    </p>
                </div>
            </div>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <motion.button
                    whileHover={{
                        scale: 1.05,
                    }}
                    whileTap={{
                        scale: 0.95,
                    }}
                    onClick={onPrev}
                    className='flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-pink-200 text-gray-700 rounded-full font-semibold shadow-lg'
                >
                    <ArrowLeftIcon className='w-5 h-5' />
                    {t('bookings.editBooking')}
                </motion.button>
                {onSubmit && (
                    <motion.button
                        whileHover={{
                            scale: 1.05,
                        }}
                        whileTap={{
                            scale: 0.95,
                        }}
                        onClick={onSubmit}
                        className='flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl'
                    >
                        ✓ {t('bookings.confirmBooking') || 'Confirm Booking'}
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
}
