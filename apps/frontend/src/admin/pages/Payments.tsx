import { useState } from 'react';
import { DollarSignIcon, TrendingUpIcon, AlertTriangleIcon, EyeIcon, DownloadIcon } from 'lucide-react';
import {
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { PaymentDetailsModal } from '../components/modals/PaymentDetailsModal';
import { RefundModal } from '../components/modals/RefundModal';
import { Toast } from '../components/Toast';
const revenueData = [
    {
        name: 'Mon',
        revenue: 2400,
    },
    {
        name: 'Tue',
        revenue: 3200,
    },
    {
        name: 'Wed',
        revenue: 2800,
    },
    {
        name: 'Thu',
        revenue: 3600,
    },
    {
        name: 'Fri',
        revenue: 4200,
    },
    {
        name: 'Sat',
        revenue: 5100,
    },
    {
        name: 'Sun',
        revenue: 3800,
    },
];
const paymentMethodData = [
    {
        name: 'Credit Card',
        value: 65,
    },
    {
        name: 'Cash',
        value: 20,
    },
    {
        name: 'Digital Wallet',
        value: 15,
    },
];
const COLORS = ['#f472b6', '#c084fc', '#fb7185'];
const transactions = [
    {
        id: 'BK-2024-001',
        date: '2024-01-15',
        customer: 'Sarah Johnson',
        amount: 120,
        status: 'paid',
        service: 'Luxury Facial',
    },
    {
        id: 'BK-2024-002',
        date: '2024-01-15',
        customer: 'Michael Chen',
        amount: 150,
        status: 'pending',
        service: 'Deep Tissue Massage',
    },
    {
        id: 'BK-2024-003',
        date: '2024-01-14',
        customer: 'Emily Davis',
        amount: 200,
        status: 'paid',
        service: 'Hair Treatment',
    },
    {
        id: 'BK-2024-004',
        date: '2024-01-14',
        customer: 'James Wilson',
        amount: 85,
        status: 'refunded',
        service: 'Manicure',
    },
];
export function Payments() {
    const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
    const [refundTransaction, setRefundTransaction] = useState<string | null>(null);
    const [toast, setToast] = useState<{
        message: string;
        type: 'success' | 'error' | 'warning';
    } | null>(null);
    const handleRefundConfirm = () => {
        setToast({
            message: 'Refund processed successfully',
            type: 'success',
        });
        setRefundTransaction(null);
    };

    const handleExportReport = () => {
        console.log('📊 Mock: Exporting payments report');
        setToast({
            message: 'Đang xuất báo cáo thanh toán... (Mocked)',
            type: 'success',
        });
    };
    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold text-gray-800'>Payments & Transactions</h1>
                    <p className='text-gray-600 mt-1'>Track revenue and manage transactions</p>
                </div>
                <button
                    onClick={handleExportReport}
                    className='px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-xl font-medium hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm flex items-center gap-2'
                >
                    <DownloadIcon className='w-5 h-5' />
                    Export Report
                </button>
            </div>
            <div className='bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-4 border border-orange-200'>
                <div className='flex items-center gap-2'>
                    <AlertTriangleIcon className='w-5 h-5 text-orange-600' />
                    <p className='text-sm text-gray-700'>
                        <span className='font-semibold'>AI Alert:</span> Unusual refund activity detected this week. 3
                        refunds vs. usual 0-1.
                    </p>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100 shadow-sm'>
                    <div className='flex items-center justify-between mb-4'>
                        <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center'>
                            <DollarSignIcon className='w-6 h-6 text-white' />
                        </div>
                        <span className='text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full'>
                            +15%
                        </span>
                    </div>
                    <h3 className='text-sm text-gray-600 mb-1'>Revenue This Week</h3>
                    <p className='text-3xl font-bold text-gray-800'>$12,450</p>
                </div>
                <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100 shadow-sm'>
                    <div className='flex items-center justify-between mb-4'>
                        <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center'>
                            <TrendingUpIcon className='w-6 h-6 text-white' />
                        </div>
                        <span className='text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full'>+8%</span>
                    </div>
                    <h3 className='text-sm text-gray-600 mb-1'>Average Transaction</h3>
                    <p className='text-3xl font-bold text-gray-800'>$138</p>
                </div>
                <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100 shadow-sm'>
                    <div className='flex items-center justify-between mb-4'>
                        <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center'>
                            <DollarSignIcon className='w-6 h-6 text-white' />
                        </div>
                        <span className='text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded-full'>
                            3 pending
                        </span>
                    </div>
                    <h3 className='text-sm text-gray-600 mb-1'>Pending Payments</h3>
                    <p className='text-3xl font-bold text-gray-800'>$425</p>
                </div>
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                <div className='lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100 shadow-sm'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4'>Revenue Trend</h3>
                    <ResponsiveContainer width='100%' height={300}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray='3 3' stroke='#fecdd3' />
                            <XAxis dataKey='name' stroke='#9ca3af' />
                            <YAxis stroke='#9ca3af' />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #fecdd3',
                                    borderRadius: '12px',
                                }}
                            />
                            <Line
                                type='monotone'
                                dataKey='revenue'
                                stroke='url(#revenueGradient)'
                                strokeWidth={3}
                                dot={{
                                    fill: '#10b981',
                                    r: 4,
                                }}
                            />
                            <defs>
                                <linearGradient id='revenueGradient' x1='0' y1='0' x2='1' y2='0'>
                                    <stop offset='0%' stopColor='#10b981' />
                                    <stop offset='100%' stopColor='#34d399' />
                                </linearGradient>
                            </defs>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100 shadow-sm'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4'>Payment Methods</h3>
                    <ResponsiveContainer width='100%' height={300}>
                        <PieChart>
                            <Pie
                                data={paymentMethodData}
                                cx='50%'
                                cy='50%'
                                labelLine={false}
                                label={({ name, percent }: { name: string; percent: number }) =>
                                    `${name} ${(percent * 100).toFixed(0)}%`
                                }
                                outerRadius={100}
                                fill='#8884d8'
                                dataKey='value'
                            >
                                {paymentMethodData.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #fecdd3',
                                    borderRadius: '12px',
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className='bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 shadow-sm overflow-hidden'>
                <div className='p-4 border-b border-pink-100 flex items-center justify-between'>
                    <h3 className='text-lg font-semibold text-gray-800'>Recent Transactions</h3>
                    <div className='flex gap-2'>
                        <select className='px-4 py-2 rounded-lg bg-pink-50/50 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm'>
                            <option>All Status</option>
                            <option>Paid</option>
                            <option>Pending</option>
                            <option>Refunded</option>
                        </select>
                    </div>
                </div>
                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead className='bg-pink-50/50'>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    Booking ID
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    Date
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    Customer
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    Service
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    Amount
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    Status
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-pink-100'>
                            {transactions.map((transaction) => (
                                <tr key={transaction.id} className='hover:bg-pink-50/30 transition-colors'>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span className='font-medium text-gray-800'>{transaction.id}</span>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span className='text-sm text-gray-600'>{transaction.date}</span>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span className='text-sm text-gray-700'>{transaction.customer}</span>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <span className='text-sm text-gray-700'>{transaction.service}</span>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span className='text-sm font-semibold text-gray-800'>
                                            ${transaction.amount}
                                        </span>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                transaction.status === 'paid'
                                                    ? 'bg-green-100 text-green-700'
                                                    : transaction.status === 'pending'
                                                      ? 'bg-yellow-100 text-yellow-700'
                                                      : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {transaction.status}
                                        </span>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <button
                                            onClick={() => setSelectedTransaction(transaction.id)}
                                            className='p-2 rounded-lg hover:bg-blue-100 transition-colors'
                                        >
                                            <EyeIcon className='w-4 h-4 text-blue-600' />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <PaymentDetailsModal
                isOpen={!!selectedTransaction}
                onClose={() => setSelectedTransaction(null)}
                transactionId={selectedTransaction || ''}
                onRefund={(id) => {
                    setSelectedTransaction(null);
                    setRefundTransaction(id);
                }}
            />
            <RefundModal
                isOpen={!!refundTransaction}
                onClose={() => setRefundTransaction(null)}
                onConfirm={handleRefundConfirm}
                transactionId={refundTransaction || ''}
            />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
