import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, CalendarIcon, MapPinIcon, ClockIcon, ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BookingConfirmationProps } from './types';

export function BookingConfirmation({ bookingData, onPrev }: BookingConfirmationProps) {
    // Generate booking reference once and keep it stable
    const bookingReference = useMemo(() => {
        return Math.floor(100000 + Math.random() * 900000);
    }, []);

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
            <h2 className='text-3xl font-bold text-gray-800 mb-4'>Booking Confirmed!</h2>
            <p className='text-xl text-gray-600 mb-12'>Your appointment has been successfully scheduled</p>
            <div className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-8 mb-12 max-w-xl mx-auto'>
                <h3 className='text-2xl font-bold text-gray-800 mb-6'>Appointment Details</h3>
                <div className='space-y-6'>
                    <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0'>
                            <CalendarIcon className='w-6 h-6 text-pink-600' />
                        </div>
                        <div className='text-left'>
                            <p className='text-sm text-gray-500'>Date</p>
                            <p className='text-lg font-medium text-gray-800'>
                                {bookingData.date
                                    ? new Date(bookingData.date).toLocaleDateString('en-US', {
                                          weekday: 'long',
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric',
                                      })
                                    : 'Not selected'}
                            </p>
                        </div>
                    </div>
                    <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0'>
                            <ClockIcon className='w-6 h-6 text-purple-600' />
                        </div>
                        <div className='text-left'>
                            <p className='text-sm text-gray-500'>Time</p>
                            <p className='text-lg font-medium text-gray-800'>{bookingData.time}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0'>
                            <MapPinIcon className='w-6 h-6 text-blue-600' />
                        </div>
                        <div className='text-left'>
                            <p className='text-sm text-gray-500'>Location</p>
                            <p className='text-lg font-medium text-gray-800'>{bookingData.branch?.name}</p>
                            <p className='text-sm text-gray-600'>{bookingData.branch?.address}</p>
                        </div>
                    </div>
                    <div className='pt-6 border-t border-gray-200'>
                        <div className='flex justify-between items-center'>
                            <div className='text-left'>
                                <p className='text-lg font-medium text-gray-800'>{bookingData.service?.title}</p>
                                <p className='text-sm text-gray-600'>{bookingData.service?.duration}</p>
                            </div>
                            <p className='text-xl font-bold text-gray-800'>{bookingData.service?.price}</p>
                        </div>
                    </div>
                </div>
                <div className='mt-8 p-4 bg-pink-50 rounded-2xl border border-pink-200 text-left'>
                    <p className='text-sm text-gray-700'>
                        <span className='font-medium'>Confirmation sent to:</span> {bookingData.email}
                    </p>
                    <p className='text-sm text-gray-700 mt-1'>
                        <span className='font-medium'>Booking reference:</span> #BEA{bookingReference}
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
                    Edit Booking
                </motion.button>
                <Link to='/'>
                    <motion.button
                        whileHover={{
                            scale: 1.05,
                        }}
                        whileTap={{
                            scale: 0.95,
                        }}
                        className='flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold shadow-xl'
                    >
                        Return Home
                        <ArrowRightIcon className='w-5 h-5' />
                    </motion.button>
                </Link>
            </div>
        </motion.div>
    );
}
