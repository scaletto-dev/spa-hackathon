import { useState } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, UserIcon } from 'lucide-react';
const therapists = [{
  id: 1,
  name: 'Linh N.',
  specialty: 'Skin Specialist',
  rating: 4.9,
  recommended: true
}, {
  id: 2,
  name: 'Mai T.',
  specialty: 'Laser Expert',
  rating: 4.8,
  recommended: false
}, {
  id: 3,
  name: 'Hoa P.',
  specialty: 'Anti-Aging Specialist',
  rating: 4.7,
  recommended: false
}, {
  id: 4,
  name: 'Any Available',
  specialty: 'First available therapist',
  rating: null,
  recommended: false
}];
export function TherapistSelector({
  selectedTherapist,
  onSelect
}) {
  return <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Therapist (Optional)
      </label>
      <div className="grid md:grid-cols-2 gap-3">
        {therapists.map(therapist => <motion.div key={therapist.id} whileHover={{
        scale: 1.02
      }} whileTap={{
        scale: 0.98
      }} onClick={() => onSelect(therapist)} className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedTherapist?.id === therapist.id ? 'border-pink-500 bg-pink-50' : 'border-gray-200 bg-white hover:border-pink-200'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${therapist.recommended ? 'bg-gradient-to-br from-pink-400 to-purple-500' : 'bg-gray-100'}`}>
                <UserIcon className={`w-5 h-5 ${therapist.recommended ? 'text-white' : 'text-gray-400'}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-800">{therapist.name}</p>
                  {therapist.recommended && <SparklesIcon className="w-4 h-4 text-pink-500" />}
                </div>
                <p className="text-xs text-gray-600">{therapist.specialty}</p>
                {therapist.rating && <p className="text-xs text-gray-500">⭐ {therapist.rating}</p>}
              </div>
            </div>
            {therapist.recommended && <div className="absolute -top-2 -right-2 px-2 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-medium rounded-full">
                AI Pick
              </div>}
          </motion.div>)}
      </div>
      {selectedTherapist?.recommended && <motion.p initial={{
      opacity: 0,
      y: -5
    }} animate={{
      opacity: 1,
      y: 0
    }} className="mt-2 text-sm text-pink-600">
          ✨ Recommended: {selectedTherapist.name} specializes in your selected
          treatment
        </motion.p>}
    </div>;
}