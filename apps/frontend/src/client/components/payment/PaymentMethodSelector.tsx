import { motion, AnimatePresence } from 'framer-motion';
import { CreditCardIcon, WalletIcon, BuildingIcon, BanknoteIcon } from 'lucide-react';
import { CardPayment } from './CardPayment';
import { EWalletPayment } from './EWalletPayment';
import { BankTransferPayment } from './BankTransferPayment';
import { PayAtClinicPayment } from './PayAtClinicPayment';
import { PromoCodeInput } from './PromoCodeInput';
const paymentMethods = [
    {
        id: 'card',
        label: 'Credit/Debit Card',
        icon: CreditCardIcon,
    },
    {
        id: 'ewallet',
        label: 'E-Wallet',
        icon: WalletIcon,
    },
    {
        id: 'bank',
        label: 'Bank Transfer',
        icon: BuildingIcon,
    },
    {
        id: 'clinic',
        label: 'Pay at Clinic',
        icon: BanknoteIcon,
    },
];

interface PaymentMethodSelectorProps {
    selectedMethod: string;
    setSelectedMethod: (method: string) => void;
    promoCode: string;
    setPromoCode: (code: string) => void;
    appliedPromo: string | null;
    setAppliedPromo: (promo: string | null) => void;
}

export function PaymentMethodSelector({
    selectedMethod,
    setSelectedMethod,
    promoCode,
    setPromoCode,
    appliedPromo,
    setAppliedPromo,
}: PaymentMethodSelectorProps) {
    return (
        <div className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-6'>
            <h3 className='text-xl font-bold text-gray-800 mb-6'>Select Payment Method</h3>
            {/* Method Tabs */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-6'>
                {paymentMethods.map((method) => (
                    <motion.button
                        key={method.id}
                        whileHover={{
                            scale: 1.02,
                        }}
                        whileTap={{
                            scale: 0.98,
                        }}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`relative p-4 rounded-2xl border-2 transition-all ${selectedMethod === method.id ? 'border-pink-500 bg-pink-50' : 'border-gray-200 bg-white hover:border-pink-200'}`}
                    >
                        <method.icon
                            className={`w-6 h-6 mx-auto mb-2 ${selectedMethod === method.id ? 'text-pink-600' : 'text-gray-400'}`}
                        />
                        <span
                            className={`text-sm font-medium ${selectedMethod === method.id ? 'text-pink-600' : 'text-gray-700'}`}
                        >
                            {method.label}
                        </span>
                        {selectedMethod === method.id && (
                            <motion.div
                                layoutId='activeMethod'
                                className='absolute inset-0 border-2 border-pink-500 rounded-2xl'
                                transition={{
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 30,
                                }}
                            />
                        )}
                    </motion.button>
                ))}
            </div>
            {/* Method Content */}
            <AnimatePresence mode='wait'>
                <motion.div
                    key={selectedMethod}
                    initial={{
                        opacity: 0,
                        y: 10,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    exit={{
                        opacity: 0,
                        y: -10,
                    }}
                    transition={{
                        duration: 0.3,
                    }}
                >
                    {selectedMethod === 'card' && <CardPayment />}
                    {selectedMethod === 'ewallet' && <EWalletPayment />}
                    {selectedMethod === 'bank' && <BankTransferPayment />}
                    {selectedMethod === 'clinic' && <PayAtClinicPayment />}
                </motion.div>
            </AnimatePresence>
            {/* Promo Code */}
            <div className='mt-6 pt-6 border-t border-gray-200'>
                <PromoCodeInput
                    promoCode={promoCode}
                    setPromoCode={setPromoCode}
                    appliedPromo={appliedPromo}
                    setAppliedPromo={setAppliedPromo}
                />
            </div>
        </div>
    );
}
