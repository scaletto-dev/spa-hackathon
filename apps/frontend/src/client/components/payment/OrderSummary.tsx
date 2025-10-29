import { motion } from 'framer-motion';
import { CalendarIcon, ClockIcon, MapPinIcon, TagIcon } from 'lucide-react';
import { BookingData } from '../booking/types';

interface OrderSummaryProps {
    bookingData: BookingData;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    appliedPromo: string | null;
}

export function OrderSummary({ bookingData, subtotal, discount, tax, total, appliedPromo }: OrderSummaryProps) {
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
            className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-6 sticky top-24'
        >
            <h3 className='text-xl font-bold text-gray-800 mb-6'>Order Summary</h3>
            {/* Service Details */}
            <div className='space-y-4 mb-6 pb-6 border-b border-gray-200'>
                <div>
                    <p className='text-sm text-gray-500 mb-1'>Service</p>
                    <p className='font-medium text-gray-800'>{bookingData.service?.title}</p>
                    <p className='text-sm text-gray-600'>{bookingData.service?.duration}</p>
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <MapPinIcon className='w-4 h-4 text-pink-500' />
                    <span>{bookingData.branch?.name}</span>
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <CalendarIcon className='w-4 h-4 text-pink-500' />
                    <span>
                        {bookingData.date &&
                            new Date(bookingData.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                    </span>
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <ClockIcon className='w-4 h-4 text-pink-500' />
                    <span>{bookingData.time}</span>
                </div>
            </div>
            {/* Price Breakdown */}
            <div className='space-y-3 mb-6'>
                <div className='flex justify-between text-gray-700'>
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                {appliedPromo && (
                    <div className='flex justify-between text-green-600'>
                        <div className='flex items-center gap-1'>
                            <TagIcon className='w-4 h-4' />
                            <span>Discount ({appliedPromo})</span>
                        </div>
                        <span>-${discount.toFixed(2)}</span>
                    </div>
                )}
                <div className='flex justify-between text-gray-700'>
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                </div>
            </div>
            {/* Total */}
            <div className='pt-6 border-t border-gray-200'>
                <div className='flex justify-between items-center'>
                    <span className='text-lg font-semibold text-gray-800'>Total</span>
                    <span className='text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent'>
                        ${total.toFixed(2)}
                    </span>
                </div>
            </div>
            {/* Trust Badge */}
            <div className='mt-6 pt-6 border-t border-gray-200'>
                <p className='text-xs text-gray-500 text-center'>Your payment information is encrypted and secure</p>
            </div>
        </motion.div>
    );
}
