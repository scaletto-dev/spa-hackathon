import { motion } from 'framer-motion';
import { AlertCircleIcon, CheckCircleIcon } from 'lucide-react';
export function PayAtClinicPayment() {
  return <div className="space-y-6">
      {/* Info Card */}
      <motion.div initial={{
      opacity: 0,
      y: 10
    }} animate={{
      opacity: 1,
      y: 0
    }} className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
        <div className="flex items-start gap-3">
          <AlertCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">
              Pay at Clinic Policy
            </h4>
            <p className="text-sm text-gray-700">
              You can pay when you arrive at our clinic. We accept cash and all
              major credit cards.
            </p>
          </div>
        </div>
      </motion.div>
      {/* Deposit Policy */}
      <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-200">
        <h4 className="font-semibold text-gray-800 mb-3 text-sm">
          Deposit Policy:
        </h4>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>No deposit required for first-time bookings</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>20% deposit required for premium services</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Free cancellation up to 24 hours before appointment</span>
          </div>
        </div>
      </div>
      {/* What to Bring */}
      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-3 text-sm">
          What to bring:
        </h4>
        <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
          <li>Valid ID for verification</li>
          <li>Booking confirmation (email or SMS)</li>
          <li>Payment method (cash or card)</li>
          <li>Any relevant medical documents (if applicable)</li>
        </ul>
      </div>
      {/* Confirmation Note */}
      <div className="p-4 bg-pink-50 rounded-2xl border border-pink-200">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Note:</span> Your appointment will be
          confirmed immediately. Please arrive 10 minutes early for check-in.
        </p>
      </div>
    </div>;
}