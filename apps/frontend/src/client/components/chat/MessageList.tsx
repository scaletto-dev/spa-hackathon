/**
 * MessageList - Reusable message display component
 */
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, UserIcon, CalendarIcon, ClockIcon, MapPinIcon } from 'lucide-react';
import { Message, MessageAction, BookingData } from './types';
import { formatPrice } from '../../../utils/format';

interface MessageListProps {
    messages: Message[];
    onAction?: (action: MessageAction) => void;
    onBookSlot?: (slot: BookingData['slots'][0], serviceName: string, serviceId?: string) => void;
}

export function MessageList({ messages, onAction, onBookSlot }: MessageListProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest',
            });
        }, 100);
    }, [messages]);

    return (
        <div className="overflow-y-auto p-4 bg-gray-50 space-y-3 flex-1">
            {messages.map((message, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    {/* Avatar for bot/agent/system */}
                    {message.type !== 'user' && (
                        <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center mr-2 flex-shrink-0 ${
                                message.type === 'agent'
                                    ? 'bg-blue-500'
                                    : message.type === 'system'
                                      ? 'bg-gray-400'
                                      : 'bg-gradient-to-br from-pink-400 to-purple-500'
                            }`}
                        >
                            {message.type === 'agent' ? (
                                <UserIcon className="w-4 h-4 text-white" />
                            ) : (
                                <SparklesIcon className="w-4 h-4 text-white" />
                            )}
                        </div>
                    )}

                    {/* Message container */}
                    <div className="max-w-[75%] space-y-2">
                        {/* Message bubble */}
                        <div
                            className={`rounded-2xl px-4 py-2.5 ${
                                message.type === 'user'
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white ml-auto'
                                    : message.type === 'system'
                                      ? 'bg-gray-200 text-gray-700 text-sm text-center italic'
                                      : 'bg-white border border-gray-200 text-gray-800'
                            }`}
                        >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {message.text}
                            </p>
                        </div>

                        {/* Action buttons */}
                        {message.actions && message.actions.length > 0 && (
                            <div className="space-y-2 w-full">
                                {message.actions.map((action, i) => (
                                    <button
                                        key={i}
                                        onClick={() => onAction?.(action)}
                                        className={`w-full px-4 py-3 text-sm font-medium rounded-xl transition-all text-left ${
                                            action.type === 'confirm_booking'
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-md hover:shadow-lg'
                                                : 'bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 text-gray-800 hover:from-pink-100 hover:to-purple-100 hover:border-pink-300 hover:shadow-md'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="flex-1">{action.label}</span>
                                            <svg
                                                className="w-4 h-4 opacity-50"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Booking slots */}
                        {message.bookingData && (
                            <div className="bg-white rounded-xl border border-gray-200 p-3 space-y-2">
                                <p className="text-xs font-semibold text-gray-700 mb-2">
                                    {message.bookingData.serviceName}
                                </p>
                                <div className="space-y-2">
                                    {message.bookingData.slots.map((slot, i) => (
                                        <button
                                            key={i}
                                            onClick={() =>
                                                onBookSlot?.(
                                                    slot,
                                                    message.bookingData!.serviceName,
                                                    message.bookingData!.serviceId
                                                )
                                            }
                                            className="w-full p-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg hover:from-green-100 hover:to-emerald-100 transition-all text-left"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 flex-1">
                                                    <CalendarIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <ClockIcon className="w-3 h-3 text-gray-500" />
                                                            <p className="text-xs font-medium text-gray-800">
                                                                {new Date(
                                                                    slot.datetime
                                                                ).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                })}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <MapPinIcon className="w-3 h-3 text-gray-500" />
                                                            <p className="text-xs text-gray-600">
                                                                {slot.branchName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-xs font-bold text-green-600 flex-shrink-0 ml-2">
                                                    {formatPrice(slot.price)}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            ))}
            <div ref={messagesEndRef} className="h-4" />
        </div>
    );
}
