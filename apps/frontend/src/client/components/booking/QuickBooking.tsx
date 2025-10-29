import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, ZapIcon, ListIcon } from 'lucide-react';
import { TherapistSelector } from './TherapistSelector';
import { InlinePaymentMethod } from './InlinePaymentMethod';
import { AvailabilityIndicator } from './AvailabilityIndicator';
import { QuickBookingConfirmationModal } from './QuickBookingConfirmationModal';
const services = [{
  id: 1,
  title: 'AI Skin Analysis Facial',
  price: '$150',
  duration: '60 min'
}, {
  id: 2,
  title: 'Hydrafacial Treatment',
  price: '$180',
  duration: '45 min'
}, {
  id: 3,
  title: 'Laser Hair Removal',
  price: '$120',
  duration: '30-90 min'
}, {
  id: 4,
  title: 'Botox & Fillers',
  price: '$350',
  duration: '30 min'
}, {
  id: 5,
  title: 'Body Contouring',
  price: '$450',
  duration: '90 min'
}];
const branches = [{
  id: 1,
  name: 'Downtown Clinic',
  address: '123 Main Street'
}, {
  id: 2,
  name: 'Westside Center',
  address: '456 West Avenue'
}, {
  id: 3,
  name: 'Eastside Spa',
  address: '789 East Boulevard'
}];
const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
export function QuickBooking({
  bookingData,
  updateBookingData,
  onSwitchToFull
}) {
  const [formData, setFormData] = useState({
    service: bookingData.service || null,
    branch: bookingData.branch || null,
    therapist: bookingData.therapist || null,
    date: bookingData.date || null,
    time: bookingData.time || null,
    name: bookingData.name || '',
    email: bookingData.email || '',
    phone: bookingData.phone || '',
    paymentMethod: bookingData.paymentMethod || 'card',
    useAI: false,
    promoCode: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  const handleAISelection = () => {
    handleChange('useAI', !formData.useAI);
    if (!formData.useAI) {
      // Simulate AI selection
      setTimeout(() => {
        const aiDate = new Date();
        aiDate.setDate(aiDate.getDate() + 1);
        handleChange('date', aiDate);
        handleChange('time', '3:30 PM');
        handleChange('branch', branches[0]);
      }, 500);
    }
  };
  const handleSubmit = async () => {
    setIsProcessing(true);
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    updateBookingData(formData);
    setIsProcessing(false);
    setShowConfirmation(true);
  };
  const isFormValid = formData.service && formData.branch && formData.date && formData.time && formData.name && formData.email && formData.phone && formData.paymentMethod;
  return <>
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} exit={{
      opacity: 0,
      y: -20
    }} className="grid lg:grid-cols-3 gap-6">
        {/* Main Booking Card */}
        <div className="lg:col-span-2">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-6 md:p-8">
            {/* AI Quick Select Banner */}
            <motion.div initial={{
            opacity: 0,
            y: -10
          }} animate={{
            opacity: 1,
            y: 0
          }} className="mb-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4 border border-pink-200/50">
              <div className="flex items-center gap-3">
                <SparklesIcon className="w-5 h-5 text-pink-500 flex-shrink-0" />
                <label className="flex items-center gap-2 cursor-pointer flex-1">
                  <input type="checkbox" checked={formData.useAI} onChange={handleAISelection} className="w-4 h-4 rounded accent-pink-500" />
                  <span className="text-sm text-gray-700 font-medium">
                    Let AI choose the best available slot for me
                  </span>
                </label>
              </div>
            </motion.div>
            {/* AI Selection Result */}
            {formData.useAI && formData.date && formData.time && <motion.div initial={{
            opacity: 0,
            scale: 0.95
          }} animate={{
            opacity: 1,
            scale: 1
          }} className="mb-6 bg-pink-50 rounded-2xl p-4 border border-pink-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <SparklesIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      AI Recommendation
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Based on optimal conditions and availability:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-pink-600">
                        {formData.date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                      </span>
                      <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-pink-600">
                        {formData.time}
                      </span>
                      <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-pink-600">
                        {formData.branch?.name}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>}
            {/* Form Fields */}
            <div className="space-y-6">
              {/* Service Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Service *
                </label>
                <select value={formData.service?.id || ''} onChange={e => {
                const service = services.find(s => s.id === parseInt(e.target.value));
                handleChange('service', service);
              }} className="w-full px-4 py-3 bg-white/80 border-2 border-pink-100 rounded-2xl focus:outline-none focus:border-pink-300 transition-colors">
                  <option value="">Choose a service...</option>
                  {services.map(service => <option key={service.id} value={service.id}>
                      {service.title} - {service.price} ({service.duration})
                    </option>)}
                </select>
              </div>
              {/* Branch Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Branch *
                </label>
                <select value={formData.branch?.id || ''} onChange={e => {
                const branch = branches.find(b => b.id === parseInt(e.target.value));
                handleChange('branch', branch);
              }} disabled={formData.useAI} className="w-full px-4 py-3 bg-white/80 border-2 border-pink-100 rounded-2xl focus:outline-none focus:border-pink-300 transition-colors disabled:opacity-50">
                  <option value="">Choose a location...</option>
                  {branches.map(branch => <option key={branch.id} value={branch.id}>
                      {branch.name} - {branch.address}
                    </option>)}
                </select>
              </div>
              {/* Therapist Selector */}
              {formData.service && <TherapistSelector selectedTherapist={formData.therapist} onSelect={therapist => handleChange('therapist', therapist)} />}
              {/* Date & Time Selection */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date *
                  </label>
                  <input type="date" value={formData.date ? formData.date.toISOString().split('T')[0] : ''} onChange={e => handleChange('date', new Date(e.target.value))} disabled={formData.useAI} min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 bg-white/80 border-2 border-pink-100 rounded-2xl focus:outline-none focus:border-pink-300 transition-colors disabled:opacity-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    Select Time *
                    {formData.date && formData.service && <AvailabilityIndicator />}
                  </label>
                  <select value={formData.time || ''} onChange={e => handleChange('time', e.target.value)} disabled={formData.useAI} className="w-full px-4 py-3 bg-white/80 border-2 border-pink-100 rounded-2xl focus:outline-none focus:border-pink-300 transition-colors disabled:opacity-50">
                    <option value="">Choose a time...</option>
                    {timeSlots.map(time => <option key={time} value={time}>
                        {time}
                      </option>)}
                  </select>
                </div>
              </div>
              {/* Contact Information */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Your Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Full Name *" value={formData.name} onChange={e => handleChange('name', e.target.value)} className="px-4 py-3 bg-white/80 border-2 border-pink-100 rounded-2xl focus:outline-none focus:border-pink-300 transition-colors" />
                  <input type="tel" placeholder="Phone Number *" value={formData.phone} onChange={e => handleChange('phone', e.target.value)} className="px-4 py-3 bg-white/80 border-2 border-pink-100 rounded-2xl focus:outline-none focus:border-pink-300 transition-colors" />
                </div>
                <input type="email" placeholder="Email Address *" value={formData.email} onChange={e => handleChange('email', e.target.value)} className="mt-4 w-full px-4 py-3 bg-white/80 border-2 border-pink-100 rounded-2xl focus:outline-none focus:border-pink-300 transition-colors" />
              </div>
              {/* Payment Method */}
              <div className="pt-4 border-t border-gray-200">
                <InlinePaymentMethod selectedMethod={formData.paymentMethod} onSelect={method => handleChange('paymentMethod', method)} promoCode={formData.promoCode} onPromoChange={code => handleChange('promoCode', code)} />
              </div>
            </div>
            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <motion.button whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }} onClick={onSwitchToFull} className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-pink-200 text-gray-700 rounded-full font-semibold">
                <ListIcon className="w-5 h-5" />
                Switch to Full Booking Mode
              </motion.button>
              <motion.button whileHover={{
              scale: isFormValid ? 1.02 : 1
            }} whileTap={{
              scale: isFormValid ? 0.98 : 1
            }} onClick={handleSubmit} disabled={!isFormValid || isProcessing} className={`flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold shadow-xl ${isFormValid && !isProcessing ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
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
                    <ZapIcon className="w-5 h-5" />
                    Book Now
                  </>}
              </motion.button>
            </div>
          </div>
        </div>
        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-6 sticky top-24">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Booking Summary
            </h3>
            <div className="space-y-4">
              {formData.service ? <div className="p-3 bg-pink-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Service</p>
                  <p className="font-medium text-gray-800">
                    {formData.service.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formData.service.duration}
                  </p>
                </div> : <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-400">No service selected</p>
                </div>}
              {formData.branch && <div className="p-3 bg-purple-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Location</p>
                  <p className="font-medium text-gray-800">
                    {formData.branch.name}
                  </p>
                </div>}
              {formData.therapist && <div className="p-3 bg-blue-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Therapist</p>
                  <p className="font-medium text-gray-800">
                    {formData.therapist.name}
                  </p>
                </div>}
              {formData.date && formData.time && <div className="p-3 bg-green-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Date & Time</p>
                  <p className="font-medium text-gray-800">
                    {formData.date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
                  </p>
                  <p className="text-sm text-gray-600">{formData.time}</p>
                </div>}
              {formData.service && <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      {formData.service.price}
                    </span>
                  </div>
                </div>}
            </div>
            <div className="mt-6 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
              <p className="text-xs text-gray-600">
                <span className="font-medium">⚡ Quick Booking:</span> Complete
                your appointment in seconds with AI assistance
              </p>
            </div>
          </div>
        </div>
      </motion.div>
      {/* Confirmation Modal */}
      {showConfirmation && <QuickBookingConfirmationModal bookingData={formData} onClose={() => setShowConfirmation(false)} />}
    </>;
}