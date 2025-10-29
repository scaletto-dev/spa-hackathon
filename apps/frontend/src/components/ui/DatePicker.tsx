import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

export interface DatePickerProps {
    name: string;
    value?: Date | null;
    onChange: (date: Date | null) => void;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    minDate?: Date;
    maxDate?: Date;
    disablePastDates?: boolean;
    quickPicks?: boolean;
    className?: string;
    'data-testid'?: string;
}

export function DatePicker({
    name,
    value,
    onChange,
    placeholder = 'Chọn ngày',
    error,
    disabled,
    minDate,
    maxDate,
    disablePastDates = false,
    quickPicks = true,
    className = '',
    'data-testid': dataTestId,
}: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [viewMonth, setViewMonth] = useState(value || new Date());
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatDate = (date: Date | null): string => {
        if (!date) return '';
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const getDaysInMonth = (date: Date): Date[] => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days: Date[] = [];

        // Add empty slots for days before month starts
        const startPadding = firstDay.getDay();
        for (let i = 0; i < startPadding; i++) {
            days.push(new Date(year, month, -startPadding + i + 1));
        }

        // Add all days in month
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const isDateDisabled = (date: Date): boolean => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);

        if (disablePastDates && checkDate < today) return true;
        if (minDate && checkDate < minDate) return true;
        if (maxDate && checkDate > maxDate) return true;
        return false;
    };

    const handleSelectDate = (date: Date) => {
        if (isDateDisabled(date)) return;
        onChange(date);
        setIsOpen(false);
    };

    const handleQuickPick = (type: 'today' | 'tomorrow' | 'weekend') => {
        const today = new Date();
        let targetDate = new Date();

        switch (type) {
            case 'today':
                targetDate = today;
                break;
            case 'tomorrow':
                targetDate.setDate(today.getDate() + 1);
                break;
            case 'weekend':
                const daysUntilSaturday = (6 - today.getDay() + 7) % 7;
                targetDate.setDate(today.getDate() + (daysUntilSaturday === 0 ? 7 : daysUntilSaturday));
                break;
        }

        onChange(targetDate);
        setIsOpen(false);
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        setViewMonth((prev) => {
            const newDate = new Date(prev);
            if (direction === 'prev') {
                newDate.setMonth(prev.getMonth() - 1);
            } else {
                newDate.setMonth(prev.getMonth() + 1);
            }
            return newDate;
        });
    };

    const days = getDaysInMonth(viewMonth);
    const monthNames = [
        'Tháng 1',
        'Tháng 2',
        'Tháng 3',
        'Tháng 4',
        'Tháng 5',
        'Tháng 6',
        'Tháng 7',
        'Tháng 8',
        'Tháng 9',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12',
    ];
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    const baseClasses = `
    w-full h-11 md:h-12 px-3.5 pr-10
    bg-white
    text-gray-900
    border border-gray-300/80 rounded-xl
    transition-all duration-200
    outline-none
    cursor-pointer
    hover:border-gray-400
    focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30
    disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-50
    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
    ${isOpen ? 'border-pink-500 ring-2 ring-pink-500/30' : ''}
    ${className}
  `;

    return (
        <div ref={containerRef} className='relative'>
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={baseClasses}
                data-testid={dataTestId || name}
            >
                <div className='flex items-center h-full'>
                    <span className={value ? 'text-gray-900' : 'text-gray-400'}>
                        {value ? formatDate(value) : placeholder}
                    </span>
                </div>

                <div className='absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none'>
                    <CalendarIcon className='w-5 h-5 text-gray-400' />
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className='absolute z-50 w-full md:w-auto mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-4'
                    >
                        {quickPicks && (
                            <div className='flex gap-2 mb-4 pb-4 border-b border-gray-100'>
                                <button
                                    type='button'
                                    onClick={() => handleQuickPick('today')}
                                    className='px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors'
                                >
                                    Hôm nay
                                </button>
                                <button
                                    type='button'
                                    onClick={() => handleQuickPick('tomorrow')}
                                    className='px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors'
                                >
                                    Ngày mai
                                </button>
                                <button
                                    type='button'
                                    onClick={() => handleQuickPick('weekend')}
                                    className='px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors'
                                >
                                    Cuối tuần
                                </button>
                            </div>
                        )}

                        <div className='flex items-center justify-between mb-4'>
                            <button
                                type='button'
                                onClick={() => navigateMonth('prev')}
                                className='p-1.5 hover:bg-gray-100 rounded-lg transition-colors'
                            >
                                <ChevronLeftIcon className='w-5 h-5 text-gray-600' />
                            </button>
                            <span className='text-sm font-semibold text-gray-800'>
                                {monthNames[viewMonth.getMonth()]} {viewMonth.getFullYear()}
                            </span>
                            <button
                                type='button'
                                onClick={() => navigateMonth('next')}
                                className='p-1.5 hover:bg-gray-100 rounded-lg transition-colors'
                            >
                                <ChevronRightIcon className='w-5 h-5 text-gray-600' />
                            </button>
                        </div>

                        <div className='grid grid-cols-7 gap-1 mb-2'>
                            {dayNames.map((day) => (
                                <div key={day} className='text-center text-xs font-medium text-gray-500 py-1'>
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className='grid grid-cols-7 gap-1'>
                            {days.map((date, idx) => {
                                const isSelected = value && date.toDateString() === value.toDateString();
                                const isCurrentMonth = date.getMonth() === viewMonth.getMonth();
                                const isToday = date.toDateString() === new Date().toDateString();
                                const disabled = isDateDisabled(date);

                                return (
                                    <button
                                        key={idx}
                                        type='button'
                                        onClick={() => handleSelectDate(date)}
                                        disabled={disabled}
                                        className={`
                      w-9 h-9 text-sm rounded-lg transition-colors
                      ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-900'}
                      ${isSelected ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold' : ''}
                      ${!isSelected && isToday ? 'border-2 border-pink-500 font-semibold' : ''}
                      ${!isSelected && !isToday && isCurrentMonth ? 'hover:bg-gray-100' : ''}
                      ${disabled ? 'opacity-40 cursor-not-allowed hover:bg-transparent' : ''}
                    `}
                                    >
                                        {date.getDate()}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
