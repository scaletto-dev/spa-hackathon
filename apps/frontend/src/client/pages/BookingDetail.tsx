import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    CheckCircleIcon,
    CalendarIcon,
    ClockIcon,
    MapPinIcon,
    UserIcon,
    MailIcon,
    PhoneIcon,
    CreditCardIcon,
    ArrowLeftIcon,
    DownloadIcon,
} from 'lucide-react';
import { getBookingByReference } from '../../services/bookingApi';
import { formatPrice, formatDuration } from '../../utils/format';

interface BookingDetail {
    id: string;
    referenceNumber: string;
    userId?: string;
    serviceIds?: string[];
    branchId?: string;
    status: string;
    appointmentDate: string;
    appointmentTime: string;
    notes?: string;
    totalAmount?: number;
    paymentStatus?: string;
    paymentType?: string;
    guestName?: string;
    guestEmail?: string;
    guestPhone?: string;
    language?: string;
    createdAt?: string;
    updatedAt?: string;
    branch: {
        id: string;
        name: string;
        address: string;
        phone: string;
    };
    services: Array<{
        id: string;
        name: string;
        duration: number;
        price: number;
    }>;
}

export default function BookingDetail() {
    const { t, i18n } = useTranslation('common');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState<BookingDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const referenceNumber = searchParams.get('ref');

    useEffect(() => {
        const loadBookingDetail = async () => {
            if (!referenceNumber) {
                setError('Không tìm thấy mã tham chiếu');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await getBookingByReference(referenceNumber);
                setBooking(data);
            } catch (err) {
                console.error('Error loading booking detail:', err);
                setError('Không thể tải thông tin đặt lịch');
            } finally {
                setLoading(false);
            }
        };

        loadBookingDetail();
    }, [referenceNumber]);

    if (loading) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4'>
                <div className='max-w-4xl mx-auto'>
                    <div className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-8'>
                        <div className='flex items-center justify-center py-12'>
                            <div className='animate-spin w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full' />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4'>
                <div className='max-w-4xl mx-auto'>
                    <div className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-8'>
                        <div className='text-center py-12'>
                            <h2 className='text-2xl font-bold text-gray-800 mb-4'>
                                {error || 'Không tìm thấy thông tin đặt lịch'}
                            </h2>
                            <button
                                onClick={() => navigate('/')}
                                className='mt-4 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold'
                            >
                                {t('bookings.backHome')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Calculate total amount from services
    const totalAmount = booking.totalAmount || booking.services.reduce((sum, service) => sum + service.price, 0);

    const statusColors = {
        PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        CONFIRMED: 'bg-green-100 text-green-700 border-green-300',
        COMPLETED: 'bg-blue-100 text-blue-700 border-blue-300',
        CANCELLED: 'bg-red-100 text-red-700 border-red-300',
    };

    const statusLabels = {
        PENDING: t('bookings.status.pending'),
        CONFIRMED: t('bookings.status.confirmed'),
        COMPLETED: t('bookings.status.completed'),
        CANCELLED: t('bookings.status.cancelled'),
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4 pt-32'>
            <div className='max-w-4xl mx-auto'>
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className='mb-8'>
                    <button
                        onClick={() => navigate(-1)}
                        className='flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4'
                    >
                        <ArrowLeftIcon className='w-5 h-5' />
                        {t('common.back')}
                    </button>
                    <div className='flex items-center gap-4'>
                        <CheckCircleIcon className='w-12 h-12 text-green-500' />
                        <div>
                            <h1 className='text-3xl font-bold text-gray-800'>{t('bookings.bookingConfirmed')}</h1>
                            <p className='text-gray-600'>
                                {t('bookings.bookingReference')}: #{booking.referenceNumber}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content */}
                <div className='grid md:grid-cols-3 gap-6'>
                    {/* Left Column - Details */}
                    <div className='md:col-span-2 space-y-6'>
                        {/* Status */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-6'
                        >
                            <div className='flex items-center justify-between'>
                                <h2 className='text-xl font-semibold text-gray-800'>{t('bookings.status.all')}</h2>
                                <span
                                    className={`px-4 py-2 rounded-full text-sm font-medium border ${
                                        statusColors[booking.status as keyof typeof statusColors] ||
                                        'bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    {statusLabels[booking.status as keyof typeof statusLabels] || booking.status}
                                </span>
                            </div>
                        </motion.div>

                        {/* Date & Time */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-6'
                        >
                            <h2 className='text-xl font-semibold text-gray-800 mb-4'>
                                {t('bookings.appointmentDetails')}
                            </h2>
                            <div className='space-y-4'>
                                <div className='flex items-start gap-3'>
                                    <CalendarIcon className='w-5 h-5 text-pink-500 mt-1' />
                                    <div>
                                        <p className='text-sm text-gray-500'>{t('bookings.dateLabel')}</p>
                                        <p className='font-medium text-gray-800'>
                                            {new Date(booking.appointmentDate).toLocaleDateString(
                                                i18n.language === 'vi' ? 'vi-VN' : 'en-US',
                                                {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                },
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex items-start gap-3'>
                                    <ClockIcon className='w-5 h-5 text-pink-500 mt-1' />
                                    <div>
                                        <p className='text-sm text-gray-500'>{t('bookings.timeLabel')}</p>
                                        <p className='font-medium text-gray-800'>{booking.appointmentTime}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Location */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-6'
                        >
                            <h2 className='text-xl font-semibold text-gray-800 mb-4'>{t('bookings.locationLabel')}</h2>
                            <div className='space-y-3'>
                                <div className='flex items-start gap-3'>
                                    <MapPinIcon className='w-5 h-5 text-pink-500 mt-1' />
                                    <div>
                                        <p className='font-medium text-gray-800'>{booking.branch.name}</p>
                                        <p className='text-sm text-gray-600'>{booking.branch.address}</p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <PhoneIcon className='w-5 h-5 text-pink-500' />
                                    <p className='text-gray-700'>{booking.branch.phone}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Information */}
                        {(booking.guestName || booking.guestEmail || booking.guestPhone) && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-6'
                            >
                                <h2 className='text-xl font-semibold text-gray-800 mb-4'>
                                    {t('bookings.yourInformation')}
                                </h2>
                                <div className='space-y-3'>
                                    {booking.guestName && (
                                        <div className='flex items-center gap-3'>
                                            <UserIcon className='w-5 h-5 text-pink-500' />
                                            <p className='text-gray-700'>{booking.guestName}</p>
                                        </div>
                                    )}
                                    {booking.guestEmail && (
                                        <div className='flex items-center gap-3'>
                                            <MailIcon className='w-5 h-5 text-pink-500' />
                                            <p className='text-gray-700'>{booking.guestEmail}</p>
                                        </div>
                                    )}
                                    {booking.guestPhone && (
                                        <div className='flex items-center gap-3'>
                                            <PhoneIcon className='w-5 h-5 text-pink-500' />
                                            <p className='text-gray-700'>{booking.guestPhone}</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Column - Summary */}
                    <div className='md:col-span-1'>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-6 sticky top-24'
                        >
                            <h2 className='text-xl font-semibold text-gray-800 mb-4'>{t('bookings.bookingSummary')}</h2>

                            {/* Services */}
                            <div className='space-y-3 mb-6'>
                                {booking.services && booking.services.length > 0 ? (
                                    booking.services.map((service) => (
                                        <div key={service.id} className='p-3 bg-pink-50 rounded-xl'>
                                            <p className='font-medium text-gray-800'>{service.name}</p>
                                            <div className='flex justify-between text-sm text-gray-600 mt-1'>
                                                <span>{formatDuration(service.duration)}</span>
                                                <span>{formatPrice(service.price)}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className='text-sm text-gray-500'>{t('bookings.noServices')}</p>
                                )}
                            </div>

                            {/* Payment */}
                            <div className='border-t border-gray-200 pt-4 space-y-3'>
                                {booking.paymentType && (
                                    <div className='flex items-center gap-3'>
                                        <CreditCardIcon className='w-5 h-5 text-pink-500' />
                                        <div className='flex-1'>
                                            <p className='text-sm text-gray-500'>{t('bookings.paymentMethod')}</p>
                                            <p className='font-medium text-gray-800'>
                                                {booking.paymentType === 'ATM' ? 'VNPay' : t('bookings.payAtClinic')}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <div className='flex justify-between items-center pt-3 border-t border-gray-200'>
                                    <span className='text-gray-700 font-medium'>{t('bookings.total')}</span>
                                    <span className='text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent'>
                                        {formatPrice(totalAmount)}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className='mt-6 space-y-3'>
                                <button
                                    onClick={() => window.print()}
                                    className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-pink-200 text-gray-700 rounded-full font-semibold hover:bg-pink-50 transition-colors'
                                >
                                    <DownloadIcon className='w-5 h-5' />
                                    {t('bookings.receipt')}
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className='w-full px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:shadow-lg transition-shadow'
                                >
                                    {t('bookings.backHome')}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
