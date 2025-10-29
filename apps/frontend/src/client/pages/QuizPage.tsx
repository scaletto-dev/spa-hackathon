import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon, ArrowRightIcon, SparklesIcon } from 'lucide-react';
import { toast } from '../../utils/toast';

interface Question {
    id: number;
    question: string;
    options: string[];
}

const questions: Question[] = [
    {
        id: 1,
        question: 'What is your primary skin concern?',
        options: ['Acne & Breakouts', 'Aging & Wrinkles', 'Pigmentation', 'Dryness', 'Sensitivity'],
    },
    {
        id: 2,
        question: 'What is your skin type?',
        options: ['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive'],
    },
    {
        id: 3,
        question: 'How often do you experience skin issues?',
        options: ['Daily', 'Weekly', 'Monthly', 'Occasionally', 'Rarely'],
    },
    {
        id: 4,
        question: 'What is your age range?',
        options: ['18-25', '26-35', '36-45', '46-55', '55+'],
    },
    {
        id: 5,
        question: 'What are your beauty goals?',
        options: ['Clear Skin', 'Anti-Aging', 'Brightening', 'Hydration', 'Overall Health'],
    },
];

export default function QuizPage() {
    const navigate = useNavigate();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [showResults, setShowResults] = useState(false);

    const handleAnswer = (option: string) => {
        setAnswers({ ...answers, [questions[currentQuestion].id]: option });

        if (currentQuestion < questions.length - 1) {
            setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
        } else {
            setTimeout(() => setShowResults(true), 300);
        }
    };

    const handleRestart = () => {
        setCurrentQuestion(0);
        setAnswers({});
        setShowResults(false);
    };

    const handleBookConsultation = () => {
        toast.success('Redirecting to booking page...');
        setTimeout(() => navigate('/booking'), 1000);
    };

    if (showResults) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-20 px-6'>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className='max-w-3xl mx-auto'
                >
                    <div className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-12'>
                        <div className='flex items-center justify-center mb-8'>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', delay: 0.2 }}
                                className='w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center'
                            >
                                <SparklesIcon className='w-10 h-10 text-white' />
                            </motion.div>
                        </div>

                        <h2 className='text-4xl font-bold text-center mb-4'>
                            <span className='bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent'>
                                Your Personalized Results
                            </span>
                        </h2>

                        <p className='text-center text-gray-600 mb-8 text-lg'>
                            Based on your answers, we recommend the following treatments:
                        </p>

                        <div className='space-y-4 mb-8'>
                            {[
                                'Hydrafacial Treatment',
                                'LED Light Therapy',
                                'Chemical Peel',
                                'Customized Serum Therapy',
                            ].map((treatment, index) => (
                                <motion.div
                                    key={treatment}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className='flex items-center gap-3 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl'
                                >
                                    <CheckCircleIcon className='w-6 h-6 text-pink-500' />
                                    <span className='font-medium text-gray-800'>{treatment}</span>
                                </motion.div>
                            ))}
                        </div>

                        <div className='flex flex-col sm:flex-row gap-4'>
                            <motion.button
                                onClick={handleBookConsultation}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className='flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold shadow-xl'
                            >
                                Book Consultation
                                <ArrowRightIcon className='w-5 h-5' />
                            </motion.button>
                            <motion.button
                                onClick={handleRestart}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className='flex-1 px-8 py-4 bg-white text-gray-700 rounded-full font-semibold border-2 border-pink-200 shadow-lg'
                            >
                                Retake Quiz
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div className='min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-20 px-6'>
            <div className='max-w-3xl mx-auto'>
                {/* Progress Bar */}
                <div className='mb-8'>
                    <div className='flex justify-between items-center mb-2'>
                        <span className='text-sm font-medium text-gray-600'>
                            Question {currentQuestion + 1} of {questions.length}
                        </span>
                        <span className='text-sm font-medium text-pink-600'>{Math.round(progress)}%</span>
                    </div>
                    <div className='h-2 bg-gray-200 rounded-full overflow-hidden'>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                            className='h-full bg-gradient-to-r from-pink-500 to-purple-500'
                        />
                    </div>
                </div>

                {/* Question Card */}
                <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-12'
                >
                    <h2 className='text-3xl font-bold text-gray-800 mb-8'>{questions[currentQuestion].question}</h2>

                    <div className='space-y-4'>
                        {questions[currentQuestion].options.map((option, index) => (
                            <motion.button
                                key={option}
                                onClick={() => handleAnswer(option)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02, x: 10 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${
                                    answers[questions[currentQuestion].id] === option
                                        ? 'border-pink-500 bg-gradient-to-r from-pink-50 to-purple-50'
                                        : 'border-gray-200 bg-white hover:border-pink-300'
                                }`}
                            >
                                <div className='flex items-center justify-between'>
                                    <span className='font-medium text-gray-800'>{option}</span>
                                    {answers[questions[currentQuestion].id] === option && (
                                        <CheckCircleIcon className='w-6 h-6 text-pink-500' />
                                    )}
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Navigation */}
                {currentQuestion > 0 && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setCurrentQuestion(currentQuestion - 1)}
                        className='mt-6 px-6 py-3 text-gray-600 hover:text-pink-600 font-medium transition-colors'
                    >
                        ← Previous Question
                    </motion.button>
                )}
            </div>
        </div>
    );
}
