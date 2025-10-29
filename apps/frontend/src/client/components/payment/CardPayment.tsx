import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCardIcon, ShieldCheckIcon } from 'lucide-react';
export function CardPayment() {
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
    saveCard: false
  });
  const [errors, setErrors] = useState({});
  const handleChange = e => {
    const {
      name,
      value,
      type,
      checked
    } = e.target;
    setCardData({
      ...cardData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  const formatCardNumber = value => {
    return value.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ').substr(0, 19) || '';
  };
  const formatExpiry = value => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').substr(0, 5);
  };
  return <div className="space-y-6">
      {/* Card Preview */}
      <motion.div initial={{
      opacity: 0,
      scale: 0.95
    }} animate={{
      opacity: 1,
      scale: 1
    }} className="relative h-48 bg-gradient-to-br from-pink-500 via-purple-500 to-rose-500 rounded-2xl p-6 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start">
            <CreditCardIcon className="w-10 h-10" />
            <div className="text-right">
              <p className="text-xs opacity-80">Visa</p>
            </div>
          </div>
          <div>
            <p className="text-xl tracking-wider mb-4 font-mono">
              {cardData.number || '•••• •••• •••• ••••'}
            </p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs opacity-80 mb-1">Card Holder</p>
                <p className="font-medium">{cardData.name || 'YOUR NAME'}</p>
              </div>
              <div>
                <p className="text-xs opacity-80 mb-1">Expires</p>
                <p className="font-medium">{cardData.expiry || 'MM/YY'}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      {/* Card Form */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Number
          </label>
          <input type="text" name="number" value={cardData.number} onChange={e => handleChange({
          target: {
            name: 'number',
            value: formatCardNumber(e.target.value)
          }
        })} placeholder="1234 5678 9012 3456" className="w-full px-4 py-3 bg-white/80 border-2 border-pink-100 rounded-2xl focus:outline-none focus:border-pink-300 transition-colors" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cardholder Name
          </label>
          <input type="text" name="name" value={cardData.name} onChange={handleChange} placeholder="John Doe" className="w-full px-4 py-3 bg-white/80 border-2 border-pink-100 rounded-2xl focus:outline-none focus:border-pink-300 transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiry Date
          </label>
          <input type="text" name="expiry" value={cardData.expiry} onChange={e => handleChange({
          target: {
            name: 'expiry',
            value: formatExpiry(e.target.value)
          }
        })} placeholder="MM/YY" className="w-full px-4 py-3 bg-white/80 border-2 border-pink-100 rounded-2xl focus:outline-none focus:border-pink-300 transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CVC
          </label>
          <input type="text" name="cvc" value={cardData.cvc} onChange={handleChange} placeholder="123" maxLength={3} className="w-full px-4 py-3 bg-white/80 border-2 border-pink-100 rounded-2xl focus:outline-none focus:border-pink-300 transition-colors" />
        </div>
      </div>
      {/* 3D Secure Badge */}
      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200">
        <ShieldCheckIcon className="w-5 h-5 text-green-600" />
        <span className="text-sm text-green-700 font-medium">
          3-D Secure protected transaction
        </span>
      </div>
      {/* Save Card Option */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" name="saveCard" checked={cardData.saveCard} onChange={handleChange} className="w-4 h-4 rounded accent-pink-500" />
        <span className="text-sm text-gray-700">
          Save this card for future bookings
        </span>
      </label>
    </div>;
}