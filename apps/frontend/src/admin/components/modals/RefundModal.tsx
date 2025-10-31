import React, { useState } from 'react';
import { XIcon, AlertTriangleIcon } from 'lucide-react';
import { toast } from '../../../utils/toast';
import { Input, Select, Textarea, FormField } from '../../../components/ui';

interface RefundModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    transactionId: string;
    originalAmount?: string;
}

export function RefundModal({
    isOpen,
    onClose,
    onConfirm,
    transactionId,
    originalAmount = '$120.00',
}: RefundModalProps) {
    const [formData, setFormData] = useState({
        amount: originalAmount,
        reason: 'Customer request',
        notes: '',
    });

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        // Validation
        if (!formData.amount.trim()) {
            toast.error('Vui lòng nhập số tiền hoàn trả');
            return;
        }

        // Parse amount
        const amountValue = parseFloat(formData.amount.replace(/[^0-9.]/g, ''));
        if (isNaN(amountValue) || amountValue <= 0) {
            toast.error('Số tiền hoàn trả không hợp lệ');
            return;
        }

        // Mock: Simulate refund processing
        console.log(`💰 Mock: Processing refund for transaction ${transactionId}:`, {
            ...formData,
            amountValue,
            timestamp: new Date().toISOString(),
        });

        toast.success(`Đã hoàn trả ${formData.amount} cho giao dịch ${transactionId}! (Mocked)`, {
            duration: 4000,
        });

        // Reset
        setFormData({
            amount: originalAmount,
            reason: 'Customer request',
            notes: '',
        });

        onConfirm?.();
        onClose();
    };

    const reasonOptions = [
        { value: 'Customer request', label: 'Customer request' },
        { value: 'Service issue', label: 'Service issue' },
        { value: 'Scheduling conflict', label: 'Scheduling conflict' },
        { value: 'Other', label: 'Other' },
    ];

    return (
        <>
            <div className='!fixed !inset-0 !m-0 !p-0 bg-black/50 backdrop-blur-sm z-[9999]' onClick={onClose} />
            <div className='!fixed !inset-0 !m-0 !p-0 flex items-center justify-center z-[10000] pointer-events-none'>
                <div className='bg-white backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-4 pointer-events-auto'>
                    {/* Header */}
                    <div className='bg-gradient-to-r from-red-400 to-orange-400 p-6 rounded-t-3xl flex items-center justify-between flex-shrink-0'>
                        <div className='flex items-center gap-3'>
                            <AlertTriangleIcon className='w-6 h-6 text-white' />
                            <h2 className='text-xl font-bold text-white'>Xác nhận hoàn trả</h2>
                        </div>
                        <button onClick={onClose} className='p-1 hover:bg-white/20 rounded-full transition-colors'>
                            <XIcon className='w-6 h-6 text-white' />
                        </button>
                    </div>

                    {/* Content - Scrollable */}
                    <div className='overflow-y-auto flex-1 p-6 space-y-4'>
                        <div className='bg-red-50 rounded-xl p-4 border border-red-100'>
                            <p className='text-sm text-gray-700'>
                                Bạn đang thực hiện hoàn trả cho giao dịch{' '}
                                <span className='font-semibold'>{transactionId}</span>
                            </p>
                        </div>

                        <FormField label='Số tiền hoàn trả' name='amount' required>
                            <Input type='text' name='amount' value={formData.amount} onChange={handleChange} />
                        </FormField>

                        <FormField label='Lý do' name='reason'>
                            <Select
                                name='reason'
                                value={formData.reason}
                                onChange={(value) => setFormData((prev) => ({ ...prev, reason: value }))}
                                options={reasonOptions}
                            />
                        </FormField>

                        <FormField label='Ghi chú thêm' name='notes'>
                            <Textarea
                                name='notes'
                                value={formData.notes}
                                onChange={handleChange}
                                rows={3}
                                placeholder='Cung cấp chi tiết về việc hoàn trả...'
                            />
                        </FormField>

                        <div className='bg-orange-50 rounded-xl p-4 border border-orange-100'>
                            <p className='text-xs text-gray-600'>
                                Hành động này không thể hoàn tác. Khách hàng sẽ nhận thông báo qua email.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className='flex-shrink-0 bg-white/90 backdrop-blur-xl p-6 border-t border-pink-100 rounded-b-3xl flex gap-3'>
                        <button
                            onClick={onClose}
                            className='flex-1 px-4 py-2 rounded-lg border border-pink-200 text-gray-700 hover:bg-pink-50 transition-colors'
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSubmit}
                            className='flex-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all shadow-sm'
                        >
                            Xác nhận hoàn trả
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
