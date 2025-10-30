import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadIcon, XIcon, CheckIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BankTransferPaymentProps {
    onComplete: (isComplete: boolean) => void;
}

export function BankTransferPayment({ onComplete }: BankTransferPaymentProps) {
    const { t } = useTranslation('common');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    // Generate reference number once and keep it stable
    const referenceNumber = useMemo(() => {
        return `BEA${Math.floor(100000 + Math.random() * 900000)}`;
    }, []);

    // Bank transfer is complete once a receipt is uploaded
    useEffect(() => {
        onComplete(uploadedFile !== null);
    }, [uploadedFile, onComplete]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile(file);
            setShowUploadModal(false);
        }
    };
    return (
        <div className='space-y-6'>
            {/* Bank Details */}
            <div className='p-4 bg-gray-50 rounded-2xl border border-gray-200'>
                <h4 className='font-semibold text-gray-800 mb-3'>{t('payment.bankTransferInstructions')}</h4>
                <div className='space-y-2 text-sm text-gray-700'>
                    <div className='flex justify-between'>
                        <span className='text-gray-600'>{t('payment.bankName')}</span>
                        <span className='font-medium'>BeautyAI Bank</span>
                    </div>
                    <div className='flex justify-between'>
                        <span className='text-gray-600'>{t('payment.accountName')}</span>
                        <span className='font-medium'>BeautyAI Clinic Ltd.</span>
                    </div>
                    <div className='flex justify-between'>
                        <span className='text-gray-600'>{t('payment.accountNumber')}</span>
                        <span className='font-medium'>1234567890</span>
                    </div>
                    <div className='flex justify-between'>
                        <span className='text-gray-600'>{t('payment.reference')}</span>
                        <span className='font-medium text-pink-600'>{referenceNumber}</span>
                    </div>
                </div>
            </div>
            {/* Important Notes */}
            <div className='p-4 bg-yellow-50 rounded-2xl border border-yellow-200'>
                <h4 className='font-semibold text-gray-800 mb-2 text-sm'>{t('payment.importantNotes')}</h4>
                <ul className='space-y-1 text-sm text-gray-700 list-disc list-inside'>
                    <li>{t('payment.includeReference')}</li>
                    <li>{t('payment.uploadReceipt')}</li>
                    <li>{t('payment.confirmAfterVerify')}</li>
                    <li>{t('payment.verificationTime')}</li>
                </ul>
            </div>
            {/* Upload Receipt */}
            {uploadedFile ? (
                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.95,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    className='p-4 bg-green-50 rounded-2xl border border-green-200'
                >
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-green-500 rounded-full flex items-center justify-center'>
                            <CheckIcon className='w-6 h-6 text-white' />
                        </div>
                        <div className='flex-1'>
                            <p className='font-medium text-gray-800'>{t('payment.receiptUploaded')}</p>
                            <p className='text-sm text-gray-600'>{uploadedFile.name}</p>
                        </div>
                        <button onClick={() => setUploadedFile(null)} className='text-gray-400 hover:text-gray-600'>
                            <XIcon className='w-5 h-5' />
                        </button>
                    </div>
                </motion.div>
            ) : (
                <motion.button
                    whileHover={{
                        scale: 1.02,
                    }}
                    whileTap={{
                        scale: 0.98,
                    }}
                    onClick={() => setShowUploadModal(true)}
                    className='w-full p-6 border-2 border-dashed border-pink-300 rounded-2xl hover:border-pink-400 hover:bg-pink-50 transition-all'
                >
                    <UploadIcon className='w-8 h-8 text-pink-500 mx-auto mb-2' />
                    <p className='text-gray-700 font-medium'>{t('payment.uploadButton')}</p>
                    <p className='text-sm text-gray-500 mt-1'>{t('payment.supportedFormats')}</p>
                </motion.button>
            )}
            {/* Upload Modal */}
            <AnimatePresence>
                {showUploadModal && (
                    <motion.div
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'
                        onClick={() => setShowUploadModal(false)}
                    >
                        <motion.div
                            initial={{
                                scale: 0.9,
                                opacity: 0,
                            }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                            }}
                            exit={{
                                scale: 0.9,
                                opacity: 0,
                            }}
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                            className='bg-white rounded-3xl p-6 max-w-md w-full'
                        >
                            <div className='flex justify-between items-center mb-6'>
                                <h3 className='text-xl font-bold text-gray-800'>{t('payment.uploadTitle')}</h3>
                                <button
                                    onClick={() => setShowUploadModal(false)}
                                    className='text-gray-400 hover:text-gray-600'
                                >
                                    <XIcon className='w-6 h-6' />
                                </button>
                            </div>
                            <label className='block'>
                                <div className='border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition-all'>
                                    <UploadIcon className='w-12 h-12 text-gray-400 mx-auto mb-3' />
                                    <p className='text-gray-700 font-medium mb-1'>{t('payment.dragDrop')}</p>
                                    <p className='text-sm text-gray-500'>{t('payment.supportedFormats')}</p>
                                </div>
                                <input
                                    type='file'
                                    accept='image/*,.pdf'
                                    onChange={handleFileUpload}
                                    className='hidden'
                                />
                            </label>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
