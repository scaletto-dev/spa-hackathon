import { useState } from 'react';
import {
    SearchIcon,
    FilterIcon,
    PlusIcon,
    EyeIcon,
    Edit3Icon,
    XCircleIcon,
    TrendingUpIcon,
    StarIcon,
} from 'lucide-react';
import { CustomerModal } from '../components/modals/CustomerModal';
import { CustomerDetailsModal } from '../components/modals/CustomerDetailsModal';
import { Toast } from '../components/Toast';
const customers = [
    {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '(555) 123-4567',
        bookings: 24,
        tier: 'VIP',
        status: 'active',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        retention: '95%',
    },
    {
        id: 2,
        name: 'Michael Chen',
        email: 'm.chen@email.com',
        phone: '(555) 234-5678',
        bookings: 12,
        tier: 'Gold',
        status: 'active',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        retention: '88%',
    },
    {
        id: 3,
        name: 'Emily Davis',
        email: 'emily.d@email.com',
        phone: '(555) 345-6789',
        bookings: 8,
        tier: 'Silver',
        status: 'active',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
        retention: '82%',
    },
    {
        id: 4,
        name: 'James Wilson',
        email: 'j.wilson@email.com',
        phone: '(555) 456-7890',
        bookings: 3,
        tier: 'New',
        status: 'active',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        retention: '100%',
    },
];
const tierColors = {
    VIP: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    Gold: 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white',
    Silver: 'bg-gradient-to-r from-gray-300 to-gray-400 text-white',
    New: 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white',
};
export function Customers() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<{
        id: number;
        mode: 'view' | 'edit';
    } | null>(null);
    const [toast, setToast] = useState<{
        message: string;
        type: 'success' | 'error' | 'warning';
    } | null>(null);
    const handleCustomerAdded = () => {
        setToast({
            message: 'Customer added successfully!',
            type: 'success',
        });
    };

    const handleCustomerUpdated = () => {
        setToast({
            message: 'Customer updated successfully!',
            type: 'success',
        });
    };

    const handleCustomerDeleted = (customerId: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
            console.log(`🗑️ Mock: Deleted customer #${customerId}`);
            setToast({
                message: 'Customer deleted successfully! (Mocked)',
                type: 'success',
            });
        }
    };
    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold text-gray-800'>Customers</h1>
                    <p className='text-gray-600 mt-1'>Manage your client database</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className='px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-xl font-medium hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm flex items-center gap-2'
                >
                    <PlusIcon className='w-5 h-5' />
                    Add Customer
                </button>
            </div>
            <div className='bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100'>
                <div className='flex items-start justify-between'>
                    <div className='flex items-center gap-2'>
                        <div className='w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center'>
                            <TrendingUpIcon className='w-4 h-4 text-white' />
                        </div>
                        <div>
                            <p className='text-sm font-semibold text-gray-800'>AI Insights</p>
                            <p className='text-xs text-gray-600'>
                                Most frequent customers: Sarah Johnson (24 visits), Michael Chen (12 visits)
                            </p>
                        </div>
                    </div>
                    <span className='text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full'>
                        High Retention: 88%
                    </span>
                </div>
            </div>
            <div className='bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 shadow-sm overflow-hidden'>
                <div className='p-4 border-b border-pink-100 flex items-center gap-4'>
                    <div className='relative flex-1'>
                        <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                        <input
                            type='text'
                            placeholder='Search customers by name, email, or phone...'
                            className='w-full pl-10 pr-4 py-2 rounded-lg bg-pink-50/50 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm'
                        />
                    </div>
                    <select className='px-4 py-2 rounded-lg bg-pink-50/50 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm'>
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Inactive</option>
                    </select>
                    <select className='px-4 py-2 rounded-lg bg-pink-50/50 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm'>
                        <option>All Tiers</option>
                        <option>VIP</option>
                        <option>Gold</option>
                        <option>Silver</option>
                        <option>New</option>
                    </select>
                    <button className='p-2 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors'>
                        <FilterIcon className='w-5 h-5 text-gray-600' />
                    </button>
                </div>
                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead className='bg-pink-50/50'>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    Customer
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    Contact
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    Total Bookings
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    Membership
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    Retention
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
                            {customers.map((customer) => (
                                <tr key={customer.id} className='hover:bg-pink-50/30 transition-colors'>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='flex items-center gap-3'>
                                            <img
                                                src={customer.avatar}
                                                alt={customer.name}
                                                className='w-10 h-10 rounded-full border-2 border-pink-200'
                                            />
                                            <span className='font-medium text-gray-800'>{customer.name}</span>
                                        </div>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <div className='text-sm'>
                                            <div className='text-gray-700'>{customer.email}</div>
                                            <div className='text-gray-500'>{customer.phone}</div>
                                        </div>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <span className='text-sm font-semibold text-gray-800'>{customer.bookings}</span>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                tierColors[customer.tier as keyof typeof tierColors]
                                            }`}
                                        >
                                            <StarIcon className='w-3 h-3 mr-1' />
                                            {customer.tier}
                                        </span>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <span className='text-sm font-medium text-green-600'>{customer.retention}</span>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700'>
                                            Active
                                        </span>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <div className='flex items-center gap-2'>
                                            <button
                                                onClick={() =>
                                                    setSelectedCustomer({
                                                        id: customer.id,
                                                        mode: 'view',
                                                    })
                                                }
                                                className='p-2 rounded-lg hover:bg-blue-100 transition-colors'
                                            >
                                                <EyeIcon className='w-4 h-4 text-blue-600' />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setSelectedCustomer({
                                                        id: customer.id,
                                                        mode: 'edit',
                                                    })
                                                }
                                                className='p-2 rounded-lg hover:bg-pink-100 transition-colors'
                                            >
                                                <Edit3Icon className='w-4 h-4 text-gray-600' />
                                            </button>
                                            <button
                                                onClick={() => handleCustomerDeleted(customer.id)}
                                                className='p-2 rounded-lg hover:bg-red-100 transition-colors'
                                            >
                                                <XCircleIcon className='w-4 h-4 text-red-500' />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <CustomerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handleCustomerAdded} />
            <CustomerDetailsModal
                isOpen={!!selectedCustomer}
                onClose={() => setSelectedCustomer(null)}
                customerId={selectedCustomer?.id || null}
                mode={selectedCustomer?.mode || 'view'}
                onUpdate={handleCustomerUpdated}
                onDelete={() => {
                    setSelectedCustomer(null);
                    setToast({
                        message: 'Customer deleted successfully!',
                        type: 'success',
                    });
                }}
            />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
