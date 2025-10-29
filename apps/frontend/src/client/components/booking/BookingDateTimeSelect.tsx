import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ArrowLeftIcon, CalendarIcon, ClockIcon, SparklesIcon } from 'lucide-react';
// Fake data for the calendar
const currentDate = new Date();
const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
export function BookingDateTimeSelect({
  bookingData,
  updateBookingData,
  onNext,
  onPrev
}) {
  const [selectedDate, setSelectedDate] = useState(bookingData.date || null);
  const [selectedTime, setSelectedTime] = useState(bookingData.time || null);
  const [useAI, setUseAI] = useState(bookingData.useAI || false);
  const handleSelectDate = day => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date);
    updateBookingData({
      date
    });
  };
  const handleSelectTime = time => {
    setSelectedTime(time);
    updateBookingData({
      time
    });
  };
  const handleUseAI = value => {
    setUseAI(value);
    updateBookingData({
      useAI: value
    });
    // If AI is selected, automatically pick a time (just for demo)
    if (value) {
      const aiRecommendedTime = timeSlots[Math.floor(Math.random() * timeSlots.length)];
      setSelectedTime(aiRecommendedTime);
      updateBookingData({
        time: aiRecommendedTime
      });
      // If no date is selected, pick today's date
      if (!selectedDate) {
        setSelectedDate(currentDate);
        updateBookingData({
          date: currentDate
        });
      }
    }
  };
  const renderCalendar = () => {
    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = day === currentDate.getDate();
      const isSelected = selectedDate && day === selectedDate.getDate();
      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
      days.push(<motion.div key={day} whileHover={!isPast ? {
        scale: 1.1
      } : {}} whileTap={!isPast ? {
        scale: 0.95
      } : {}} onClick={() => !isPast && handleSelectDate(day)} className={`h-10 w-10 rounded-full flex items-center justify-center cursor-pointer ${isPast ? 'text-gray-300 cursor-not-allowed' : isSelected ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : isToday ? 'border-2 border-pink-400 text-pink-600' : 'hover:bg-pink-100 text-gray-700'}`}>
          {day}
        </motion.div>);
    }
    return days;
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
          Pick a Date & Time
        </h2>
        <p className="text-gray-600">
          Choose when you'd like to visit {bookingData.branch?.name} for your{' '}
          {bookingData.service?.title}
        </p>
      </div>
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <input type="checkbox" id="aiAssist" checked={useAI} onChange={e => handleUseAI(e.target.checked)} className="w-4 h-4 rounded accent-pink-500" />
          <label htmlFor="aiAssist" className="flex items-center gap-2 cursor-pointer">
            <SparklesIcon className="w-5 h-5 text-pink-500" />
            <span className="text-gray-700">
              Let AI choose the best time for me
            </span>
          </label>
        </div>
        {!useAI && <>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="w-5 h-5 text-pink-500" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Select Date
                </h3>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="text-sm font-medium text-gray-500">
                      {day}
                    </div>)}
              </div>
              <div className="grid grid-cols-7 gap-2 justify-items-center">
                {renderCalendar()}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ClockIcon className="w-5 h-5 text-pink-500" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Select Time
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {timeSlots.map(time => <motion.div key={time} whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }} onClick={() => handleSelectTime(time)} className={`py-3 rounded-xl border-2 text-center cursor-pointer ${selectedTime === time ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-gray-200 hover:border-pink-200 text-gray-700'}`}>
                    {time}
                  </motion.div>)}
              </div>
            </div>
          </>}
        {useAI && <div className="bg-pink-50 rounded-2xl p-6 border border-pink-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  AI Recommendation
                </h3>
                <p className="text-gray-600 mb-3">
                  Based on your service type, provider availability, and optimal
                  healing conditions, we recommend:
                </p>
                <div className="flex flex-wrap gap-3 mb-2">
                  <div className="bg-white rounded-xl px-4 py-2 border border-pink-200 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-pink-500" />
                    <span className="font-medium">
                      {selectedDate ? selectedDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  }) : 'Loading...'}
                    </span>
                  </div>
                  <div className="bg-white rounded-xl px-4 py-2 border border-pink-200 flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-pink-500" />
                    <span className="font-medium">
                      {selectedTime || 'Loading...'}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 italic">
                  This time has been selected based on optimal conditions for
                  your treatment.
                </p>
              </div>
            </div>
          </div>}
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
      }} onClick={onNext} disabled={!(selectedDate && selectedTime) && !useAI} className={`flex items-center gap-2 px-8 py-4 rounded-full font-semibold shadow-xl ${selectedDate && selectedTime || useAI ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
          Continue
          <ArrowRightIcon className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>;
}