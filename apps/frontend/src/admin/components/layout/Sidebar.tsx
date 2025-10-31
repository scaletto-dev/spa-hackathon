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
    XIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from '../../../utils/toast';

interface SidebarProps {
    onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
    const { t } = useTranslation('common');
    
    const navItems = [
        {
            path: '/admin',
            icon: LayoutDashboardIcon,
            label: t('admin.nav.dashboard'),
        },
        {
            path: '/admin/appointments',
            icon: CalendarIcon,
            label: t('admin.nav.appointments'),
        },
        {
            path: '/admin/services',
            icon: SparklesIcon,
            label: t('admin.nav.services'),
        },
        {
            path: '/admin/branches',
            icon: BuildingIcon,
            label: t('admin.nav.branches'),
        },
        {
            path: '/admin/customers',
            icon: UsersIcon,
            label: t('admin.nav.customers'),
        },
        {
            path: '/admin/payments',
            icon: CreditCardIcon,
            label: t('admin.nav.payments'),
        },
        {
            path: '/admin/reviews',
            icon: MessageSquareIcon,
            label: t('admin.nav.reviews'),
        },
        {
            path: '/admin/blog',
            icon: FileTextIcon,
            label: t('admin.nav.blog'),
        },
        {
            path: '/admin/settings',
            icon: SettingsIcon,
            label: t('admin.nav.settings'),
        },
    ];
    return (
        <aside className='w-64 h-full bg-white backdrop-blur-xl border-r border-pink-100 flex flex-col shadow-lg'>
            {/* Header with close button for mobile */}
            <div className='h-16 flex items-center justify-between px-4 border-b border-pink-100'>
                <div className='flex items-center gap-2'>
                    <div className='w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center'>
                        <SparklesIcon className='w-6 h-6 text-white' />
                    </div>
                    <div>
                        <h1 className='text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent'>
                            BeautyAI
                        </h1>
                        <p className='text-xs text-gray-500'>{t('admin.portal')}</p>
                    </div>
                </div>
                {/* Close button - only visible on mobile */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className='lg:hidden p-2 rounded-lg hover:bg-pink-50 transition-colors'
                        aria-label='Close menu'
                    >
                        <XIcon className='w-5 h-5 text-gray-600' />
                    </button>
                )}
            </div>
            <nav className='flex-1 overflow-y-auto py-6 px-3'>
                <div className='space-y-1'>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/admin'}
                            onClick={() => onClose?.()}
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
                    <button
                        onClick={() => toast.info('AI Assistant feature coming soon!')}
                        className='w-full py-2 bg-white rounded-lg text-xs font-medium text-pink-600 hover:bg-pink-50 transition-colors'
                    >
                        Ask AI
                    </button>
                </div>
            </div>
        </aside>
    );
}
