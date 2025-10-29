import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SparklesIcon, MenuIcon, XIcon } from 'lucide-react';
export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navLinks = [
        {
            name: 'Home',
            path: '/',
        },
        {
            name: 'Services',
            path: '/services',
        },
        {
            name: 'Book',
            path: '/booking',
        },
        {
            name: 'Locations',
            path: '/branches',
        },
        {
            name: 'Blog',
            path: '/blog',
        },
        {
            name: 'Contact',
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
    return (
        <header
            className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
                isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-md py-3' : 'bg-transparent py-5'
            }`}
        >
            <div className='max-w-7xl mx-auto px-6 flex items-center justify-between'>
                {/* Logo */}
                <Link to='/' className='flex items-center gap-2'>
                    <div className='w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center'>
                        <SparklesIcon className='w-6 h-6 text-white' />
                    </div>
                    <span className='text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent'>
                        BeautyAI
                    </span>
                </Link>
                {/* Desktop Navigation */}
                <nav className='hidden md:flex items-center gap-8'>
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`relative font-medium ${
                                location.pathname === link.path
                                    ? 'text-pink-600'
                                    : 'text-gray-700 hover:text-pink-600 transition-colors'
                            }`}
                        >
                            {link.name}
                            {location.pathname === link.path && (
                                <motion.div
                                    layoutId='navIndicator'
                                    className='absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500'
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
                {/* Book Now Button */}
                <Link
                    to='/booking'
                    className='hidden md:flex items-center px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow'
                >
                    Book Now
                </Link>
                {/* Mobile Menu Button */}
                <button className='md:hidden text-gray-700' onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <XIcon className='w-6 h-6' /> : <MenuIcon className='w-6 h-6' />}
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
                        className='absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-lg py-6 px-6 flex flex-col gap-4 md:hidden'
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`font-medium ${
                                    location.pathname === link.path ? 'text-pink-600' : 'text-gray-700'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            to='/booking'
                            onClick={() => setIsMobileMenuOpen(false)}
                            className='mt-2 flex items-center justify-center px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium shadow-lg'
                        >
                            Book Now
                        </Link>
                    </motion.div>
                )}
            </div>
        </header>
    );
}
