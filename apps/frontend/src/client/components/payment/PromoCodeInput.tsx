import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { TagIcon, CheckIcon, XIcon } from 'lucide-react';

interface PromoCodeInputProps {
    promoCode: string;
    setPromoCode: (code: string) => void;
    appliedPromo: string | null;
    setAppliedPromo: (promo: string | null) => void;
}

export function PromoCodeInput({
    promoCode,
    setPromoCode,
    appliedPromo,
    setAppliedPromo,
}: PromoCodeInputProps) {
    const { t } = useTranslation('common');
    const [error, setError] = useState('');
    const [isApplying, setIsApplying] = useState(false);
    const handleApply = async () => {
        if (!promoCode.trim()) return;
        setIsApplying(true);
        setError('');
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Mock validation
        const validCodes = ['BEAUTY10', 'FIRST20', 'SAVE15'];
        if (validCodes.includes(promoCode.toUpperCase())) {
            setAppliedPromo(promoCode.toUpperCase());
            setError('');
        } else {
            setError(t('payment.invalidPromoCode'));
            setAppliedPromo(null);
        }
        setIsApplying(false);
    };
    const handleRemove = () => {
        setAppliedPromo(null);
        setPromoCode('');
        setError('');
    };
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('payment.promoCode')}
            </label>
            {appliedPromo ? (
                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.95,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border border-green-200"
                >
                    <div className="flex-1 flex items-center gap-2">
                        <CheckIcon className="w-5 h-5 text-green-600" />
                        <div>
                            <p className="font-medium text-gray-800">{appliedPromo}</p>
                            <p className="text-sm text-gray-600">{t('payment.discountApplied')}</p>
                        </div>
                    </div>
                    <button onClick={handleRemove} className="text-gray-400 hover:text-gray-600">
                        <XIcon className="w-5 h-5" />
                    </button>
                </motion.div>
            ) : (
                <div>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                onKeyPress={(e) => e.key === 'Enter' && handleApply()}
                                placeholder="Enter code"
                                className={`w-full pl-10 pr-4 py-3 bg-white/80 border-2 ${
                                    error ? 'border-red-300' : 'border-pink-100'
                                } rounded-2xl focus:outline-none focus:border-pink-300 transition-colors`}
                            />
                        </div>
                        <motion.button
                            whileHover={{
                                scale: 1.05,
                            }}
                            whileTap={{
                                scale: 0.95,
                            }}
                            onClick={handleApply}
                            disabled={!promoCode.trim() || isApplying}
                            className={`px-6 py-3 rounded-2xl font-medium transition-all ${
                                promoCode.trim() && !isApplying
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {isApplying ? 'Applying...' : 'Apply'}
                        </motion.button>
                    </div>
                    <AnimatePresence>
                        {error && (
                            <motion.p
                                initial={{
                                    opacity: 0,
                                    y: -10,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    y: -10,
                                }}
                                className="mt-2 text-sm text-red-500"
                            >
                                {error}
                            </motion.p>
                        )}
                    </AnimatePresence>
                    <p className="mt-2 text-xs text-gray-500">Try: BEAUTY10, FIRST20, or SAVE15</p>
                </div>
            )}
        </div>
    );
}
