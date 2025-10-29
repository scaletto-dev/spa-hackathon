import React from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, ArrowRightIcon } from 'lucide-react';
export function BlogHero() {
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.6
  }} className="relative rounded-3xl overflow-hidden shadow-2xl">
      <div className="relative aspect-[21/9] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=1400&h=600&fit=crop" alt="AI in Beauty Industry" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
        <div className="flex gap-3 mb-4">
          <span className="px-4 py-1 bg-pink-500 text-white rounded-full text-sm font-medium">
            Featured
          </span>
          <span className="px-4 py-1 bg-purple-500 text-white rounded-full text-sm font-medium">
            AI Trends
          </span>
        </div>
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
          The Future of Beauty: How AI is Revolutionizing Skincare Routines
        </h2>
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          <div className="flex items-center gap-2 text-pink-200">
            <CalendarIcon className="w-5 h-5" />
            <span>April 15, 2024</span>
          </div>
          <p className="text-white/80 md:max-w-xl line-clamp-2 md:line-clamp-none">
            Discover how artificial intelligence is transforming skincare
            analysis and enabling truly personalized beauty treatments for every
            skin type and concern.
          </p>
        </div>
        <motion.button whileHover={{
        scale: 1.05,
        x: 5
      }} whileTap={{
        scale: 0.95
      }} className="mt-6 flex items-center gap-2 text-white font-medium group">
          Read Full Article
          <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </motion.div>;
}