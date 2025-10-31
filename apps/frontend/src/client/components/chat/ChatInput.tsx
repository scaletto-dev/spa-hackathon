/**
 * ChatInput - Reusable chat input component
 */
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SendIcon, Trash2Icon } from 'lucide-react';

interface ChatInputProps {
    onSend: (text: string) => void;
    onClear?: () => void;
    placeholder?: string;
    disabled?: boolean;
    hideOptions?: boolean;
}

export function ChatInput({
    onSend,
    onClear,
    placeholder = 'Type your message...',
    disabled = false,
    hideOptions = false,
}: ChatInputProps) {
    const [input, setInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSend = () => {
        if (!input.trim() || disabled) return;
        onSend(input);
        setInput('');
    };

    return (
        <div className='p-3 border-t border-gray-200 bg-white'>
            <div className='flex gap-2'>
                {onClear && !hideOptions && (
                    <button
                        onClick={onClear}
                        className='w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-gray-300 transition-colors'
                        title='Clear chat'
                        aria-label='Clear chat'
                    >
                        <Trash2Icon className='w-4 h-4 text-gray-600' />
                    </button>
                )}
                <input
                    ref={inputRef}
                    type='text'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={placeholder}
                    disabled={disabled}
                    className='flex-1 px-3 py-2 text-sm border-2 border-gray-200 rounded-full focus:outline-none focus:border-pink-300 disabled:bg-gray-100 disabled:cursor-not-allowed'
                    data-testid='chat-input'
                />
                <motion.button
                    whileHover={{ scale: disabled ? 1 : 1.05 }}
                    whileTap={{ scale: disabled ? 1 : 0.95 }}
                    onClick={handleSend}
                    disabled={disabled}
                    className='w-9 h-9 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed'
                    data-testid='chat-send-button'
                    aria-label='Send message'
                >
                    <SendIcon className='w-4 h-4 text-white' />
                </motion.button>
            </div>
        </div>
    );
}
