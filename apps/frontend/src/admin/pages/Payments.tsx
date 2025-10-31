import { useState, useEffect } from 'react';
import {
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    DollarSignIcon,
    FilterIcon,
    SearchIcon,
    TrendingUpIcon,
} from 'lucide-react';
import { Toast } from '../components/Toast';
import { CustomDropdown } from '../components/CustomDropdown';
import { adminPaymentsAPI } from '../../api/adapters/admin';
import { useAdminList } from '../../hooks/useAdmin';

export function Payments() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All Status');
    const [selectedType, setSelectedType] = useState('All Types');
    const [stats, setStats] = useState<any>(null);
    const [toast, setToast] = useState<{
        message: string;
        type: 'success' | 'error' | 'warning';
    } | null>(null);

    const {
        data: payments = [],
        loading,
        fetch,
        page,
        limit,
        total,
        goToPage,
        setPageSize,
    } = useAdminList(adminPaymentsAPI.getAll);

    // Fetch stats on mount
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminPaymentsAPI.getStats();
                setStats(data);
            } catch (err) {
                console.error('Failed to fetch payment stats:', err);
            }
        };
        fetchStats();
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await adminPaymentsAPI.updateStatus(id, newStatus);
            setToast({ message: 'Payment status updated!', type: 'success' });
            fetch();
        } catch (err: any) {
            setToast({ message: err.message, type: 'error' });
        }
    };

    const handleDeletePayment = async (id: string, transactionId: string) => {
        if (confirm(`Delete payment ${transactionId || id}?`)) {
            try {
                await adminPaymentsAPI.delete(id);
                setToast({ message: 'Payment deleted!', type: 'success' });
                fetch();
            } catch (err: any) {
                setToast({ message: err.message, type: 'error' });
            }
        }
    };

    const filteredPayments = (payments || []).filter((payment: any) => {
        const matchesSearch =
            payment.transactionId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.booking?.guestName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.booking?.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === 'All Status' || payment.status === selectedStatus;
        const matchesType = selectedType === 'All Types' || payment.paymentType === selectedType;
        return matchesSearch && matchesStatus && matchesType;
    });

    const getStatusBadge = (status: string) => {
        const badges: Record<string, { bg: string; text: string; icon: any }> = {
            COMPLETED: {
                bg: 'bg-green-100',
                text: 'text-green-700',
                icon: CheckCircleIcon,
            },
            PENDING: {
                bg: 'bg-yellow-100',
                text: 'text-yellow-700',
                icon: ClockIcon,
            },
            FAILED: {
                bg: 'bg-red-100',
                text: 'text-red-700',
                icon: XCircleIcon,
            },
            REFUNDED: {
                bg: 'bg-purple-100',
                text: 'text-purple-700',
                icon: TrendingUpIcon,
            },
            CANCELLED: {
                bg: 'bg-gray-100',
                text: 'text-gray-700',
                icon: XCircleIcon,
            },
        };
        const badge = badges[status as keyof typeof badges] || badges['PENDING'];
        const Icon = badge.icon;
        return (
            <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}
            >
                <Icon className="w-3 h-3" />
                {status}
            </span>
        );
    };

    const getPaymentTypeBadge = (type: string) => {
        const colors: Record<string, string> = {
            ATM: 'bg-blue-100 text-blue-700',
            CLINIC: 'bg-pink-100 text-pink-700',
            WALLET: 'bg-purple-100 text-purple-700',
            CASH: 'bg-green-100 text-green-700',
            BANK_TRANSFER: 'bg-indigo-100 text-indigo-700',
        };
        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                    colors[type] || 'bg-gray-100 text-gray-700'
                }`}
            >
                {type}
            </span>
        );
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Payments</h1>
                    <p className="text-gray-600 mt-1">Manage payment transactions</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center">
                            <CheckCircleIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 font-medium">Completed</p>
                            <p className="text-xl font-bold text-gray-800">
                                {stats?.completedPayments || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-4 border border-yellow-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-amber-400 flex items-center justify-center">
                            <ClockIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 font-medium">Pending</p>
                            <p className="text-xl font-bold text-gray-800">
                                {stats?.pendingPayments || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-4 border border-red-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-400 to-rose-400 flex items-center justify-center">
                            <XCircleIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 font-medium">Failed</p>
                            <p className="text-xl font-bold text-gray-800">
                                {stats?.failedPayments || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                            <DollarSignIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 font-medium">Total Payments</p>
                            <p className="text-xl font-bold text-gray-800">
                                {stats?.totalPayments || 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
                {/* Filters */}
                <div className="p-4 border-b border-pink-100 flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[200px]">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by transaction ID, customer..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border-2 border-pink-100 focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 text-sm transition-all duration-200 hover:border-pink-200"
                        />
                    </div>

                    <CustomDropdown
                        value={selectedStatus}
                        onChange={setSelectedStatus}
                        color="pink"
                        options={[
                            { value: 'All Status', label: 'All Status' },
                            { value: 'COMPLETED', label: 'COMPLETED', icon: '✓' },
                            { value: 'PENDING', label: 'PENDING', icon: '⏱' },
                            { value: 'FAILED', label: 'FAILED', icon: '✗' },
                            { value: 'REFUNDED', label: 'REFUNDED', icon: '↩' },
                            { value: 'CANCELLED', label: 'CANCELLED', icon: '⊘' },
                        ]}
                    />

                    <CustomDropdown
                        value={selectedType}
                        onChange={setSelectedType}
                        color="purple"
                        options={[
                            { value: 'All Types', label: 'All Types' },
                            { value: 'ATM', label: 'ATM', icon: '💳' },
                            { value: 'CLINIC', label: 'Clinic', icon: '🏥' },
                            { value: 'WALLET', label: 'Wallet', icon: '👛' },
                            { value: 'CASH', label: 'Cash', icon: '💵' },
                            { value: 'BANK_TRANSFER', label: 'Bank Transfer', icon: '🏦' },
                        ]}
                    />

                    <button className="p-2.5 rounded-xl bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200 hover:border-pink-400 hover:shadow-lg transition-all duration-200">
                        <FilterIcon className="w-5 h-5 text-pink-500" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-pink-50/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Transaction ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-pink-100">
                                {filteredPayments.map((payment: any) => (
                                    <tr
                                        key={payment.id}
                                        className="hover:bg-pink-50/30 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-sm">
                                            <div className="font-mono text-gray-800">
                                                {payment.transactionId || 'N/A'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Booking: {payment.booking?.referenceNumber}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="font-medium text-gray-800">
                                                {payment.booking?.guestName ||
                                                    payment.booking?.user?.fullName ||
                                                    'Guest'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {payment.booking?.guestEmail ||
                                                    payment.booking?.user?.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="font-semibold text-gray-800">
                                                {formatCurrency(Number(payment.amount))}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {payment.currency}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {getPaymentTypeBadge(payment.paymentType)}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {getStatusBadge(payment.status)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(payment.createdAt).toLocaleDateString(
                                                'vi-VN'
                                            )}
                                            <div className="text-xs text-gray-500">
                                                {new Date(payment.createdAt).toLocaleTimeString(
                                                    'vi-VN'
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                {payment.status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                handleStatusUpdate(
                                                                    payment.id,
                                                                    'COMPLETED'
                                                                )
                                                            }
                                                            className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors"
                                                        >
                                                            Complete
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleStatusUpdate(
                                                                    payment.id,
                                                                    'FAILED'
                                                                )
                                                            }
                                                            className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
                                                        >
                                                            Fail
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() =>
                                                        handleDeletePayment(
                                                            payment.id,
                                                            payment.transactionId
                                                        )
                                                    }
                                                    className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && payments.length > 0 && (
                    <div className="flex items-center justify-between p-4 border-t border-pink-100 bg-pink-50/30">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Items per page:</span>
                            <select
                                value={limit}
                                onChange={(e) => setPageSize(Number(e.target.value))}
                                className="px-3 py-1 rounded-lg border border-pink-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>

                        <div className="flex flex-1 items-center justify-center gap-4">
                            <button
                                onClick={() => goToPage(page - 1)}
                                disabled={page === 1}
                                className="px-4 py-2 rounded-lg bg-white border border-pink-200 text-gray-700 hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
                            >
                                Previous
                            </button>
                            <div className="text-sm text-gray-600">
                                Page <span className="font-semibold text-pink-600">{page}</span> of{' '}
                                <span className="font-semibold">{Math.ceil(total / limit)}</span>
                            </div>
                            <button
                                onClick={() => goToPage(page + 1)}
                                disabled={page >= Math.ceil(total / limit)}
                                className="px-4 py-2 rounded-lg bg-white border border-pink-200 text-gray-700 hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
                            >
                                Next
                            </button>
                        </div>

                        <div className="text-sm text-gray-600">
                            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of{' '}
                            {total} payments
                        </div>
                    </div>
                )}
            </div>

            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}
        </div>
    );
}

export default Payments;
