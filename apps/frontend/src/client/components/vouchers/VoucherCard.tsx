import { motion } from 'framer-motion';
import { Copy, CheckCircle2Icon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Voucher } from '../../../api/adapters/voucher';

interface VoucherCardProps {
    voucher: Voucher;
    delay?: number;
}

export default function VoucherCard({ voucher, delay = 0 }: VoucherCardProps) {
    const { t, i18n } = useTranslation('common');
    const [copied, setCopied] = useState(false);

    const handleCopyCode = () => {
        navigator.clipboard.writeText(voucher.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    const discountDisplay =
        voucher.discountType === 'PERCENTAGE'
            ? `${voucher.discountValue}%`
            : `${voucher.discountValue.toLocaleString()} ${t('voucher.currency', 'đ')}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="p-4 border border-amber-200 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-md transition-shadow"
        >
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{voucher.title}</h4>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{voucher.description}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                    <span className="text-amber-600 font-bold text-xl block">
                        {discountDisplay}
                    </span>
                    <span className="text-xs text-gray-600">off</span>
                </div>
            </div>

            {/* Voucher Code */}
            <div className="mb-3 p-3 bg-white rounded-lg border border-amber-100">
                <div className="flex items-center justify-between gap-2">
                    <code className="font-mono text-sm font-bold text-gray-900">
                        {voucher.code}
                    </code>
                    <button
                        onClick={handleCopyCode}
                        className="flex-shrink-0 p-1.5 hover:bg-gray-100 rounded transition-colors"
                        title={t('voucher.copy', 'Copy code')}
                    >
                        {copied ? (
                            <CheckCircle2Icon className="w-4 h-4 text-green-500" />
                        ) : (
                            <Copy className="w-4 h-4 text-gray-600" />
                        )}
                    </button>
                </div>
            </div>

            {/* Footer Info */}
            <div className="flex items-center justify-between text-xs text-gray-600">
                <span>
                    {t('voucher.validUntil')} {formatDate(voucher.validUntil)}
                </span>
                {voucher.usageLimit && (
                    <span className="text-gray-500">
                        {t('voucher.remaining')}: {voucher.usageLimit - voucher.usageCount}
                    </span>
                )}
            </div>
        </motion.div>
    );
}
