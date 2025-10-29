import { motion } from 'framer-motion';
import { MapPinIcon, PhoneIcon, ClockIcon } from 'lucide-react';
const branches = [{
  name: 'Downtown Clinic',
  image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=400&fit=crop',
  address: '123 Main Street, Downtown',
  phone: '(555) 123-4567',
  hours: 'Mon-Sat: 9AM-7PM'
}, {
  name: 'Westside Center',
  image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop',
  address: '456 West Avenue, Westside',
  phone: '(555) 234-5678',
  hours: 'Mon-Sat: 9AM-7PM'
}, {
  name: 'Eastside Spa',
  image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop',
  address: '789 East Boulevard, Eastside',
  phone: '(555) 345-6789',
  hours: 'Mon-Sat: 9AM-7PM'
}];
export function Branches() {
  return <section className="w-full py-24 px-6 bg-gradient-to-b from-pink-50/30 to-transparent">
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
              Our Locations
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            Visit us at any of our conveniently located clinics
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {branches.map((branch, index) => <motion.div key={index} initial={{
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
          y: -10
        }} className="group cursor-pointer">
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl overflow-hidden hover:shadow-2xl transition-all">
                <div className="relative h-56 overflow-hidden">
                  <img src={branch.image} alt={branch.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-2xl font-bold text-white">
                      {branch.name}
                    </h3>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPinIcon className="w-5 h-5 text-pink-500 flex-shrink-0 mt-1" />
                    <p className="text-gray-700">{branch.address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="w-5 h-5 text-pink-500 flex-shrink-0" />
                    <p className="text-gray-700">{branch.phone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <ClockIcon className="w-5 h-5 text-pink-500 flex-shrink-0" />
                    <p className="text-gray-700">{branch.hours}</p>
                  </div>
                </div>
              </div>
            </motion.div>)}
        </div>
      </div>
    </section>;
}