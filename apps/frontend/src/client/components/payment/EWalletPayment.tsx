import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon } from 'lucide-react';
const wallets = [
    {
        id: 'stripe',
        name: 'Stripe Link',
        logo: '💳',
        badge: 'Fastest',
        description: 'Pay with saved payment methods',
    },
    {
        id: 'apple',
        name: 'Apple Pay',
        logo: '',
        badge: 'Recommended',
        description: 'Touch ID or Face ID',
    },
    {
        id: 'google',
        name: 'Google Pay',
        logo: 'G',
        badge: null,
        description: 'Fast & secure',
    },
    {
        id: 'momo',
        name: 'MoMo',
        logo: 'M',
        badge: 'Test',
        description: 'Vietnam e-wallet',
    },
    {
        id: 'zalopay',
        name: 'ZaloPay',
        logo: 'Z',
        badge: 'Test',
        description: 'Vietnam e-wallet',
    },
];

interface EWalletPaymentProps {
    onComplete: (isComplete: boolean) => void;
}

export function EWalletPayment({ onComplete }: EWalletPaymentProps) {
    const [selectedWallet, setSelectedWallet] = useState('stripe');

    // E-wallet is complete once a wallet is selected
    useEffect(() => {
        onComplete(selectedWallet !== '');
    }, [selectedWallet, onComplete]);
    return (
        <div className='space-y-4'>
            {wallets.map((wallet) => (
                <motion.div
                    key={wallet.id}
                    whileHover={{
                        scale: 1.01,
                    }}
                    whileTap={{
                        scale: 0.99,
                    }}
                    onClick={() => setSelectedWallet(wallet.id)}
                    className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedWallet === wallet.id ? 'border-pink-500 bg-pink-50' : 'border-gray-200 bg-white hover:border-pink-200'}`}
                >
                    <div className='flex items-center gap-4'>
                        <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${selectedWallet === wallet.id ? 'bg-gradient-to-br from-pink-400 to-purple-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                        >
                            {wallet.logo}
                        </div>
                        <div className='flex-1'>
                            <div className='flex items-center gap-2 mb-1'>
                                <h4 className='font-semibold text-gray-800'>{wallet.name}</h4>
                                {wallet.badge && (
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${wallet.badge === 'Fastest' ? 'bg-green-100 text-green-700' : wallet.badge === 'Recommended' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                                    >
                                        {wallet.badge}
                                    </span>
                                )}
                            </div>
                            <p className='text-sm text-gray-600'>{wallet.description}</p>
                        </div>
                        {selectedWallet === wallet.id && (
                            <div className='w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center'>
                                <CheckIcon className='w-4 h-4 text-white' />
                            </div>
                        )}
                    </div>
                </motion.div>
            ))}
            {/* Selected Wallet Info */}
            {selectedWallet && (
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 10,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    className='p-4 bg-pink-50 rounded-2xl border border-pink-200'
                >
                    <p className='text-sm text-gray-700'>
                        You will be redirected to{' '}
                        <span className='font-medium'>{wallets.find((w) => w.id === selectedWallet)?.name}</span> to
                        complete your payment securely.
                    </p>
                </motion.div>
            )}
        </div>
    );
}
