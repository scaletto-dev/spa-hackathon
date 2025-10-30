import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, BellIcon, BotIcon, ChevronDownIcon, LogOutIcon, UserIcon, MenuIcon } from 'lucide-react';
import { useAuth } from '../../../auth/useAuth';
import { toast } from '../../../utils/toast';
import { LanguageSwitcher } from '../../../components/LanguageSwitcher';

interface HeaderProps {
    onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        window.location.href = '/admin/login';
    };

    return (
        <header className='h-16 bg-white/80 backdrop-blur-lg border-b border-pink-100 flex items-center justify-between px-4 md:px-6 shadow-sm sticky top-0 z-[100]'>
            {/* Left: Menu + Search */}
            <div className='flex items-center gap-2 md:gap-4 flex-1 max-w-2xl'>
                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    className='lg:hidden p-2 rounded-lg hover:bg-pink-50 transition-colors'
                    aria-label='Open menu'
                >
                    <MenuIcon className='w-5 h-5 text-gray-600' />
                </button>

                {/* Search - Full on desktop, toggle on mobile */}
                <div className='relative flex-1 hidden sm:block'>
                    <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                    <input
                        type='text'
                        placeholder='Search patients, services, bookings...'
                        className='w-full pl-10 pr-4 py-2 rounded-full bg-pink-50/50 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent text-sm'
                    />
                </div>

                {/* Mobile Search Icon */}
                <button
                    onClick={() => setShowSearch(!showSearch)}
                    className='sm:hidden p-2 rounded-full hover:bg-pink-50 transition-colors'
                    aria-label='Search'
                >
                    <SearchIcon className='w-5 h-5 text-gray-600' />
                </button>
            </div>

            {/* Right: Actions */}
            <div className='flex items-center gap-2 md:gap-4'>
                {/* Language Switcher */}
                <LanguageSwitcher />
                
                {/* AI Assistant Button - Hidden on small mobile */}
                <button
                    onClick={() => toast.info('AI Assistant feature coming soon!')}
                    className='hidden md:flex relative p-2 rounded-full hover:bg-pink-50 transition-colors group'
                >
                    <BotIcon className='w-5 h-5 text-purple-400 group-hover:text-purple-500' />
                    <span className='absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-pulse' />
                </button>

                {/* Notifications Dropdown */}
                <div className='relative' ref={notifRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className='relative p-2 rounded-full hover:bg-pink-50 transition-colors'
                    >
                        <BellIcon className='w-5 h-5 text-gray-600' />
                        <span className='absolute top-1 right-1 w-2 h-2 bg-rose-400 rounded-full' />
                    </button>

                    {showNotifications && (
                        <div className='absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-pink-100 py-2 z-[9999]'>
                            <div className='px-4 py-2 border-b border-pink-100'>
                                <h3 className='font-semibold text-gray-800'>Notifications</h3>
                            </div>
                            <div className='max-h-96 overflow-y-auto'>
                                <div className='px-4 py-3 hover:bg-pink-50 cursor-pointer'>
                                    <p className='text-sm text-gray-800 font-medium'>New appointment booked</p>
                                    <p className='text-xs text-gray-500 mt-1'>Jane Doe - Hair Styling - 2:00 PM</p>
                                </div>
                                <div className='px-4 py-3 hover:bg-pink-50 cursor-pointer'>
                                    <p className='text-sm text-gray-800 font-medium'>Payment received</p>
                                    <p className='text-xs text-gray-500 mt-1'>$150.00 from John Smith</p>
                                </div>
                                <div className='px-4 py-3 hover:bg-pink-50 cursor-pointer'>
                                    <p className='text-sm text-gray-800 font-medium'>New review posted</p>
                                    <p className='text-xs text-gray-500 mt-1'>5 stars - "Amazing service!"</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Admin Profile Dropdown */}
                <div className='relative' ref={profileRef}>
                    <div
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className='flex items-center gap-2 pl-2 md:pl-4 border-l border-pink-100 cursor-pointer hover:bg-pink-50 rounded-full pr-2 py-1 transition-colors'
                    >
                        <img
                            src='https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
                            alt='Admin'
                            className='w-8 h-8 rounded-full border-2 border-pink-200'
                        />
                        <span className='hidden sm:inline text-sm font-medium text-gray-700'>
                            {user?.name || 'Admin'}
                        </span>
                        <ChevronDownIcon className='w-4 h-4 text-gray-400' />
                    </div>

                    {showProfileMenu && (
                        <div className='absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-pink-100 py-2 z-[9999]'>
                            <div className='px-4 py-3 border-b border-pink-100'>
                                <p className='text-sm font-semibold text-gray-800'>{user?.name || 'Admin'}</p>
                                <p className='text-xs text-gray-500'>{user?.email || 'admin@company.com'}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowProfileMenu(false);
                                    navigate('/admin/settings');
                                }}
                                className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-pink-50 flex items-center gap-2'
                            >
                                <UserIcon className='w-4 h-4' />
                                Profile Settings
                            </button>
                            <button
                                onClick={handleLogout}
                                className='w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2'
                            >
                                <LogOutIcon className='w-4 h-4' />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
