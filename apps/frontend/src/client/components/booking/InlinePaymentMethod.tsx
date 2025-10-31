import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCardIcon,
    WalletIcon,
    BuildingIcon,
    BanknoteIcon,
    CheckIcon,
    UploadIcon,
    XIcon,
} from 'lucide-react';

interface InlinePaymentMethodProps {
    selectedMethod: string;
    onSelect: (method: string) => void;
    promoCode: string;
    onPromoChange: (code: string) => void;
    onPaymentDetailsChange?: (isComplete: boolean) => void;
}

const paymentMethods = [
    {
        id: 'vnpay',
        label: 'VNPay',
        icon: CreditCardIcon,
        recommended: true,
        disabled: false,
    },
    {
        id: 'ewallet',
        label: 'E-Wallet',
        icon: WalletIcon,
        recommended: false,
        disabled: true, // Coming soon
    },
    {
        id: 'bank',
        label: 'Transfer',
        icon: BuildingIcon,
        recommended: false,
        disabled: true, // Coming soon
    },
    {
        id: 'clinic',
        label: 'At Clinic',
        icon: BanknoteIcon,
        recommended: false,
        disabled: false,
    },
];
export function InlinePaymentMethod({
    selectedMethod,
    onSelect,
    promoCode,
    onPromoChange,
    onPaymentDetailsChange,
}: InlinePaymentMethodProps) {
    const [showPromo, setShowPromo] = useState(false);
    const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

    // Card payment state
    const [cardData, setCardData] = useState({
        number: '',
        name: '',
        expiry: '',
        cvc: '',
    });

    // E-wallet state
    const [selectedWallet, setSelectedWallet] = useState('stripe');

    // Bank transfer state
    const [uploadedReceipt, setUploadedReceipt] = useState<File | null>(null);

    // Generate reference number once
    const referenceNumber = useMemo(() => {
        return `BEA${Math.floor(100000 + Math.random() * 900000)}`;
    }, []);

    // Check if payment details are complete
    useEffect(() => {
        if (!onPaymentDetailsChange) return;

        let isComplete = false;
        switch (selectedMethod) {
            case 'vnpay':
                isComplete = true; // No details needed, will redirect to VNPay
                break;
            case 'card':
                isComplete =
                    cardData.number.replace(/\s/g, '').length >= 16 &&
                    cardData.name.trim().length > 0 &&
                    cardData.expiry.length === 5 &&
                    cardData.cvc.length >= 3;
                break;
            case 'ewallet':
                isComplete = selectedWallet !== '';
                break;
            case 'bank':
                isComplete = uploadedReceipt !== null;
                break;
            case 'clinic':
                isComplete = true; // No details needed
                break;
        }
        onPaymentDetailsChange(isComplete);
    }, [selectedMethod, cardData, selectedWallet, uploadedReceipt, onPaymentDetailsChange]);

    const handleCardChange = (field: string, value: string) => {
        setCardData({ ...cardData, [field]: value });
    };

    const formatCardNumber = (value: string) => {
        return value
            .replace(/\s/g, '')
            .replace(/(\d{4})/g, '$1 ')
            .trim()
            .substr(0, 19);
    };

    const formatExpiry = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1/$2')
            .substr(0, 5);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedReceipt(file);
        }
    };

    const handleApplyPromo = () => {
        const validCodes = ['BEAUTY10', 'FIRST20', 'SAVE15'];
        if (validCodes.includes(promoCode.toUpperCase())) {
            setAppliedPromo(promoCode.toUpperCase());
        }
    };
    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Method</h3>
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
                className="mb-4 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200/50"
            >
                <p className="text-xs text-gray-700">
                    ✨ <span className="font-medium">Fastest method:</span> VNPay online payment
                </p>
            </motion.div>
            {/* Payment Method Grid */}
            <div className="grid grid-cols-4 gap-2 mb-4">
                {paymentMethods.map((method) => (
                    <motion.button
                        key={method.id}
                        whileHover={{
                            scale: method.disabled ? 1 : 1.05,
                        }}
                        whileTap={{
                            scale: method.disabled ? 1 : 0.95,
                        }}
                        onClick={() => !method.disabled && onSelect(method.id)}
                        disabled={method.disabled}
                        className={`relative p-3 rounded-xl border-2 transition-all ${
                            method.disabled
                                ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                                : selectedMethod === method.id
                                  ? 'border-pink-500 bg-pink-50'
                                  : 'border-gray-200 bg-white'
                        }`}
                    >
                        <method.icon
                            className={`w-5 h-5 mx-auto mb-1 ${
                                method.disabled
                                    ? 'text-gray-300'
                                    : selectedMethod === method.id
                                      ? 'text-pink-600'
                                      : 'text-gray-400'
                            }`}
                        />
                        <p
                            className={`text-xs font-medium ${
                                method.disabled
                                    ? 'text-gray-400'
                                    : selectedMethod === method.id
                                      ? 'text-pink-600'
                                      : 'text-gray-600'
                            }`}
                        >
                            {method.label}
                        </p>
                        {method.recommended && !method.disabled && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full" />
                        )}
                    </motion.button>
                ))}
            </div>
            {/* Payment Method Details */}
            <AnimatePresence mode="wait">
                {/* VNPay Payment */}
                {selectedMethod === 'vnpay' && (
                    <motion.div
                        key="vnpay"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200"
                    >
                        <div className="flex items-start gap-3">
                            <CreditCardIcon className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-800 mb-2">
                                    VNPay Secure Payment
                                </p>
                                <p className="text-xs text-gray-600 mb-2">
                                    You will be redirected to VNPay payment gateway to complete your
                                    transaction.
                                </p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="text-xs bg-white px-2 py-1 rounded-md text-gray-600">
                                        ATM Cards
                                    </span>
                                    <span className="text-xs bg-white px-2 py-1 rounded-md text-gray-600">
                                        Visa/Mastercard
                                    </span>
                                    <span className="text-xs bg-white px-2 py-1 rounded-md text-gray-600">
                                        Internet Banking
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Card Payment Form */}
                {selectedMethod === 'card' && (
                    <motion.div
                        key="card"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 space-y-3"
                    >
                        <input
                            type="text"
                            placeholder="Card Number"
                            value={cardData.number}
                            onChange={(e) =>
                                handleCardChange('number', formatCardNumber(e.target.value))
                            }
                            className="w-full px-4 py-2 text-sm bg-white border-2 border-pink-100 rounded-xl focus:outline-none focus:border-pink-300"
                            maxLength={19}
                        />
                        <input
                            type="text"
                            placeholder="Cardholder Name"
                            value={cardData.name}
                            onChange={(e) => handleCardChange('name', e.target.value)}
                            className="w-full px-4 py-2 text-sm bg-white border-2 border-pink-100 rounded-xl focus:outline-none focus:border-pink-300"
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="MM/YY"
                                value={cardData.expiry}
                                onChange={(e) =>
                                    handleCardChange('expiry', formatExpiry(e.target.value))
                                }
                                className="px-4 py-2 text-sm bg-white border-2 border-pink-100 rounded-xl focus:outline-none focus:border-pink-300"
                                maxLength={5}
                            />
                            <input
                                type="text"
                                placeholder="CVC"
                                value={cardData.cvc}
                                onChange={(e) =>
                                    handleCardChange(
                                        'cvc',
                                        e.target.value.replace(/\D/g, '').substr(0, 4)
                                    )
                                }
                                className="px-4 py-2 text-sm bg-white border-2 border-pink-100 rounded-xl focus:outline-none focus:border-pink-300"
                                maxLength={4}
                            />
                        </div>
                    </motion.div>
                )}

                {/* E-Wallet Selection */}
                {selectedMethod === 'ewallet' && (
                    <motion.div
                        key="ewallet"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 space-y-2"
                    >
                        {['Stripe Link', 'Apple Pay', 'Google Pay', 'MoMo', 'ZaloPay'].map(
                            (wallet) => (
                                <button
                                    key={wallet}
                                    onClick={() =>
                                        setSelectedWallet(wallet.toLowerCase().replace(' ', ''))
                                    }
                                    className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                                        selectedWallet === wallet.toLowerCase().replace(' ', '')
                                            ? 'border-pink-500 bg-pink-50'
                                            : 'border-gray-200 bg-white hover:border-pink-200'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-800">
                                            {wallet}
                                        </span>
                                        {selectedWallet ===
                                            wallet.toLowerCase().replace(' ', '') && (
                                            <CheckIcon className="w-4 h-4 text-pink-600" />
                                        )}
                                    </div>
                                </button>
                            )
                        )}
                    </motion.div>
                )}

                {/* Bank Transfer */}
                {selectedMethod === 'bank' && (
                    <motion.div
                        key="bank"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 space-y-3"
                    >
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                            <p className="text-sm font-medium text-gray-800 mb-2">
                                Transfer Instructions
                            </p>
                            <div className="text-xs text-gray-600 space-y-1">
                                <p>
                                    <span className="font-medium">Bank:</span> BeautyAI Bank
                                </p>
                                <p>
                                    <span className="font-medium">Account:</span> 1234567890
                                </p>
                                <p>
                                    <span className="font-medium">Reference:</span>{' '}
                                    {referenceNumber}
                                </p>
                            </div>
                        </div>

                        {/* Upload Receipt */}
                        {uploadedReceipt ? (
                            <div className="p-3 bg-green-50 rounded-xl border border-green-200 flex items-center gap-3">
                                <CheckIcon className="w-5 h-5 text-green-600" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">
                                        Receipt uploaded
                                    </p>
                                    <p className="text-xs text-gray-600">{uploadedReceipt.name}</p>
                                </div>
                                <button
                                    onClick={() => setUploadedReceipt(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <XIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <label className="block">
                                <div className="p-4 border-2 border-dashed border-pink-300 rounded-xl text-center cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition-all">
                                    <UploadIcon className="w-6 h-6 text-pink-500 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-gray-700">
                                        Upload Receipt
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG or PDF</p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </motion.div>
                )}

                {/* Pay at Clinic - No form needed */}
                {selectedMethod === 'clinic' && (
                    <motion.div
                        key="clinic"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200"
                    >
                        <p className="text-sm text-gray-700">
                            💰 <span className="font-medium">Payment at clinic:</span> You can pay
                            with cash or card when you arrive for your appointment.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Promo Code */}
            <div>
                {!showPromo && !appliedPromo ? (
                    <button
                        onClick={() => setShowPromo(true)}
                        className="text-sm text-pink-600 font-medium hover:underline"
                    >
                        Have a promo code?
                    </button>
                ) : appliedPromo ? (
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200">
                        <CheckIcon className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-800">{appliedPromo}</span>
                        <span className="text-xs text-gray-600">10% discount applied</span>
                        <button
                            onClick={() => {
                                setAppliedPromo(null);
                                onPromoChange('');
                            }}
                            className="ml-auto text-xs text-gray-500 hover:text-gray-700"
                        >
                            Remove
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => onPromoChange(e.target.value.toUpperCase())}
                            placeholder="Enter code"
                            className="flex-1 px-3 py-2 text-sm bg-white border-2 border-pink-100 rounded-xl focus:outline-none focus:border-pink-300"
                        />
                        <motion.button
                            whileHover={{
                                scale: 1.05,
                            }}
                            whileTap={{
                                scale: 0.95,
                            }}
                            onClick={handleApplyPromo}
                            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium rounded-xl"
                        >
                            Apply
                        </motion.button>
                    </div>
                )}
            </div>
        </div>
    );
}
