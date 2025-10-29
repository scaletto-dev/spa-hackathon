import { NavLink } from 'react-router-dom';
import {
    LayoutDashboardIcon,
    CalendarIcon,
    SparklesIcon,
    BuildingIcon,
    UsersIcon,
    UserIcon,
    CreditCardIcon,
    MessageSquareIcon,
    FileTextIcon,
    SettingsIcon,
} from 'lucide-react';

const navItems = [
    {
        path: '/admin',
        icon: LayoutDashboardIcon,
        label: 'Dashboard',
    },
    {
        path: '/admin/appointments',
        icon: CalendarIcon,
        label: 'Appointments',
    },
    {
        path: '/admin/services',
        icon: SparklesIcon,
        label: 'Services',
    },
    {
        path: '/admin/branches',
        icon: BuildingIcon,
        label: 'Branches',
    },
    {
        path: '/admin/customers',
        icon: UsersIcon,
        label: 'Customers',
    },
    {
        path: '/admin/staff',
        icon: UserIcon,
        label: 'Staff',
    },
    {
        path: '/admin/payments',
        icon: CreditCardIcon,
        label: 'Payments',
    },
    {
        path: '/admin/reviews',
        icon: MessageSquareIcon,
        label: 'Reviews',
    },
    {
        path: '/admin/blog',
        icon: FileTextIcon,
        label: 'Blog',
    },
    {
        path: '/admin/settings',
        icon: SettingsIcon,
        label: 'Settings',
    },
];
export function Sidebar() {
    return (
        <aside className='w-64 bg-white/60 backdrop-blur-xl border-r border-pink-100 flex flex-col shadow-lg'>
            <div className='h-16 flex items-center justify-center border-b border-pink-100'>
                <div className='flex items-center gap-2'>
                    <div className='w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center'>
                        <SparklesIcon className='w-6 h-6 text-white' />
                    </div>
                    <div>
                        <h1 className='text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent'>
                            BeautyAI
                        </h1>
                        <p className='text-xs text-gray-500'>Admin Portal</p>
                    </div>
                </div>
            </div>
            <nav className='flex-1 overflow-y-auto py-6 px-3'>
                <div className='space-y-1'>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/admin'}
                            className={({ isActive }: { isActive: boolean }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                    isActive
                                        ? 'bg-gradient-to-r from-pink-100 to-purple-100 text-pink-600 shadow-sm'
                                        : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
                                }`
                            }
                        >
                            {({ isActive }: { isActive: boolean }) => (
                                <>
                                    <item.icon className={`w-5 h-5 ${isActive ? 'text-pink-500' : ''}`} />
                                    <span className='font-medium text-sm'>{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </nav>
            <div className='p-4 border-t border-pink-100'>
                <div className='bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl p-4'>
                    <div className='flex items-center gap-2 mb-2'>
                        <div className='w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center'>
                            <SparklesIcon className='w-4 h-4 text-white' />
                        </div>
                        <span className='font-semibold text-sm text-gray-800'>AI Assistant</span>
                    </div>
                    <p className='text-xs text-gray-600 mb-3'>Get intelligent insights and recommendations</p>
                    <button className='w-full py-2 bg-white rounded-lg text-xs font-medium text-pink-600 hover:bg-pink-50 transition-colors'>
                        Ask AI
                    </button>
                </div>
            </div>
        </aside>
    );
}
