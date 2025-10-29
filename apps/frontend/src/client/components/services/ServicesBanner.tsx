import React from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, ScanIcon } from 'lucide-react';
export function ServicesBanner() {
  return <section className="relative w-full py-24 px-6 overflow-hidden">
      {/* Floating orbs */}
      <motion.div className="absolute top-10 right-20 w-64 h-64 bg-gradient-to-br from-pink-300/20 to-purple-300/20 rounded-full blur-3xl" animate={{
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.5, 0.3]
    }} transition={{
      duration: 8,
      repeat: Infinity,
      ease: 'easeInOut'
    }} />
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }} className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div animate={{
            rotate: [0, 360]
          }} transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }} className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl flex items-center justify-center flex-shrink-0">
              <ScanIcon className="w-12 h-12 text-white" />
            </motion.div>
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100/80 rounded-full mb-4">
                <SparklesIcon className="w-4 h-4 text-pink-600" />
                <span className="text-sm font-medium text-pink-700">
                  AI-Powered Technology
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Personalized Treatments
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Experience the future of beauty care with our AI skincare
                analysis. Each treatment is customized to your unique skin type,
                concerns, and goals for optimal results.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>;
}