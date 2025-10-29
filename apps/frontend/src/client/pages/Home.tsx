import React from 'react';
import { Hero } from '../components/Home/Hero';
import { BookingWidget } from '../components/Home/BookingWidget';
import { Services } from '../components/services/Services';
import { AIBanner } from '../components/Home/AIBanner';
import { Testimonials } from '../components/Home/Testimonials';
import { Blog } from '../components/blog/Blog';
import { Branches } from '../components/Home/Branches';
export function Home() {
    return (
        <div className='w-full min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50'>
            <Hero />
            <BookingWidget />
            <Services />
            <AIBanner />
            <Testimonials />
            <Blog />
            <Branches />
        </div>
    );
}
