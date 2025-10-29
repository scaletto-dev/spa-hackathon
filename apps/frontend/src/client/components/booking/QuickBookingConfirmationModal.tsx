import { motion } from 'framer-motion';
import { CheckCircleIcon, XIcon, DownloadIcon, CalendarIcon, MapPinIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
export function QuickBookingConfirmationModal({
  bookingData,
  onClose
}) {
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} exit={{
    opacity: 0
  }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{
      scale: 0.9,
      opacity: 0
    }} animate={{
      scale: 1,
      opacity: 1
    }} exit={{
      scale: 0.9,
      opacity: 0
    }} onClick={e => e.stopPropagation()} className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
        {/* Success Icon */}
        <motion.div initial={{
        scale: 0
      }} animate={{
        scale: 1
      }} transition={{
        delay: 0.2,
        type: 'spring',
        stiffness: 200,
        damping: 15
      }} className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircleIcon className="w-12 h-12 text-white" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
          ✅ Your smart booking is confirmed!
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Appointment details have been sent to {bookingData.email}
        </p>
        {/* Booking Details Card */}
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 mb-6 space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Service</p>
            <p className="font-semibold text-gray-800">
              {bookingData.service?.title}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4 text-pink-500" />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium text-gray-800">
                {bookingData.branch?.name}
              </p>
            </div>
          </div>
          {bookingData.therapist && <div>
              <p className="text-sm text-gray-500 mb-1">Therapist</p>
              <p className="font-medium text-gray-800">
                {bookingData.therapist.name}
              </p>
            </div>}
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-pink-500" />
            <div>
              <p className="text-sm text-gray-500">Date & Time</p>
              <p className="font-medium text-gray-800">
                {bookingData.date?.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}{' '}
                at {bookingData.time}
              </p>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Paid</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {bookingData.service?.price}
              </span>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex gap-3 mb-4">
          <motion.button whileHover={{
          scale: 1.02
        }} whileTap={{
          scale: 0.98
        }} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-pink-200 text-gray-700 rounded-2xl font-medium">
            <DownloadIcon className="w-5 h-5" />
            Receipt
          </motion.button>
          <motion.button whileHover={{
          scale: 1.02
        }} whileTap={{
          scale: 0.98
        }} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-pink-200 text-gray-700 rounded-2xl font-medium">
            <CalendarIcon className="w-5 h-5" />
            Add to Calendar
          </motion.button>
        </div>
        <Link to="/">
          <motion.button whileHover={{
          scale: 1.02
        }} whileTap={{
          scale: 0.98
        }} onClick={onClose} className="w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl font-semibold shadow-lg">
            Return to Home
          </motion.button>
        </Link>
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
          <XIcon className="w-5 h-5 text-gray-600" />
        </button>
      </motion.div>
    </motion.div>;
}