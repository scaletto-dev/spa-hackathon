import { useState, useMemo } from 'react';
import { BookingStepProps } from './types';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    ArrowRightIcon,
    ArrowLeftIcon,
    CalendarIcon,
    ClockIcon,
    SparklesIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from 'lucide-react';

// Generate time slots dynamically
const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    const startHour = 9; // 9:00
    const endHour = 21; // 21:00
    const intervalMinutes = 30;

    for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += intervalMinutes) {
            const hourStr = hour.toString().padStart(2, '0');
            const minuteStr = minute.toString().padStart(2, '0');
            slots.push(`${hourStr}:${minuteStr}`);
        }
    }
    return slots;
};

export function BookingDateTimeSelect({ bookingData, updateBookingData, onNext, onPrev }: BookingStepProps) {
    const { t } = useTranslation('common');
    const [selectedDate, setSelectedDate] = useState<string | null>(bookingData.date || null);
    const [selectedTime, setSelectedTime] = useState(bookingData.time || null);
    const [useAI, setUseAI] = useState(bookingData.useAI || false);

    // Calendar navigation state
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Filter time slots based on selected date
    const availableTimeSlots = useMemo(() => {
        const allSlots = generateTimeSlots();

        if (!selectedDate) return allSlots;

        const selectedDateObj = new Date(selectedDate + 'T00:00:00');
        const today = new Date();
        const isToday = selectedDateObj.toDateString() === today.toDateString();

        if (!isToday) return allSlots;

        // Filter out past time slots for today
        const currentHour = today.getHours();
        const currentMinute = today.getMinutes();

        return allSlots.filter((timeStr) => {
            const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
            if (!match) return true;

            const [, hourStr, minuteStr, period] = match;
            let hour = parseInt(hourStr || '0', 10);
            const minute = parseInt(minuteStr || '0', 10);

            if (period && period.toUpperCase() === 'PM' && hour !== 12) {
                hour += 12;
            } else if (period && period.toUpperCase() === 'AM' && hour === 12) {
                hour = 0;
            }

            return hour > currentHour || (hour === currentHour && minute > currentMinute);
        });
    }, [selectedDate]);

    // Helper to format date as YYYY-MM-DD in local timezone
    const formatLocalDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleSelectDate = (day: number) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const dateString = formatLocalDate(date);
        setSelectedDate(dateString);
        updateBookingData({
            date: dateString,
        });
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const getMonthName = () => {
        return currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };
    const handleSelectTime = (time: string) => {
        setSelectedTime(time);
        updateBookingData({
            time,
        });
    };
    const handleUseAI = (value: boolean) => {
        setUseAI(value);
        updateBookingData({ useAI: value });
        // If AI is selected, automatically pick a time (just for demo)
        if (value) {
            const allSlots = generateTimeSlots();
            const randomIndex = Math.floor(Math.random() * allSlots.length);
            const aiRecommendedTime = allSlots[randomIndex] ?? allSlots[0] ?? '9:00 AM';
            setSelectedTime(aiRecommendedTime);
            updateBookingData({
                time: aiRecommendedTime,
            });
            // If no date is selected, pick tomorrow's date
            if (!selectedDate) {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                const dateString = formatLocalDate(tomorrow);
                setSelectedDate(dateString);
                updateBookingData({
                    date: dateString,
                });
            }
        }
    };

    const renderCalendar = () => {
        const days = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get days in current viewing month
        const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
        const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className='h-10 w-10'></div>);
        }
        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            date.setHours(0, 0, 0, 0);

            const isToday = date.getTime() === today.getTime();
            const isSelected = selectedDate && formatLocalDate(date) === selectedDate;
            const isPast = date < today; // Only dates before today are past
            days.push(
                <motion.div
                    key={day}
                    whileHover={
                        !isPast
                            ? {
                                  scale: 1.1,
                              }
                            : {}
                    }
                    whileTap={
                        !isPast
                            ? {
                                  scale: 0.95,
                              }
                            : {}
                    }
                    onClick={() => !isPast && handleSelectDate(day)}
                    className={`h-10 w-10 rounded-full flex items-center justify-center cursor-pointer ${
                        isPast
                            ? 'text-gray-300 cursor-not-allowed'
                            : isSelected
                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                            : isToday
                            ? 'border-2 border-pink-400 text-pink-600'
                            : 'hover:bg-pink-100 text-gray-700'
                    }`}
                >
                    {day}
                </motion.div>,
            );
        }
        return days;
    };
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 20,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            exit={{
                opacity: 0,
                y: -20,
            }}
            transition={{
                duration: 0.5,
            }}
        >
            <div className='mb-8'>
                <h2 className='text-2xl font-bold text-gray-800 mb-4'>{t('bookings.pickDateTime')}</h2>
                <p className='text-gray-600'>
                    {t('bookings.chooseDateTime', {
                        branch: bookingData.branch?.name,
                        service: bookingData.service?.name || '',
                    })}
                </p>
            </div>
            <div className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-6 mb-8'>
                <div className='flex items-center gap-2 mb-6'>
                    <input
                        type='checkbox'
                        id='aiAssist'
                        checked={useAI}
                        onChange={(e) => handleUseAI(e.target.checked)}
                        className='w-4 h-4 rounded accent-pink-500'
                    />
                    <label htmlFor='aiAssist' className='flex items-center gap-2 cursor-pointer'>
                        <SparklesIcon className='w-5 h-5 text-pink-500' />
                        <span className='text-gray-700'>{t('bookings.letAIChoose')}</span>
                    </label>
                </div>
                {!useAI && (
                    <>
                        <div className='mb-8'>
                            <div className='flex items-center justify-between mb-4'>
                                <div className='flex items-center gap-2'>
                                    <CalendarIcon className='w-5 h-5 text-pink-500' />
                                    <h3 className='text-lg font-semibold text-gray-800'>{t('bookings.selectDate')}</h3>
                                </div>
                                {/* Month Navigation */}
                                <div className='flex items-center gap-3'>
                                    <button
                                        onClick={handlePrevMonth}
                                        className='p-2 rounded-full hover:bg-pink-100 transition-colors'
                                        aria-label='Previous month'
                                    >
                                        <ChevronLeftIcon className='w-5 h-5 text-gray-600' />
                                    </button>
                                    <span className='font-semibold text-gray-800 min-w-[150px] text-center'>
                                        {getMonthName()}
                                    </span>
                                    <button
                                        onClick={handleNextMonth}
                                        className='p-2 rounded-full hover:bg-pink-100 transition-colors'
                                        aria-label='Next month'
                                    >
                                        <ChevronRightIcon className='w-5 h-5 text-gray-600' />
                                    </button>
                                </div>
                            </div>
                            <div className='grid grid-cols-7 gap-2 text-center mb-4'>
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                    <div key={day} className='text-sm font-medium text-gray-500'>
                                        {day}
                                    </div>
                                ))}
                            </div>
                            <div className='grid grid-cols-7 gap-2 justify-items-center'>{renderCalendar()}</div>
                        </div>
                        <div>
                            <div className='flex items-center gap-2 mb-4'>
                                <ClockIcon className='w-5 h-5 text-pink-500' />
                                <h3 className='text-lg font-semibold text-gray-800'>{t('bookings.selectTime')}</h3>
                            </div>
                            <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                                {availableTimeSlots.map((time) => (
                                    <motion.div
                                        key={time}
                                        whileHover={{
                                            scale: 1.05,
                                        }}
                                        whileTap={{
                                            scale: 0.95,
                                        }}
                                        onClick={() => handleSelectTime(time)}
                                        className={`py-3 rounded-xl border-2 text-center cursor-pointer ${
                                            selectedTime === time
                                                ? 'border-pink-500 bg-pink-50 text-pink-600'
                                                : 'border-gray-200 hover:border-pink-200 text-gray-700'
                                        }`}
                                    >
                                        {time}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
                {useAI && (
                    <div className='bg-pink-50 rounded-2xl p-6 border border-pink-200'>
                        <div className='flex items-start gap-4'>
                            <div className='w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center'>
                                <SparklesIcon className='w-6 h-6 text-white' />
                            </div>
                            <div>
                                <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                                    {t('bookings.aiRecommendation')}
                                </h3>
                                <p className='text-gray-600 mb-3'>{t('bookings.aiRecommendationDesc')}</p>
                                <div className='flex flex-wrap gap-3 mb-2'>
                                    <div className='bg-white rounded-xl px-4 py-2 border border-pink-200 flex items-center gap-2'>
                                        <CalendarIcon className='w-4 h-4 text-pink-500' />
                                        <span className='font-medium'>
                                            {selectedDate
                                                ? new Date(selectedDate).toLocaleDateString('en-US', {
                                                      weekday: 'short',
                                                      month: 'short',
                                                      day: 'numeric',
                                                  })
                                                : 'Loading...'}
                                        </span>
                                    </div>
                                    <div className='bg-white rounded-xl px-4 py-2 border border-pink-200 flex items-center gap-2'>
                                        <ClockIcon className='w-4 h-4 text-pink-500' />
                                        <span className='font-medium'>{selectedTime || 'Loading...'}</span>
                                    </div>
                                </div>
                                <p className='text-sm text-gray-500 italic'>{t('bookings.optimalConditions')}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className='flex justify-between mt-12'>
                <motion.button
                    whileHover={{
                        scale: 1.05,
                    }}
                    whileTap={{
                        scale: 0.95,
                    }}
                    onClick={onPrev}
                    className='flex items-center gap-2 px-8 py-4 bg-white border-2 border-pink-200 text-gray-700 rounded-full font-semibold shadow-lg'
                >
                    <ArrowLeftIcon className='w-5 h-5' />
                    {t('common.back')}
                </motion.button>
                <motion.button
                    whileHover={{
                        scale: 1.05,
                    }}
                    whileTap={{
                        scale: 0.95,
                    }}
                    onClick={onNext}
                    disabled={!(selectedDate && selectedTime) && !useAI}
                    className={`flex items-center gap-2 px-8 py-4 rounded-full font-semibold shadow-xl ${
                        (selectedDate && selectedTime) || useAI
                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    {t('common.continue')}
                    <ArrowRightIcon className='w-5 h-5' />
                </motion.button>
            </div>
        </motion.div>
    );
}
