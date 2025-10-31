import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CalendarIcon,
    SparklesIcon,
    TrendingUpIcon,
    ClockIcon,
    MapPinIcon,
    ArrowRightIcon,
    TicketIcon,
} from 'lucide-react';
import {
    getMemberDashboard,
    type MemberDashboardData,
    getMemberVouchers,
} from '../../../api/adapters/member';
import { useAuth } from '../../../auth/useAuth';
import { useTranslation } from 'react-i18next';
import { Voucher } from '../../../api/adapters/voucher';
import VoucherCard from '../../components/vouchers/VoucherCard';

export default function MemberDashboard() {
    const { user } = useAuth();
    const { t } = useTranslation('common');
    const [dashboardData, setDashboardData] = useState<MemberDashboardData | null>(null);
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setIsLoading(true);
            const [data, memberVouchers] = await Promise.all([
                getMemberDashboard(),
                getMemberVouchers(),
            ]);
            setDashboardData(data);
            setVouchers(memberVouchers);
        } catch (error) {
            console.error('Failed to load dashboard:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center pt-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">{t('common.loading')}</p>
                </div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center pt-20">
                <p className="text-gray-600">{t('common.error')}</p>
            </div>
        );
    }

    const { stats, upcomingBookings, specialOffers } = dashboardData;

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4 pt-24">
            <div className="max-w-7xl mx-auto">
                {/* Welcome Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        {t('dashboard.welcome')}, {user?.name || 'Member'}! 👋
                    </h1>
                    <p className="text-gray-600">{t('dashboard.overview')}</p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatsCard
                        icon={<CalendarIcon className="w-6 h-6" />}
                        label={t('dashboard.totalBookings')}
                        value={stats.totalBookings}
                        color="pink"
                        delay={0}
                    />
                    <StatsCard
                        icon={<ClockIcon className="w-6 h-6" />}
                        label={t('dashboard.upcoming')}
                        value={stats.upcomingBookings}
                        color="purple"
                        delay={0.1}
                    />
                    <StatsCard
                        icon={<TrendingUpIcon className="w-6 h-6" />}
                        label={t('dashboard.completed')}
                        value={stats.completedBookings}
                        color="blue"
                        delay={0.2}
                    />
                    <StatsCard
                        icon={<SparklesIcon className="w-6 h-6" />}
                        label={t('dashboard.memberPoints')}
                        value={stats.memberPoints}
                        color="amber"
                        delay={0.3}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Upcoming Bookings Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {t('dashboard.upcomingAppointments')}
                                </h2>
                                <Link
                                    to="/dashboard/bookings"
                                    className="text-pink-500 hover:text-pink-600 font-medium flex items-center gap-1 transition-colors"
                                >
                                    {t('dashboard.viewAll')}
                                    <ArrowRightIcon className="w-4 h-4" />
                                </Link>
                            </div>

                            {upcomingBookings.length === 0 ? (
                                <div className="text-center py-12">
                                    <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 mb-4">
                                        {t('dashboard.noUpcomingAppointments')}
                                    </p>
                                    <Link
                                        to="/booking"
                                        className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:shadow-lg transition-shadow"
                                    >
                                        {t('dashboard.bookNow')}
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {upcomingBookings.map((booking) => (
                                        <BookingCard key={booking.id} booking={booking} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Quick Actions & Special Offers */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-6"
                    >
                        {/* Quick Actions */}
                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                {t('dashboard.quickActions')}
                            </h3>
                            <div className="space-y-3">
                                <Link
                                    to="/booking"
                                    className="block w-full px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold text-center hover:shadow-lg transition-shadow"
                                >
                                    {t('dashboard.bookNewAppointment')}
                                </Link>
                                <Link
                                    to="/dashboard/profile"
                                    className="block w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-center hover:bg-gray-200 transition-colors"
                                >
                                    {t('dashboard.editProfile')}
                                </Link>
                                <Link
                                    to="/dashboard/bookings"
                                    className="block w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-center hover:bg-gray-200 transition-colors"
                                >
                                    {t('dashboard.viewBookingHistory')}
                                </Link>
                            </div>
                        </div>

                        {/* Vouchers Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-white rounded-2xl shadow-xl p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <TicketIcon className="w-5 h-5 text-amber-500" />
                                    {t('voucher.available')}
                                </h3>
                                {vouchers.length > 0 && (
                                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold">
                                        {vouchers.length}
                                    </span>
                                )}
                            </div>
                            <div className="space-y-3">
                                {vouchers.length === 0 ? (
                                    <p className="text-gray-500 text-center py-6">
                                        {t('voucher.noVouchers')}
                                    </p>
                                ) : (
                                    vouchers
                                        .slice(0, 2)
                                        .map((voucher, idx) => (
                                            <VoucherCard
                                                key={voucher.id}
                                                voucher={voucher}
                                                delay={0.6 + idx * 0.1}
                                            />
                                        ))
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

// Stats Card Component
function StatsCard({
    icon,
    label,
    value,
    color,
    delay,
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
    color: string;
    delay: number;
}) {
    const colorClasses = {
        pink: 'from-pink-500 to-pink-600',
        purple: 'from-purple-500 to-purple-600',
        blue: 'from-blue-500 to-blue-600',
        amber: 'from-amber-500 to-amber-600',
    }[color];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
            <div
                className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${colorClasses} text-white mb-4`}
            >
                {icon}
            </div>
            <p className="text-gray-600 text-sm mb-1">{label}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </motion.div>
    );
}

// Booking Card Component
function BookingCard({ booking }: { booking: MemberDashboardData['upcomingBookings'][0] }) {
    const { i18n } = useTranslation();
    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="flex gap-4 p-4 border border-gray-200 rounded-xl hover:border-pink-300 hover:shadow-md transition-all">
            {booking.serviceImage && (
                <img
                    src={booking.serviceImage}
                    alt={booking.serviceName}
                    className="w-20 h-20 rounded-lg object-cover"
                />
            )}
            <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 mb-1 truncate">{booking.serviceName}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{booking.branchName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ClockIcon className="w-4 h-4 flex-shrink-0" />
                    <span>
                        {formatDate(booking.appointmentDate)} • {booking.appointmentTime}
                    </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Ref: {booking.referenceNumber}</p>
            </div>
        </div>
    );
}

// Offer Card Component
function OfferCard({ offer }: { offer: MemberDashboardData['specialOffers'][0] }) {
    const { t, i18n } = useTranslation('common');
    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="p-4 border border-pink-200 rounded-xl bg-gradient-to-br from-pink-50 to-purple-50">
            <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900 flex-1">{offer.title}</h4>
                <span className="text-pink-600 font-bold text-lg">{offer.discountPercent}%</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{offer.description}</p>
            <p className="text-xs text-gray-500">
                {t('dashboard.validUntil')} {formatDate(offer.validUntil)}
            </p>
        </div>
    );
}

export interface MemberProfile {
    id: string; // UUID
    email: string;
    fullName: string;
    phone: string;
    language: 'vi' | 'ja' | 'en' | 'zh';
    createdAt: string; // ISO 8601
    updatedAt?: string; // ISO 8601
}

export interface UpdateProfileParams {
    fullName: string;
    phone: string;
    language?: 'vi' | 'ja' | 'en' | 'zh';
}

const MOCK_MEMBER_PROFILE: MemberProfile = {
    id: 'member-uuid-001',
    email: 'nguyenvana@gmail.com',
    fullName: 'Nguyễn Văn A',
    phone: '+84 912 345 678',
    language: 'vi',
    createdAt: '2024-06-15T08:30:00Z',
    updatedAt: '2025-10-20T14:22:00Z',
};

/**
 * Fetch member profile information
 * @returns Member profile data
 *
 * TODO API: GET /api/v1/members/profile
 * Auth: Required (Bearer token)
 * Response: { data: MemberProfile }
 */
export async function getMemberProfile(): Promise<MemberProfile> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return a copy to avoid mutations
    return { ...MOCK_MEMBER_PROFILE };
}

/**
 * Update member profile information
 * @param params - Fields to update (fullName, phone, language)
 * @returns Updated profile data
 *
 * TODO API: PUT /api/v1/members/profile
 * Auth: Required (Bearer token)
 * Body: { fullName, phone, language? }
 * Response: { data: MemberProfile }
 */
export async function updateMemberProfile(params: UpdateProfileParams): Promise<MemberProfile> {
    const { fullName, phone, language } = params;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 700));

    // Update mock data
    MOCK_MEMBER_PROFILE.fullName = fullName;
    MOCK_MEMBER_PROFILE.phone = phone;
    if (language) {
        MOCK_MEMBER_PROFILE.language = language;
    }
    MOCK_MEMBER_PROFILE.updatedAt = new Date().toISOString();

    // Return updated copy
    return { ...MOCK_MEMBER_PROFILE };
}
