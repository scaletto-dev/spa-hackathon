import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    SparklesIcon,
    MenuIcon,
    XIcon,
    LogOutIcon,
    LayoutDashboardIcon,
    UserIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../auth/useAuth';
import { LanguageSwitcher } from '../../../components/LanguageSwitcher';
export function Navbar() {
    const { t } = useTranslation('common');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();
    const navLinks = [
        {
            name: t('nav.home'),
            path: '/',
        },
        {
            name: t('nav.services'),
            path: '/services',
        },
        {
            name: t('nav.reviews'),
            path: '/reviews',
        },
        {
            name: t('nav.book'),
            path: '/booking',
        },
        {
            name: t('nav.locations'),
            path: '/branches',
        },
        {
            name: t('nav.blog'),
            path: '/blog',
        },
        {
            name: t('nav.contact'),
            path: '/contact',
        },
    ];
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false);
        navigate('/');
    };

    const handleDashboardClick = () => {
        setIsUserMenuOpen(false);
        if (user?.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/dashboard');
        }
    };
    return (
        <header
            className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
                isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-md py-3' : 'bg-transparent py-5'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <SparklesIcon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                        BeautyAI
                    </span>
                </Link>
                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`relative font-medium text-sm ${
                                location.pathname === link.path
                                    ? 'text-pink-600'
                                    : 'text-gray-700 hover:text-pink-600 transition-colors'
                            }`}
                        >
                            {link.name}
                            {location.pathname === link.path && (
                                <motion.div
                                    layoutId="navIndicator"
                                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500"
                                    initial={{
                                        opacity: 0,
                                    }}
                                    animate={{
                                        opacity: 1,
                                    }}
                                    transition={{
                                        duration: 0.3,
                                    }}
                                />
                            )}
                        </Link>
                    ))}
                </nav>
                {/* Auth Section - Desktop */}
                <div className="hidden lg:flex items-center gap-3">
                    <LanguageSwitcher />
                    {!isAuthenticated ? (
                        <>
                            <Link
                                to="/login"
                                className="px-4 py-2 text-gray-700 hover:text-pink-600 font-medium transition-colors text-sm"
                            >
                                {t('nav.signIn')}
                            </Link>
                            <Link
                                to="/register"
                                className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow text-sm"
                            >
                                {t('nav.signUp')}
                            </Link>
                        </>
                    ) : (
                        <div className="relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center gap-2 px-4 py-2 bg-white/80 border border-pink-200 rounded-full hover:bg-pink-50 transition-colors"
                                aria-label="User menu"
                                aria-expanded={isUserMenuOpen}
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <span className="font-medium text-gray-800">
                                    {user?.name || 'User'}
                                </span>
                            </button>

                            {/* User Dropdown Menu */}
                            <AnimatePresence>
                                {isUserMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50"
                                    >
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-semibold text-gray-900">
                                                {user?.name}
                                            </p>
                                            <p className="text-xs text-gray-500">{user?.email}</p>
                                        </div>

                                        <button
                                            onClick={handleDashboardClick}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-gray-700 hover:bg-pink-50 transition-colors"
                                        >
                                            <LayoutDashboardIcon className="w-4 h-4" />
                                            <span className="text-sm">
                                                {user?.role === 'admin'
                                                    ? t('nav.adminDashboard')
                                                    : t('nav.myAccount')}
                                            </span>
                                        </button>

                                        {user?.role === 'admin' && (
                                            <button
                                                onClick={() => {
                                                    setIsUserMenuOpen(false);
                                                    navigate('/dashboard');
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-gray-700 hover:bg-pink-50 transition-colors"
                                            >
                                                <LayoutDashboardIcon className="w-4 h-4" />
                                                <span className="text-sm">
                                                    {t('nav.clientDashboard')}
                                                </span>
                                            </button>
                                        )}

                                        <button
                                            onClick={() => {
                                                setIsUserMenuOpen(false);
                                                navigate('/dashboard/profile');
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-gray-700 hover:bg-pink-50 transition-colors"
                                        >
                                            <UserIcon className="w-4 h-4" />
                                            <span className="text-sm">
                                                {t('nav.myProfile') || 'My Profile'}
                                            </span>
                                        </button>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOutIcon className="w-4 h-4" />
                                            <span className="text-sm">{t('nav.signOut')}</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden text-gray-700"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? (
                        <XIcon className="w-6 h-6" />
                    ) : (
                        <MenuIcon className="w-6 h-6" />
                    )}
                </button>
                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: -20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            y: -20,
                        }}
                        className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-lg py-6 px-6 flex flex-col gap-4 lg:hidden"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`font-medium ${
                                    location.pathname === link.path
                                        ? 'text-pink-600'
                                        : 'text-gray-700'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Mobile Auth Section */}
                        <div className="mt-2 pt-4 border-t border-gray-200 flex flex-col gap-3">
                            <div className="flex justify-center">
                                <LanguageSwitcher />
                            </div>
                            {!isAuthenticated ? (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center justify-center px-6 py-2.5 border-2 border-pink-500 text-pink-600 rounded-full font-medium hover:bg-pink-50 transition-colors"
                                    >
                                        {t('nav.signIn')}
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium shadow-lg"
                                    >
                                        {t('nav.signUp')}
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl">
                                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {user?.name}
                                            </p>
                                            <p className="text-xs text-gray-500">{user?.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            handleDashboardClick();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border-2 border-pink-200 text-gray-800 rounded-full font-medium"
                                    >
                                        <LayoutDashboardIcon className="w-4 h-4" />
                                        {user?.role === 'admin'
                                            ? t('nav.adminDashboard')
                                            : t('nav.myAccount')}
                                    </button>
                                    {user?.role === 'admin' && (
                                        <button
                                            onClick={() => {
                                                navigate('/dashboard');
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border-2 border-purple-200 text-gray-800 rounded-full font-medium"
                                        >
                                            <LayoutDashboardIcon className="w-4 h-4" />
                                            {t('nav.clientDashboard')}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            navigate('/dashboard/profile');
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-full font-medium"
                                    >
                                        <UserIcon className="w-4 h-4" />
                                        {t('nav.myProfile') || 'My Profile'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="flex items-center justify-center gap-2 px-6 py-2.5 border-2 border-red-300 text-red-600 rounded-full font-medium hover:bg-red-50"
                                    >
                                        <LogOutIcon className="w-4 h-4" />
                                        {t('nav.signOut')}
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </header>
    );
}
