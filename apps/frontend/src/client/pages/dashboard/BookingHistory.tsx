import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CalendarIcon,
    ClockIcon,
    MapPinIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    FilterIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon as PendingIcon,
    EyeIcon,
} from 'lucide-react';
import {
    getMemberBookings,
    type BookingHistoryParams,
    type BookingHistoryResponse,
} from '../../../api/adapters/member';
import { useTranslation } from 'react-i18next';

type StatusFilter = 'all' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export default function BookingHistory() {
    const { t, i18n } = useTranslation('common');
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<BookingHistoryResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

    const loadBookings = useCallback(async () => {
        try {
            setIsLoading(true);
            const params: BookingHistoryParams = {
                page: currentPage,
                limit: 10,
                status: statusFilter,
            };
            const data = await getMemberBookings(params);
            setBookings(data);
        } catch (error) {
            console.error('Failed to load bookings:', error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, statusFilter]);

    useEffect(() => {
        loadBookings();
    }, [loadBookings]);

    const handleStatusChange = (status: StatusFilter) => {
        setStatusFilter(status);
        setCurrentPage(1); // Reset to page 1 when filter changes
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= (bookings?.meta.totalPages || 1)) {
            setCurrentPage(newPage);
        }
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            confirmed: {
                bg: 'bg-blue-100',
                text: 'text-blue-800',
                icon: <PendingIcon className='w-3 h-3' />,
                label: t('bookings.status.confirmed'),
            },
            completed: {
                bg: 'bg-green-100',
                text: 'text-green-800',
                icon: <CheckCircleIcon className='w-3 h-3' />,
                label: t('bookings.status.completed'),
            },
            cancelled: {
                bg: 'bg-red-100',
                text: 'text-red-800',
                icon: <XCircleIcon className='w-3 h-3' />,
                label: t('bookings.status.cancelled'),
            },
            no_show: {
                bg: 'bg-gray-100',
                text: 'text-gray-800',
                icon: <XCircleIcon className='w-3 h-3' />,
                label: 'No Show',
            },
        };

        const badge = badges[status as keyof typeof badges] || badges.confirmed;

        return (
            <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
            >
                {badge.icon}
                {badge.label}
            </span>
        );
    };

    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4 pt-24'>
            <div className='max-w-7xl mx-auto'>
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className='mb-8'>
                    <Link
                        to='/dashboard'
                        className='inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-4'
                    >
                        <ChevronLeftIcon className='w-5 h-5' />
                        {t('common.back')}
                    </Link>
                    <h1 className='text-4xl font-bold text-gray-900 mb-2'>{t('bookings.title')}</h1>
                    <p className='text-gray-600'>{t('bookings.myBookings')}</p>
                </motion.div>

                {/* Filter Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className='bg-white rounded-2xl shadow-lg p-4 mb-6'
                >
                    <div className='flex items-center gap-2 mb-4'>
                        <FilterIcon className='w-5 h-5 text-gray-600' />
                        <h3 className='font-semibold text-gray-900'>{t('bookings.filter')}</h3>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                        {[
                            { value: 'all', label: t('bookings.status.all') },
                            { value: 'confirmed', label: t('bookings.status.confirmed') },
                            { value: 'completed', label: t('bookings.status.completed') },
                            { value: 'cancelled', label: t('bookings.status.cancelled') },
                        ].map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() => handleStatusChange(filter.value as StatusFilter)}
                                className={`px-4 py-2 rounded-full font-medium transition-all ${
                                    statusFilter === filter.value
                                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Bookings List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className='bg-white rounded-2xl shadow-xl overflow-hidden'
                >
                    {isLoading ? (
                        <div className='flex items-center justify-center py-20'>
                            <div className='text-center'>
                                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto'></div>
                                <p className='mt-4 text-gray-600'>{t('common.loading')}</p>
                            </div>
                        </div>
                    ) : !bookings || bookings.data.length === 0 ? (
                        <div className='text-center py-20'>
                            <CalendarIcon className='w-16 h-16 text-gray-300 mx-auto mb-4' />
                            <h3 className='text-xl font-semibold text-gray-900 mb-2'>{t('bookings.noBookings')}</h3>
                            <p className='text-gray-600 mb-6'>{t('bookings.noBookings')}</p>
                            <Link
                                to='/booking'
                                className='inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:shadow-lg transition-shadow'
                            >
                                {t('dashboard.bookNow')}
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className='hidden md:block overflow-x-auto'>
                                <table className='w-full'>
                                    <thead className='bg-gray-50 border-b border-gray-200'>
                                        <tr>
                                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                                {t('bookings.service')}
                                            </th>
                                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                                {t('bookings.branch')}
                                            </th>
                                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                                {t('bookings.date')} & {t('bookings.time')}
                                            </th>
                                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                                {t('bookings.details')}
                                            </th>
                                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                                {t('bookings.status.all')}
                                            </th>
                                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                                {t('common.actions')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-gray-200'>
                                        {bookings.data.map((booking, index) => (
                                            <motion.tr
                                                key={booking.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className='hover:bg-pink-50 transition-colors'
                                            >
                                                <td className='px-6 py-4'>
                                                    <div className='flex items-center gap-3'>
                                                        {booking.serviceImage && (
                                                            <img
                                                                src={booking.serviceImage}
                                                                alt={booking.serviceName}
                                                                className='w-12 h-12 rounded-lg object-cover'
                                                            />
                                                        )}
                                                        <span className='font-medium text-gray-900'>
                                                            {booking.serviceName}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <div className='flex items-center gap-2 text-gray-700'>
                                                        <MapPinIcon className='w-4 h-4 text-gray-400' />
                                                        <span className='text-sm'>{booking.branchName}</span>
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <div className='flex items-center gap-2 text-gray-700'>
                                                        <ClockIcon className='w-4 h-4 text-gray-400' />
                                                        <div className='text-sm'>
                                                            <div>{formatDate(booking.appointmentDate)}</div>
                                                            <div className='text-gray-500'>
                                                                {booking.appointmentTime}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <code className='text-xs bg-gray-100 px-2 py-1 rounded font-mono'>
                                                        {booking.referenceNumber}
                                                    </code>
                                                </td>
                                                <td className='px-6 py-4'>{getStatusBadge(booking.status)}</td>
                                                <td className='px-6 py-4'>
                                                    <button
                                                        onClick={() =>
                                                            navigate(`/booking/detail?ref=${booking.referenceNumber}`)
                                                        }
                                                        className='flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-pink-600 hover:text-pink-700 hover:bg-pink-50 rounded-lg transition-colors'
                                                    >
                                                        <EyeIcon className='w-4 h-4' />
                                                        {t('common.viewDetails')}
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className='md:hidden divide-y divide-gray-200'>
                                {bookings.data.map((booking, index) => (
                                    <motion.div
                                        key={booking.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className='p-4 hover:bg-pink-50 transition-colors'
                                    >
                                        <div className='flex gap-3 mb-3'>
                                            {booking.serviceImage && (
                                                <img
                                                    src={booking.serviceImage}
                                                    alt={booking.serviceName}
                                                    className='w-16 h-16 rounded-lg object-cover'
                                                />
                                            )}
                                            <div className='flex-1 min-w-0'>
                                                <h4 className='font-semibold text-gray-900 mb-1'>
                                                    {booking.serviceName}
                                                </h4>
                                                <div className='text-sm text-gray-600 mb-1'>
                                                    <MapPinIcon className='w-3 h-3 inline mr-1' />
                                                    {booking.branchName}
                                                </div>
                                                <div className='text-sm text-gray-600'>
                                                    <ClockIcon className='w-3 h-3 inline mr-1' />
                                                    {formatDate(booking.appointmentDate)} • {booking.appointmentTime}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex items-center justify-between mb-3'>
                                            <code className='text-xs bg-gray-100 px-2 py-1 rounded font-mono'>
                                                {booking.referenceNumber}
                                            </code>
                                            {getStatusBadge(booking.status)}
                                        </div>
                                        <button
                                            onClick={() => navigate(`/booking/detail?ref=${booking.referenceNumber}`)}
                                            className='w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors'
                                        >
                                            <EyeIcon className='w-4 h-4' />
                                            {t('common.viewDetails')}
                                        </button>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {bookings.meta.totalPages > 1 && (
                                <div className='px-6 py-4 bg-gray-50 border-t border-gray-200'>
                                    <div className='flex items-center justify-between'>
                                        <div className='text-sm text-gray-700'>
                                            Showing{' '}
                                            <span className='font-medium'>
                                                {(currentPage - 1) * bookings.meta.limit + 1}
                                            </span>{' '}
                                            to{' '}
                                            <span className='font-medium'>
                                                {Math.min(currentPage * bookings.meta.limit, bookings.meta.total)}
                                            </span>{' '}
                                            of <span className='font-medium'>{bookings.meta.total}</span> bookings
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className='p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                                            >
                                                <ChevronLeftIcon className='w-5 h-5' />
                                            </button>
                                            <span className='text-sm font-medium text-gray-700'>
                                                Page {currentPage} of {bookings.meta.totalPages}
                                            </span>
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === bookings.meta.totalPages}
                                                className='p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                                            >
                                                <ChevronRightIcon className='w-5 h-5' />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
