import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCardIcon, WalletIcon, BuildingIcon, BanknoteIcon, CheckIcon } from 'lucide-react';

interface InlinePaymentMethodProps {
    selectedMethod: string;
    onSelect: (method: string) => void;
    promoCode: string;
    onPromoChange: (code: string) => void;
}

const paymentMethods = [
    {
        id: 'card',
        label: 'Card',
        icon: CreditCardIcon,
        recommended: false,
    },
    {
        id: 'ewallet',
        label: 'E-Wallet',
        icon: WalletIcon,
        recommended: true,
    },
    {
        id: 'bank',
        label: 'Transfer',
        icon: BuildingIcon,
        recommended: false,
    },
    {
        id: 'clinic',
        label: 'At Clinic',
        icon: BanknoteIcon,
        recommended: false,
    },
];
export function InlinePaymentMethod({ selectedMethod, onSelect, promoCode, onPromoChange }: InlinePaymentMethodProps) {
    const [showPromo, setShowPromo] = useState(false);
    const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
    const handleApplyPromo = () => {
        const validCodes = ['BEAUTY10', 'FIRST20', 'SAVE15'];
        if (validCodes.includes(promoCode.toUpperCase())) {
            setAppliedPromo(promoCode.toUpperCase());
        }
    };
    return (
        <div>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>Payment Method</h3>
            {/* AI Recommendation */}
            <motion.div
                initial={{
                    opacity: 0,
                    y: -5,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                className='mb-4 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200/50'
            >
                <p className='text-xs text-gray-700'>
                    ✨ <span className='font-medium'>Fastest method:</span> e-wallet payment
                </p>
            </motion.div>
            {/* Payment Method Grid */}
            <div className='grid grid-cols-4 gap-2 mb-4'>
                {paymentMethods.map((method) => (
                    <motion.button
                        key={method.id}
                        whileHover={{
                            scale: 1.05,
                        }}
                        whileTap={{
                            scale: 0.95,
                        }}
                        onClick={() => onSelect(method.id)}
                        className={`relative p-3 rounded-xl border-2 transition-all ${selectedMethod === method.id ? 'border-pink-500 bg-pink-50' : 'border-gray-200 bg-white'}`}
                    >
                        <method.icon
                            className={`w-5 h-5 mx-auto mb-1 ${selectedMethod === method.id ? 'text-pink-600' : 'text-gray-400'}`}
                        />
                        <p
                            className={`text-xs font-medium ${selectedMethod === method.id ? 'text-pink-600' : 'text-gray-600'}`}
                        >
                            {method.label}
                        </p>
                        {method.recommended && (
                            <div className='absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full' />
                        )}
                    </motion.button>
                ))}
            </div>
            {/* Bank Transfer Instructions */}
            <AnimatePresence>
                {selectedMethod === 'bank' && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            height: 0,
                        }}
                        animate={{
                            opacity: 1,
                            height: 'auto',
                        }}
                        exit={{
                            opacity: 0,
                            height: 0,
                        }}
                        className='mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200'
                    >
                        <p className='text-sm font-medium text-gray-800 mb-2'>Transfer Instructions</p>
                        <div className='text-xs text-gray-600 space-y-1'>
                            <p>Bank: BeautyAI Bank</p>
                            <p>Account: 1234567890</p>
                            <p>Reference: BEA{Math.floor(100000 + Math.random() * 900000)}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Promo Code */}
            <div>
                {!showPromo && !appliedPromo ? (
                    <button
                        onClick={() => setShowPromo(true)}
                        className='text-sm text-pink-600 font-medium hover:underline'
                    >
                        Have a promo code?
                    </button>
                ) : appliedPromo ? (
                    <div className='flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200'>
                        <CheckIcon className='w-4 h-4 text-green-600' />
                        <span className='text-sm font-medium text-gray-800'>{appliedPromo}</span>
                        <span className='text-xs text-gray-600'>10% discount applied</span>
                        <button
                            onClick={() => {
                                setAppliedPromo(null);
                                onPromoChange('');
                            }}
                            className='ml-auto text-xs text-gray-500 hover:text-gray-700'
                        >
                            Remove
                        </button>
                    </div>
                ) : (
                    <div className='flex gap-2'>
                        <input
                            type='text'
                            value={promoCode}
                            onChange={(e) => onPromoChange(e.target.value.toUpperCase())}
                            placeholder='Enter code'
                            className='flex-1 px-3 py-2 text-sm bg-white border-2 border-pink-100 rounded-xl focus:outline-none focus:border-pink-300'
                        />
                        <motion.button
                            whileHover={{
                                scale: 1.05,
                            }}
                            whileTap={{
                                scale: 0.95,
                            }}
                            onClick={handleApplyPromo}
                            className='px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium rounded-xl'
                        >
                            Apply
                        </motion.button>
                    </div>
                )}
            </div>
        </div>
    );
}
