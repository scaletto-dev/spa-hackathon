import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon, RefreshCwIcon, XIcon, Loader2Icon } from 'lucide-react';
import { AISuggestion } from '../types';
import * as supportApi from '../../services/supportApi';
import { toast } from '../../utils/toast';

interface AIHintPanelProps {
    conversationId: string;
    onSelectSuggestion: (content: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

export function AIHintPanel({
    conversationId,
    onSelectSuggestion,
    isOpen,
    onClose,
}: AIHintPanelProps) {
    const { t, i18n } = useTranslation();
    const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && conversationId) {
            loadSuggestions();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversationId, isOpen]);

    const loadSuggestions = async () => {
        setIsLoading(true);
        try {
            // Pass current language to ensure consistent responses
            const language = i18n.language === 'vi' ? 'Vietnamese' : 'English';
            const data = await supportApi.getAISuggestions(conversationId, language);
            setSuggestions(data);
        } catch (error) {
            console.error('Failed to load AI suggestions:', error);
            toast.error(t('support.ai.failedToLoad'));
            // Set empty array on error
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 300, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="w-full md:w-80 lg:w-96 h-full bg-white/80 backdrop-blur-xl border-l border-gray-200/50 flex flex-col shadow-2xl fixed md:relative right-0 z-50"
                >
                    {/* Header - Enhanced */}
                    <div className="p-4 border-b border-gray-200/50 bg-gradient-to-r from-pink-50/80 via-purple-50/80 to-pink-50/80 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 3 }}
                                    className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-500/30"
                                >
                                    <SparklesIcon className="w-5 h-5 text-white" />
                                </motion.div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-sm">
                                        {t('support.ai.title')}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {t('support.ai.subtitle')}
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                onClick={onClose}
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 hover:bg-white/50 rounded-xl transition-colors"
                            >
                                <XIcon className="w-5 h-5 text-gray-600" />
                            </motion.button>
                        </div>
                    </div>

                    {/* Content - Improved */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                        {isLoading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-12"
                            >
                                <div className="relative">
                                    <Loader2Icon className="w-10 h-10 text-pink-500 animate-spin mb-3" />
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                        className="absolute inset-0 w-10 h-10 bg-pink-500/20 rounded-full blur-lg"
                                    />
                                </div>
                                <p className="text-sm text-gray-600 font-medium">
                                    {t('support.ai.loading')}
                                </p>
                            </motion.div>
                        ) : suggestions.length > 0 ? (
                            <>
                                {suggestions.map((suggestion, index) => (
                                    <motion.div
                                        key={suggestion.id}
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.03, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => onSelectSuggestion(suggestion.content)}
                                        className="p-4 bg-gradient-to-br from-white via-white to-pink-50/30 rounded-2xl border border-gray-200/70 cursor-pointer hover:border-pink-300 hover:shadow-lg transition-all group backdrop-blur-sm"
                                    >
                                        <div className="flex items-start justify-between gap-2 mb-2.5">
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-800 group-hover:text-gray-900 leading-relaxed">
                                                    {suggestion.content}
                                                </p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <motion.div
                                                    whileHover={{ scale: 1.1 }}
                                                    className="flex items-center gap-1.5 px-2 py-1 bg-white/80 backdrop-blur-sm rounded-lg text-xs font-medium border border-gray-200/50 shadow-sm"
                                                >
                                                    <motion.div
                                                        animate={{ scale: [1, 1.2, 1] }}
                                                        transition={{
                                                            repeat: Infinity,
                                                            duration: 2,
                                                        }}
                                                        className={`w-2 h-2 rounded-full shadow-sm ${
                                                            suggestion.confidence > 0.9
                                                                ? 'bg-green-500 shadow-green-500/50'
                                                                : suggestion.confidence > 0.8
                                                                  ? 'bg-yellow-500 shadow-yellow-500/50'
                                                                  : 'bg-orange-500 shadow-orange-500/50'
                                                        }`}
                                                    />
                                                    <span className="text-gray-700">
                                                        {Math.round(suggestion.confidence * 100)}%
                                                    </span>
                                                </motion.div>
                                            </div>
                                        </div>
                                        {suggestion.reasoning && (
                                            <div className="flex items-start gap-1.5 mt-2 pt-2 border-t border-gray-100">
                                                <SparklesIcon className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0" />
                                                <p className="text-xs text-gray-500 italic leading-relaxed">
                                                    {suggestion.reasoning}
                                                </p>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-12 text-center px-4"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
                                    <SparklesIcon className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-sm text-gray-600 font-medium mb-1">
                                    {t('support.ai.noSuggestions')}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {t('support.ai.noSuggestionsDesc')}
                                </p>
                            </motion.div>
                        )}
                    </div>

                    {/* Footer - Enhanced */}
                    <div className="p-4 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/80 to-pink-50/80 backdrop-blur-sm">
                        <motion.button
                            onClick={loadSuggestions}
                            disabled={isLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 text-white rounded-xl hover:shadow-lg shadow-pink-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium text-sm"
                        >
                            <RefreshCwIcon
                                className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
                            />
                            {t('support.ai.refresh')}
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
