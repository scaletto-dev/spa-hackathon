import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircleIcon, XIcon, SendIcon, SparklesIcon } from 'lucide-react';
export function AIChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            text: "Hello! I'm BeautyAI's virtual assistant. How can I help you today?",
        },
    ]);
    const [input, setInput] = useState('');
    const handleSend = () => {
        if (!input.trim()) return;
        // Add user message
        setMessages([
            {
                type: 'user',
                text: input,
            },
        ]);
        setInput('');
        // Simulate bot response after a delay
        setTimeout(() => {
            setMessages((_prev) => [
                {
                    type: 'bot',
                    text: getBotResponse(input),
                },
            ]);
        }, 1000);
    };
    const getBotResponse = (userInput: string) => {
        const input = userInput.toLowerCase();
        if (input.includes('book') || input.includes('appointment')) {
            return 'I can help you book an appointment! You can visit our booking page or I can assist you with finding the right service. What type of treatment are you interested in?';
        }
        if (input.includes('price') || input.includes('cost') || input.includes('fee')) {
            return 'Our treatment prices vary depending on the service. Facials range from $120 to $250, laser treatments from $150 to $400, and body contouring from $300 to $600. Would you like specific pricing for a particular treatment?';
        }
        if (input.includes('location') || input.includes('where')) {
            return 'We have multiple locations across the city. Our main branches are Downtown, Westside, and Eastside. Would you like details about a specific location?';
        }
        return 'Thanks for your message! For detailed information about our services, pricing, or to book an appointment, you can navigate to the appropriate section of our website or speak with one of our representatives at (555) 123-4567.';
    };
    return (
        <>
            {/* Chat toggle button */}
            <motion.button
                className='fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full shadow-lg flex items-center justify-center z-50'
                whileHover={{
                    scale: 1.1,
                }}
                whileTap={{
                    scale: 0.9,
                }}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? (
                    <XIcon className='w-8 h-8 text-white' />
                ) : (
                    <MessageCircleIcon className='w-8 h-8 text-white' />
                )}
            </motion.button>
            {/* Chat bubble message when closed */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.8,
                            y: 10,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.8,
                            y: 10,
                        }}
                        className='fixed bottom-24 right-6 bg-white rounded-xl p-4 shadow-lg max-w-xs z-40'
                    >
                        <div className='flex items-start gap-3'>
                            <div className='w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center'>
                                <SparklesIcon className='w-6 h-6 text-white' />
                            </div>
                            <div>
                                <p className='text-gray-800'>Need help booking? Ask our AI assistant!</p>
                                <button
                                    className='text-sm text-pink-600 font-medium mt-1'
                                    onClick={() => setIsOpen(true)}
                                >
                                    Start chatting
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Chat window */}
            <AnimatePresence>
                {isOpen && (
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
                            y: 20,
                        }}
                        className='fixed bottom-24 right-6 bg-white rounded-3xl shadow-2xl w-full max-w-md z-40 border border-gray-200 overflow-hidden'
                    >
                        {/* Chat header */}
                        <div className='bg-gradient-to-r from-pink-500 to-purple-500 p-4'>
                            <div className='flex items-center gap-3'>
                                <div className='w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center'>
                                    <SparklesIcon className='w-6 h-6 text-white' />
                                </div>
                                <div>
                                    <h3 className='font-bold text-white'>BeautyAI Assistant</h3>
                                    <p className='text-xs text-white/80'>Online | AI-powered support</p>
                                </div>
                            </div>
                        </div>
                        {/* Chat messages */}
                        <div className='h-96 overflow-y-auto p-4 bg-gray-50'>
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{
                                        opacity: 0,
                                        y: 10,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    transition={{
                                        delay: index * 0.1,
                                    }}
                                    className={`mb-4 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {message.type === 'bot' && (
                                        <div className='w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mr-2 flex-shrink-0'>
                                            <SparklesIcon className='w-5 h-5 text-white' />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.type === 'user' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-white border border-gray-200'}`}
                                    >
                                        <p className={message.type === 'user' ? 'text-white' : 'text-gray-800'}>
                                            {message.text}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        {/* Chat input */}
                        <div className='p-4 border-t border-gray-200'>
                            <div className='flex gap-2'>
                                <input
                                    type='text'
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder='Type your message...'
                                    className='flex-1 px-4 py-2 border-2 border-gray-200 rounded-full focus:outline-none focus:border-pink-300'
                                />
                                <motion.button
                                    whileHover={{
                                        scale: 1.05,
                                    }}
                                    whileTap={{
                                        scale: 0.95,
                                    }}
                                    onClick={handleSend}
                                    className='w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center'
                                >
                                    <SendIcon className='w-5 h-5 text-white' />
                                </motion.button>
                            </div>
                            <p className='text-xs text-gray-500 mt-2 text-center'>Powered by BeautyAI Technology</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
