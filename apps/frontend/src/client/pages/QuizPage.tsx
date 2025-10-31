import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon, ArrowRightIcon, SparklesIcon, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from '../../utils/toast';
import { analyzeSkin } from '../../services/aiApi';

interface Question {
    id: number;
    questionKey: string;
    optionKeys: string[];
}

// Question structure with translation keys
const questionStructure: Question[] = [
    {
        id: 1,
        questionKey: 'quiz.questions.q1.question',
        optionKeys: ['acne', 'aging', 'pigmentation', 'dryness', 'sensitivity'],
    },
    {
        id: 2,
        questionKey: 'quiz.questions.q2.question',
        optionKeys: ['oily', 'dry', 'combination', 'normal', 'sensitive'],
    },
    {
        id: 3,
        questionKey: 'quiz.questions.q3.question',
        optionKeys: ['daily', 'weekly', 'monthly', 'occasionally', 'rarely'],
    },
    {
        id: 4,
        questionKey: 'quiz.questions.q4.question',
        optionKeys: ['18-25', '26-35', '36-45', '46-55', '55+'],
    },
    {
        id: 5,
        questionKey: 'quiz.questions.q5.question',
        optionKeys: ['clear', 'antiAging', 'brightening', 'hydration', 'overall'],
    },
];

interface SkinAnalysisResult {
    analysisId: string;
    analysis: {
        skinType: string;
        primaryConcern: string;
        riskLevel: string;
    };
    recommendations: Array<{
        serviceId: string;
        serviceName: string;
        reason: string;
        priority: number;
        price: number;
    }>;
    tips: string[];
}

