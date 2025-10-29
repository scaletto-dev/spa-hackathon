import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ArrowLeftIcon, SparklesIcon, LockIcon } from 'lucide-react';
import { OrderSummary } from '../payment/OrderSummary';
import { PaymentMethodSelector } from '../payment/PaymentMethodSelector';
import { PaymentSuccess } from '../payment/PaymentSuccess';
export function BookingPayment({
  bookingData,
  updateBookingData,
  onNext,
  onPrev
}) {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const subtotal = parseFloat(bookingData.service?.price.replace('$', '') || '0');
  const discount = appliedPromo ? subtotal * 0.1 : 0;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + tax;
  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setShowSuccess(true);
    updateBookingData({
      paymentMethod: selectedMethod,
      promoCode: appliedPromo,
      total: total
    });
    // Auto-advance after showing success
    setTimeout(() => {
      onNext();
    }, 3000);
  };
  if (showSuccess) {
    return <PaymentSuccess bookingData={bookingData} total={total} />;
  }
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
          Payment Method
        </h2>
        <p className="text-gray-600">
          Choose your preferred payment method to complete your booking
        </p>
      </div>
      {/* AI Recommendation Banner */}
      <motion.div initial={{
      opacity: 0,
      y: -10
    }} animate={{
      opacity: 1,
      y: 0
    }} className="mb-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4 border border-pink-200/50">
        <div className="flex items-center gap-3">
          <SparklesIcon className="w-5 h-5 text-pink-500 flex-shrink-0" />
          <p className="text-sm text-gray-700">
            <span className="font-medium">AI recommends</span> e-wallet for
            fastest checkout based on your preferences
          </p>
        </div>
      </motion.div>
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Payment Method Selector - Takes 2 columns */}
        <div className="lg:col-span-2">
          <PaymentMethodSelector selectedMethod={selectedMethod} setSelectedMethod={setSelectedMethod} promoCode={promoCode} setPromoCode={setPromoCode} appliedPromo={appliedPromo} setAppliedPromo={setAppliedPromo} />
        </div>
        {/* Order Summary - Takes 1 column */}
        <div className="lg:col-span-1">
          <OrderSummary bookingData={bookingData} subtotal={subtotal} discount={discount} tax={tax} total={total} appliedPromo={appliedPromo} />
        </div>
      </div>
      {/* Trust Indicators */}
      <div className="flex items-center justify-center gap-4 mb-8 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <LockIcon className="w-4 h-4" />
          <span>Secure checkout</span>
        </div>
        <span>•</span>
        <span>PCI-compliant</span>
        <span>•</span>
        <span className="text-pink-600 font-medium">Test mode</span>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <motion.button whileHover={{
        scale: 1.05
      }} whileTap={{
        scale: 0.95
      }} onClick={onPrev} className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-pink-200 text-gray-700 rounded-full font-semibold shadow-lg">
          <ArrowLeftIcon className="w-5 h-5" />
          Back
        </motion.button>
        <motion.button whileHover={{
        scale: 1.05
      }} whileTap={{
        scale: 0.95
      }} onClick={handlePayment} disabled={isProcessing} className={`flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold shadow-xl ${isProcessing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'}`}>
          {isProcessing ? <>
              <motion.div animate={{
            rotate: 360
          }} transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear'
          }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              Processing...
            </> : <>
              Pay & Confirm Appointment
              <ArrowRightIcon className="w-5 h-5" />
            </>}
        </motion.button>
      </div>
      {/* Mobile Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 p-4 lg:hidden z-40">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-600">Total</span>
          <span className="text-2xl font-bold text-gray-800">
            ${total.toFixed(2)}
          </span>
        </div>
        <motion.button whileHover={{
        scale: 1.02
      }} whileTap={{
        scale: 0.98
      }} onClick={handlePayment} disabled={isProcessing} className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full font-semibold shadow-xl ${isProcessing ? 'bg-gray-300 text-gray-500' : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'}`}>
          {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
        </motion.button>
      </div>
    </motion.div>;
}