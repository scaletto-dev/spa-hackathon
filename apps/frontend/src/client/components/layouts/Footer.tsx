import React from 'react';
import { motion } from 'framer-motion';
import { InstagramIcon, FacebookIcon, TwitterIcon, YoutubeIcon, SparklesIcon } from 'lucide-react';
export function Footer() {
    return (
        <footer className='w-full bg-gradient-to-br from-[#111827] via-[#8430c4] to-[#111827] text-white py-16 px-6'>
            <div className='max-w-7xl mx-auto'>
                <div className='grid md:grid-cols-3 gap-12 mb-12'>
                    {/* Brand */}
                    <div>
                        <div className='flex items-center gap-2 mb-4'>
                            <div className='w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center'>
                                <SparklesIcon className='w-6 h-6 text-white' />
                            </div>
                            <span className='text-2xl font-bold'>BeautyAI</span>
                        </div>
                        <p className='text-gray-400 leading-relaxed'>
                            Where beauty meets intelligence. Experience the future of aesthetic care with our AI-powered
                            treatments and personalized skincare solutions.
                        </p>
                    </div>
                    {/* Contact */}
                    <div>
                        <h3 className='text-xl font-bold mb-4'>Contact Us</h3>
                        <div className='space-y-3 text-gray-400'>
                            <p>Email: hello@beautyai.com</p>
                            <p>Phone: (555) 123-4567</p>
                            <p>Hours: Mon-Sat, 9AM-7PM</p>
                        </div>
                    </div>
                    {/* Quick Links */}
                    <div>
                        <h3 className='text-xl font-bold mb-4'>Quick Links</h3>
                        <div className='space-y-3'>
                            <a href='#' className='block text-gray-400 hover:text-pink-400 transition-colors'>
                                About Us
                            </a>
                            <a href='#' className='block text-gray-400 hover:text-pink-400 transition-colors'>
                                Services
                            </a>
                            <a href='#' className='block text-gray-400 hover:text-pink-400 transition-colors'>
                                Privacy Policy
                            </a>
                            <a href='#' className='block text-gray-400 hover:text-pink-400 transition-colors'>
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
                {/* Social Media */}
                <div className='border-t border-gray-800 pt-8'>
                    <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
                        <p className='text-gray-400 text-sm'>© 2024 BeautyAI Clinic. All rights reserved.</p>
                        <div className='flex items-center gap-4'>
                            {[
                                {
                                    icon: InstagramIcon,
                                    href: '#',
                                },
                                {
                                    icon: FacebookIcon,
                                    href: '#',
                                },
                                {
                                    icon: TwitterIcon,
                                    href: '#',
                                },
                                {
                                    icon: YoutubeIcon,
                                    href: '#',
                                },
                            ].map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    whileHover={{
                                        scale: 1.2,
                                        y: -2,
                                    }}
                                    whileTap={{
                                        scale: 0.9,
                                    }}
                                    className='w-10 h-10 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-pink-500/30 hover:border-pink-500 transition-colors'
                                >
                                    <social.icon className='w-5 h-5 text-pink-400' />
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