export default function QuizPage() {
    const { t } = useTranslation('common');
    const navigate = useNavigate();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [showResults, setShowResults] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<SkinAnalysisResult | null>(null);

    const currentQ = questionStructure[currentQuestion];

    // Get translated question and options
    const getQuestion = (q: Question) => t(q.questionKey);
    const getOptions = (q: Question, qNum: number) => {
        return q.optionKeys.map((key) => ({
            key,
            text: t(`quiz.questions.q${qNum}.options.${key}`),
        }));
    };

    if (!currentQ && !showResults) {
        // Safety check - reset to first question if index is invalid
        setCurrentQuestion(0);
        return null;
    }

    const handleAnswer = async (option: string) => {
        if (!currentQ) return;

        const newAnswers = { ...answers, [currentQ.id]: option };
        setAnswers(newAnswers);

        if (currentQuestion < questionStructure.length - 1) {
            setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
        } else {
            // Quiz completed - analyze with AI
            setIsAnalyzing(true);
            try {
                const answersArray = questionStructure.map((q) => ({
                    questionId: q.id,
                    question: t(q.questionKey),
                    answer: newAnswers[q.id] || '',
                }));

                const result = await analyzeSkin({ answers: answersArray });
                setAnalysisResult(result);
                setTimeout(() => {
                    setShowResults(true);
                    setIsAnalyzing(false);
                }, 300);
            } catch (error) {
                console.error('Skin analysis failed:', error);
                toast.error(t('quiz.errors.analysisFailed'));
                setIsAnalyzing(false);
                setTimeout(() => setShowResults(true), 300);
            }
        }
    };

    const handleRestart = () => {
        setCurrentQuestion(0);
        setAnswers({});
        setShowResults(false);
        setAnalysisResult(null);
    };

    // Show loading state while AI is analyzing
    if (isAnalyzing) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Loader2 className="w-10 h-10 text-white animate-spin" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('quiz.analyzing')}</h2>
                    <p className="text-gray-600">{t('quiz.analyzingSubtitle')}</p>
                </motion.div>
            </div>
        );
    }

    const handleBookConsultation = () => {
        toast.success('Redirecting to booking page...');
        setTimeout(() => navigate('/booking'), 1000);
    };

    if (showResults) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-20 px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-3xl mx-auto"
                >
                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-12">
                        <div className="flex items-center justify-center mb-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', delay: 0.2 }}
                                className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center"
                            >
                                <SparklesIcon className="w-10 h-10 text-white" />
                            </motion.div>
                        </div>

                        <h2 className="text-4xl font-bold text-center mb-4">
                            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                                {t('quiz.results.title')}
                            </span>
                        </h2>

                        {analysisResult && (
                            <div className="mb-8">
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="bg-pink-50 rounded-xl p-4 text-center">
                                        <p className="text-sm text-gray-600 mb-1">
                                            {t('quiz.results.skinType')}
                                        </p>
                                        <p className="font-bold text-pink-600 capitalize">
                                            {analysisResult.analysis.skinType}
                                        </p>
                                    </div>
                                    <div className="bg-purple-50 rounded-xl p-4 text-center">
                                        <p className="text-sm text-gray-600 mb-1">
                                            {t('quiz.results.primaryConcern')}
                                        </p>
                                        <p className="font-bold text-purple-600 capitalize">
                                            {analysisResult.analysis.primaryConcern}
                                        </p>
                                    </div>
                                    <div className="bg-rose-50 rounded-xl p-4 text-center">
                                        <p className="text-sm text-gray-600 mb-1">
                                            {t('quiz.results.riskLevel')}
                                        </p>
                                        <p className="font-bold text-rose-600 capitalize">
                                            {analysisResult.analysis.riskLevel}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <p className="text-center text-gray-600 mb-8 text-lg">
                            {t('quiz.results.subtitle')}
                        </p>

                        <div className="space-y-4 mb-8">
                            {(
                                analysisResult?.recommendations || [
                                    {
                                        serviceId: 'fallback-1',
                                        serviceName: 'Hydrafacial Treatment',
                                        reason: 'Deep cleansing and hydration',
                                        priority: 1,
                                        price: 150,
                                    },
                                    {
                                        serviceId: 'fallback-2',
                                        serviceName: 'LED Light Therapy',
                                        reason: 'Reduces inflammation',
                                        priority: 2,
                                        price: 120,
                                    },
                                    {
                                        serviceId: 'fallback-3',
                                        serviceName: 'Chemical Peel',
                                        reason: 'Brightening and texture',
                                        priority: 3,
                                        price: 200,
                                    },
                                    {
                                        serviceId: 'fallback-4',
                                        serviceName: 'Customized Serum Therapy',
                                        reason: 'Targeted treatment',
                                        priority: 4,
                                        price: 180,
                                    },
                                ]
                            ).map((recommendation, index) => (
                                <motion.div
                                    key={recommendation.serviceName}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-start gap-3 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => {
                                        if (analysisResult && recommendation.serviceId) {
                                            navigate(`/services/${recommendation.serviceId}`);
                                        }
                                    }}
                                >
                                    <CheckCircleIcon className="w-6 h-6 text-pink-500 flex-shrink-0 mt-1" />
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-800 hover:text-pink-600 transition-colors">
                                            {recommendation.serviceName}
                                        </p>
                                        {analysisResult && (
                                            <>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {recommendation.reason}
                                                </p>
                                                <p className="text-sm text-pink-600 font-medium mt-2">
                                                    {recommendation.price.toLocaleString('vi-VN')}{' '}
                                                    VNĐ
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {analysisResult?.tips && analysisResult.tips.length > 0 && (
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-8">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <SparklesIcon className="w-5 h-5 text-purple-500" />
                                    {t('quiz.results.tips')}
                                </h3>
                                <ul className="space-y-2">
                                    {analysisResult.tips.map((tip, index) => (
                                        <li
                                            key={index}
                                            className="text-sm text-gray-700 flex items-start gap-2"
                                        >
                                            <span className="text-purple-500 font-bold">•</span>
                                            <span>{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4">
                            <motion.button
                                onClick={handleBookConsultation}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold shadow-xl"
                            >
                                {t('quiz.results.bookConsultation')}
                                <ArrowRightIcon className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                                onClick={handleRestart}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex-1 px-8 py-4 bg-white text-gray-700 rounded-full font-semibold border-2 border-pink-200 shadow-lg"
                            >
                                {t('quiz.results.retakeQuiz')}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    const progress = ((currentQuestion + 1) / questionStructure.length) * 100;
    const currentOptions = currentQ ? getOptions(currentQ, currentQ.id) : [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-20 px-6">
            <div className="max-w-3xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">
                            {t('quiz.questionOf', {
                                current: currentQuestion + 1,
                                total: questionStructure.length,
                            })}
                        </span>
                        <span className="text-sm font-medium text-pink-600">
                            {Math.round(progress)}%
                        </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                            className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                        />
                    </div>
                </div>

                {/* Question Card */}
                <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-12"
                >
                    <h2 className="text-3xl font-bold text-gray-800 mb-8">
                        {currentQ && getQuestion(currentQ)}
                    </h2>

                    <div className="space-y-4">
                        {currentOptions.map((option, index) => (
                            <motion.button
                                key={option.key}
                                onClick={() => handleAnswer(option.text)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02, x: 10 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${
                                    answers[currentQ?.id ?? 0] === option.text
                                        ? 'border-pink-500 bg-gradient-to-r from-pink-50 to-purple-50'
                                        : 'border-gray-200 bg-white hover:border-pink-300'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-gray-800">{option.text}</span>
                                    {answers[currentQ?.id ?? 0] === option.text && (
                                        <CheckCircleIcon className="w-6 h-6 text-pink-500" />
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
                        className="mt-6 px-6 py-3 text-gray-600 hover:text-pink-600 font-medium transition-colors"
                    >
                        {t('quiz.previousQuestion')}
                    </motion.button>
                )}
            </div>
        </div>
    );
}
