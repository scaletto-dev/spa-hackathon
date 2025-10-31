import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClockIcon } from 'lucide-react';

export interface TimeSlot {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface TimePickerProps {
    name: string;
    value?: string;
    onChange: (time: string) => void;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    startTime?: string;
    endTime?: string;
    interval?: number;
    disabledSlots?: string[];
    className?: string;
    'data-testid'?: string;
}

export function TimePicker({
    name,
    value,
    onChange,
    placeholder = 'Chọn giờ',
    error,
    disabled,
    startTime = '09:00',
    endTime = '20:00',
    interval = 30,
    disabledSlots = [],
    className = '',
    'data-testid': dataTestId,
}: TimePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const selectedRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && selectedRef.current) {
            selectedRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
    }, [isOpen]);

    const generateTimeSlots = (): TimeSlot[] => {
        const slots: TimeSlot[] = [];
        const startParts = startTime.split(':').map(Number);
        const endParts = endTime.split(':').map(Number);

        const startHour = startParts[0] ?? 0;
        const startMinute = startParts[1] ?? 0;
        const endHour = endParts[0] ?? 23;
        const endMinute = endParts[1] ?? 59;

        let currentHour = startHour;
        let currentMinute = startMinute;

        while (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute)) {
            const timeValue = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
            slots.push({
                value: timeValue,
                label: timeValue,
                disabled: disabledSlots.includes(timeValue),
            });

            currentMinute += interval;
            if (currentMinute >= 60) {
                currentMinute -= 60;
                currentHour += 1;
            }
        }

        return slots;
    };

    const timeSlots = generateTimeSlots();

    const handleSelectTime = (time: string, isDisabled?: boolean) => {
        if (isDisabled) return;
        onChange(time);
        setIsOpen(false);
    };

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
                    <span className={value ? 'text-gray-900' : 'text-gray-400'}>{value || placeholder}</span>
                </div>

                <div className='absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none'>
                    <ClockIcon className='w-5 h-5 text-gray-400' />
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className='absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden'
                        style={{ maxHeight: '280px' }}
                    >
                        <div className='overflow-y-auto' style={{ maxHeight: '280px' }}>
                            {timeSlots.map((slot) => {
                                const isSelected = value === slot.value;

                                return (
                                    <button
                                        key={slot.value}
                                        ref={isSelected ? selectedRef : undefined}
                                        type='button'
                                        onClick={() => handleSelectTime(slot.value, slot.disabled)}
                                        disabled={slot.disabled}
                                        className={`
                      w-full px-4 py-2.5 text-left transition-colors
                      ${isSelected ? 'bg-pink-50 text-pink-700 font-semibold' : 'text-gray-900'}
                      ${
                          slot.disabled
                              ? 'opacity-40 cursor-not-allowed line-through'
                              : 'hover:bg-gray-50 cursor-pointer'
                      }
                    `}
                                    >
                                        {slot.label}
                                        {slot.disabled && <span className='ml-2 text-xs text-red-500'>(Đã đầy)</span>}
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
