import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ArrowLeftIcon, MapPinIcon } from 'lucide-react';
const branches = [{
  id: 1,
  name: 'Downtown Clinic',
  image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=400&fit=crop',
  address: '123 Main Street, Downtown',
  phone: '(555) 123-4567',
  hours: 'Mon-Sat: 9AM-7PM'
}, {
  id: 2,
  name: 'Westside Center',
  image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop',
  address: '456 West Avenue, Westside',
  phone: '(555) 234-5678',
  hours: 'Mon-Sat: 9AM-7PM'
}, {
  id: 3,
  name: 'Eastside Spa',
  image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop',
  address: '789 East Boulevard, Eastside',
  phone: '(555) 345-6789',
  hours: 'Mon-Sat: 9AM-7PM'
}];
export function BookingBranchSelect({
  bookingData,
  updateBookingData,
  onNext,
  onPrev
}) {
  const handleSelectBranch = branch => {
    updateBookingData({
      branch
    });
  };
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    y: -20
  }} transition={{
    duration: 0.5
  }}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Choose a Branch
        </h2>
        <p className="text-gray-600">
          Select which BeautyAI location you'd like to visit for your{' '}
          {bookingData.service?.title}
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {branches.map(branch => <motion.div key={branch.id} whileHover={{
        y: -5
      }} onClick={() => handleSelectBranch(branch)} className={`cursor-pointer bg-white/70 backdrop-blur-xl rounded-3xl border-2 ${bookingData.branch?.id === branch.id ? 'border-pink-500 shadow-lg shadow-pink-200' : 'border-white/50 shadow-lg'} overflow-hidden transition-all`}>
            <div className="relative h-44 overflow-hidden">
              <img src={branch.image} alt={branch.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white">{branch.name}</h3>
              </div>
              {bookingData.branch?.id === branch.id && <div className="absolute top-4 right-4 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                  <MapPinIcon className="w-5 h-5 text-white" />
                </div>}
            </div>
            <div className="p-5">
              <div className="text-gray-700 mb-2 text-sm">{branch.address}</div>
              <div className="text-gray-600 text-xs">{branch.hours}</div>
            </div>
          </motion.div>)}
      </div>
      <div className="flex justify-between mt-12">
        <motion.button whileHover={{
        scale: 1.05
      }} whileTap={{
        scale: 0.95
      }} onClick={onPrev} className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-pink-200 text-gray-700 rounded-full font-semibold shadow-lg">
          <ArrowLeftIcon className="w-5 h-5" />
          Back
        </motion.button>
        <motion.button whileHover={{
        scale: 1.05
      }} whileTap={{
        scale: 0.95
      }} onClick={onNext} disabled={!bookingData.branch} className={`flex items-center gap-2 px-8 py-4 rounded-full font-semibold shadow-xl ${bookingData.branch ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
          Continue
          <ArrowRightIcon className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>;
}