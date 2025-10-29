import React from 'react';
import { motion } from 'framer-motion';
import { MapPinIcon, PhoneIcon, MailIcon, ClockIcon, InstagramIcon, FacebookIcon, TwitterIcon } from 'lucide-react';
export function ContactInfo() {
  return <motion.div initial={{
    opacity: 0,
    x: 20
  }} animate={{
    opacity: 1,
    x: 0
  }} transition={{
    duration: 0.6
  }} className="space-y-8">
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Contact Information
        </h2>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPinIcon className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Main Office</h3>
              <p className="text-gray-600">
                123 Beauty Lane, Suite 100
                <br />
                New York, NY 10001
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <PhoneIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Phone</h3>
              <p className="text-gray-600">
                Main: (555) 123-4567
                <br />
                Support: (555) 765-4321
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MailIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Email</h3>
              <p className="text-gray-600">
                info@beautyai.com
                <br />
                support@beautyai.com
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <ClockIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Hours</h3>
              <p className="text-gray-600">
                Monday - Friday: 9AM - 7PM
                <br />
                Saturday: 10AM - 5PM
                <br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="font-medium text-gray-800 mb-3">Follow Us</h3>
          <div className="flex gap-4">
            {[{
            icon: InstagramIcon,
            href: '#',
            color: 'bg-gradient-to-br from-pink-500 to-purple-500'
          }, {
            icon: FacebookIcon,
            href: '#',
            color: 'bg-blue-600'
          }, {
            icon: TwitterIcon,
            href: '#',
            color: 'bg-sky-500'
          }].map((social, index) => <motion.a key={index} href={social.href} whileHover={{
            y: -3
          }} className={`w-10 h-10 ${social.color} rounded-full flex items-center justify-center text-white`}>
                <social.icon className="w-5 h-5" />
              </motion.a>)}
          </div>
        </div>
      </div>
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl overflow-hidden">
        <div className="h-64 bg-gray-200 relative">
          {/* This is a placeholder for a map */}
          <div className="absolute inset-0 bg-cover bg-center" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?w=800&h=400&fit=crop')"
        }}></div>
          <div className="absolute inset-0 bg-pink-500/10"></div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <MapPinIcon className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        <div className="p-6">
          <h3 className="font-medium text-gray-800 mb-2">
            Visit Our Main Location
          </h3>
          <p className="text-gray-600 mb-4">
            Conveniently located in the heart of downtown, our flagship clinic
            offers the full range of beauty and aesthetic services.
          </p>
          <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-pink-600 font-medium hover:text-pink-700 transition-colors">
            Get Directions
          </a>
        </div>
      </div>
    </motion.div>;
}