/**
 * AI Time Slot Selector Component
 * Allows users to let AI choose the best time slot
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Clock, TrendingUp, Loader } from 'lucide-react';
import { suggestTimeSlot, TimeSlotSuggestion } from '../../../services/aiApi';

interface AITimeSlotSelectorProps {
    date: string;
    branchId: string;
    serviceIds?: string[];
    onTimeSlotSelected: (timeSlot: string) => void;
    currentTimeSlot?: string;
}

export const AITimeSlotSelector: React.FC<AITimeSlotSelectorProps> = ({
    date,
    branchId,
    serviceIds,
    onTimeSlotSelected,
    currentTimeSlot,
}) => {
    const [isAIEnabled, setIsAIEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<TimeSlotSuggestion[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleAIToggle = async (enabled: boolean) => {
        setIsAIEnabled(enabled);

        if (enabled && !suggestions.length) {
            await fetchAISuggestions();
        }
    };

    const fetchAISuggestions = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await suggestTimeSlot({
                date,
                branchId,
                ...(serviceIds && { serviceIds }),
            });

            if (response.suggestedSlots.length > 0) {
                setSuggestions(response.suggestedSlots);
                // Auto-select the best slot
                if (response.bestSlot) {
                    onTimeSlotSelected(response.bestSlot);
                }
            } else {
                setError(response.message || 'Không tìm thấy khung giờ phù hợp');
            }
        } catch (err) {
            console.error('AI time slot suggestion error:', err);
            setError('Không thể lấy gợi ý từ AI. Vui lòng chọn giờ thủ công.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='space-y-4'>
            {/* AI Toggle */}
            <div className='flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-700'>
                <input
                    type='checkbox'
                    id='ai-time-slot'
                    checked={isAIEnabled}
                    onChange={(e) => handleAIToggle(e.target.checked)}
                    className='w-5 h-5 text-purple-600 bg-white border-purple-300 rounded focus:ring-purple-500 focus:ring-2'
                />
                <label htmlFor='ai-time-slot' className='flex items-center gap-2 cursor-pointer flex-1'>
                    <Sparkles className='w-5 h-5 text-purple-600' />
                    <span className='font-medium text-gray-900 dark:text-white'>Để AI chọn giờ tốt nhất cho bạn</span>
                </label>
            </div>

            {/* Loading State */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className='flex items-center justify-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'
                    >
                        <Loader className='w-5 h-5 text-purple-600 animate-spin' />
                        <span className='text-gray-600 dark:text-gray-300'>AI đang phân tích khung giờ tối ưu...</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error State */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className='p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700'
                    >
                        <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* AI Suggestions */}
            <AnimatePresence>
                {isAIEnabled && suggestions.length > 0 && !isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className='space-y-3'
                    >
                        <div className='flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400'>
                            <TrendingUp className='w-4 h-4' />
                            <span>Gợi ý từ AI (theo thứ tự ưu tiên)</span>
                        </div>

                        {suggestions.map((suggestion, index) => (
                            <motion.button
                                key={suggestion.time}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => onTimeSlotSelected(suggestion.time)}
                                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                                    currentTimeSlot === suggestion.time
                                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 bg-white dark:bg-gray-800'
                                }`}
                            >
                                <div className='flex items-start justify-between gap-3'>
                                    <div className='flex-1'>
                                        <div className='flex items-center gap-2 mb-1'>
                                            <Clock className='w-4 h-4 text-purple-600' />
                                            <span className='font-semibold text-gray-900 dark:text-white'>
                                                {suggestion.time}
                                            </span>
                                            {index === 0 && (
                                                <span className='px-2 py-0.5 text-xs font-medium text-purple-700 bg-purple-100 dark:bg-purple-900/50 dark:text-purple-300 rounded-full'>
                                                    Tốt nhất
                                                </span>
                                            )}
                                        </div>
                                        <p className='text-sm text-gray-600 dark:text-gray-400'>{suggestion.reason}</p>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <Sparkles className='w-4 h-4 text-yellow-500' />
                                        <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                                            {Math.round(suggestion.score * 100)}%
                                        </span>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
