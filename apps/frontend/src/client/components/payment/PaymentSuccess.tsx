import { motion } from 'framer-motion';
import { CheckCircleIcon, DownloadIcon, CalendarIcon } from 'lucide-react';
export function PaymentSuccess({
  bookingData,
  total
}) {
  return <motion.div initial={{
    opacity: 0,
    scale: 0.9
  }} animate={{
    opacity: 1,
    scale: 1
  }} className="text-center py-8">
      <motion.div initial={{
      scale: 0
    }} animate={{
      scale: 1
    }} transition={{
      delay: 0.2,
      type: 'spring',
      stiffness: 200,
      damping: 15
    }} className="w-24 h-24 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircleIcon className="w-14 h-14 text-white" />
      </motion.div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        Payment Successful!
      </h2>
      <p className="text-lg text-gray-600 mb-8">
        Your payment of ${total.toFixed(2)} has been processed
      </p>
      <div className="max-w-md mx-auto space-y-4">
        <div className="p-4 bg-pink-50 rounded-2xl border border-pink-200 text-left">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Transaction ID:</span> #TXN
            {Math.floor(100000 + Math.random() * 900000)}
          </p>
          <p className="text-sm text-gray-700 mt-1">
            <span className="font-medium">Payment Method:</span>{' '}
            {bookingData.paymentMethod === 'card' && 'Credit Card'}
            {bookingData.paymentMethod === 'ewallet' && 'E-Wallet'}
            {bookingData.paymentMethod === 'bank' && 'Bank Transfer'}
            {bookingData.paymentMethod === 'clinic' && 'Pay at Clinic'}
          </p>
        </div>
        <div className="flex gap-3">
          <motion.button whileHover={{
          scale: 1.02
        }} whileTap={{
          scale: 0.98
        }} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-pink-200 text-gray-700 rounded-2xl font-medium">
            <DownloadIcon className="w-5 h-5" />
            Download Receipt
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
      </div>
      <p className="mt-6 text-sm text-gray-500">
        Redirecting to confirmation page...
      </p>
    </motion.div>;
}