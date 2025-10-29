import React from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, ScanIcon, ZapIcon, HeartIcon, EyeIcon, SmileIcon } from 'lucide-react';
const services = [{
  icon: ScanIcon,
  title: 'AI Skin Analysis',
  description: 'Advanced technology scans and analyzes your skin to create personalized treatment plans',
  gradient: 'from-pink-400 to-rose-400'
}, {
  icon: SparklesIcon,
  title: 'Personalized Treatment',
  description: 'Custom beauty protocols designed specifically for your unique skin type and goals',
  gradient: 'from-purple-400 to-pink-400'
}, {
  icon: ZapIcon,
  title: 'Laser Perfection',
  description: 'State-of-the-art laser treatments for hair removal, skin rejuvenation, and more',
  gradient: 'from-rose-400 to-pink-400'
}, {
  icon: HeartIcon,
  title: 'Anti-Aging Solutions',
  description: 'Advanced treatments including Botox, fillers, and collagen stimulation therapy',
  gradient: 'from-pink-400 to-purple-400'
}, {
  icon: EyeIcon,
  title: 'Facial Rejuvenation',
  description: 'Comprehensive facial treatments for glowing, youthful, and radiant skin',
  gradient: 'from-purple-400 to-rose-400'
}, {
  icon: SmileIcon,
  title: 'Wellness Consultations',
  description: 'Holistic beauty and wellness guidance from certified aesthetic professionals',
  gradient: 'from-rose-400 to-purple-400'
}];
export function Services() {
  return <section className="w-full py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }} className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Our Services
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            AI Skin Analysis • Personalized Treatment • Laser Perfection
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => <motion.div key={index} initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6,
          delay: index * 0.1
        }} whileHover={{
          y: -10,
          scale: 1.02
        }} className="group">
              <div className="h-full bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-8 hover:shadow-2xl transition-all">
                <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>)}
        </div>
      </div>
    </section>;
}