import React from 'react';
import { motion } from 'framer-motion';
export function AvailabilityIndicator() {
  return <motion.div initial={{
    opacity: 0,
    scale: 0.8
  }} animate={{
    opacity: 1,
    scale: 1
  }} className="flex items-center gap-1">
      <motion.div animate={{
      scale: [1, 1.2, 1]
    }} transition={{
      duration: 2,
      repeat: Infinity
    }} className="w-2 h-2 bg-green-500 rounded-full" />
      <span className="text-xs text-green-600 font-medium">Available</span>
    </motion.div>;
}