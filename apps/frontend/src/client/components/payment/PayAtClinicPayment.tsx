import { motion } from 'framer-motion';
import { AlertCircleIcon, CheckCircleIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function PayAtClinicPayment() {
    const { t } = useTranslation('common');

    return (
        <div className='space-y-6'>
            {/* Info Card */}
            <motion.div
                initial={{
                    opacity: 0,
                    y: 10,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                className='p-4 bg-blue-50 rounded-2xl border border-blue-200'
            >
                <div className='flex items-start gap-3'>
                    <AlertCircleIcon className='w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5' />
                    <div>
                        <h4 className='font-semibold text-gray-800 mb-1'>{t('payment.payAtClinicPolicy')}</h4>
                        <p className='text-sm text-gray-700'>{t('payment.payAtClinicDesc')}</p>
                    </div>
                </div>
            </motion.div>
            {/* Deposit Policy */}
            <div className='p-4 bg-yellow-50 rounded-2xl border border-yellow-200'>
                <h4 className='font-semibold text-gray-800 mb-3 text-sm'>{t('payment.depositPolicy')}</h4>
                <div className='space-y-2 text-sm text-gray-700'>
                    <div className='flex items-start gap-2'>
                        <CheckCircleIcon className='w-4 h-4 text-green-600 flex-shrink-0 mt-0.5' />
                        <span>{t('payment.noDepositFirstTime')}</span>
                    </div>
                    <div className='flex items-start gap-2'>
                        <CheckCircleIcon className='w-4 h-4 text-green-600 flex-shrink-0 mt-0.5' />
                        <span>{t('payment.depositPremium')}</span>
                    </div>
                    <div className='flex items-start gap-2'>
                        <CheckCircleIcon className='w-4 h-4 text-green-600 flex-shrink-0 mt-0.5' />
                        <span>{t('payment.freeCancellation')}</span>
                    </div>
                </div>
            </div>
            {/* What to Bring */}
            <div className='p-4 bg-gray-50 rounded-2xl border border-gray-200'>
                <h4 className='font-semibold text-gray-800 mb-3 text-sm'>{t('payment.whatToBring')}</h4>
                <ul className='space-y-2 text-sm text-gray-700 list-disc list-inside'>
                    <li>{t('payment.validId')}</li>
                    <li>{t('payment.bookingConfirmation')}</li>
                    <li>{t('payment.paymentMethodCash')}</li>
                    <li>{t('payment.medicalDocs')}</li>
                </ul>
            </div>
            {/* Confirmation Note */}
            <div className='p-4 bg-pink-50 rounded-2xl border border-pink-200'>
                <p className='text-sm text-gray-700'>{t('payment.confirmationNote')}</p>
            </div>
        </div>
    );
}
