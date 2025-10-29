import { motion } from 'framer-motion';
import { StarIcon, QuoteIcon } from 'lucide-react';
const testimonials = [{
  name: 'Sarah Johnson',
  image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
  rating: 5,
  text: 'The AI skin analysis was incredibly accurate! My personalized treatment plan has transformed my skin in just 3 months.'
}, {
  name: 'Emily Chen',
  image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
  rating: 5,
  text: 'Best aesthetic clinic experience ever. The technology and expertise combined make this place truly special.'
}, {
  name: 'Jessica Martinez',
  image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
  rating: 5,
  text: 'Professional, modern, and results-driven. The AI recommendations were spot-on for my skin concerns.'
}];
export function Testimonials() {
  return <section className="w-full py-24 px-6 bg-gradient-to-b from-transparent to-pink-50/30">
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
              Client Stories
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            Over 10,000 satisfied clients trust us with their beauty journey
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => <motion.div key={index} initial={{
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
          y: -5
        }} className="relative">
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-8 h-full">
                <QuoteIcon className="w-10 h-10 text-pink-300 mb-4" />
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => <StarIcon key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {testimonial.text}
                </p>
                <div className="flex items-center gap-4">
                  <img src={testimonial.image} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover border-2 border-pink-200" />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">Verified Client</p>
                  </div>
                </div>
              </div>
            </motion.div>)}
        </div>
      </div>
    </section>;
}