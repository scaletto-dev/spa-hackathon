import React from 'react';
import { XIcon, CreditCardIcon, CalendarIcon, UserIcon, PrinterIcon, MailIcon } from 'lucide-react';
import { toast } from '../../../utils/toast';

interface PaymentDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    transactionId: string;
    onRefund?: (transactionId: string) => void;
}

export function PaymentDetailsModal({ isOpen, onClose, transactionId, onRefund }: PaymentDetailsModalProps) {
    if (!isOpen) return null;

    const handlePrintReceipt = () => {
        console.log(`🖨️ Mock: Printing receipt for transaction ${transactionId}`);
        toast.success('Đang in hóa đơn... (Mocked)');
    };

    const handleSendEmail = () => {
        console.log(`📧 Mock: Sending receipt email for transaction ${transactionId}`);
        toast.success('Đã gửi hóa đơn qua email! (Mocked)');
    };

    const handleRefund = () => {
        if (window.confirm('Bạn có chắc chắn muốn hoàn trả giao dịch này?')) {
            console.log(`💰 Mock: Initiating refund for transaction ${transactionId}`);
            onRefund?.(transactionId);
        }
    };
    return (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in'>
            <div className='bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-4'>
                {/* Header */}
                <div className='bg-gradient-to-r from-pink-400 to-purple-400 p-6 rounded-t-3xl flex items-center justify-between flex-shrink-0'>
                    <h2 className='text-xl font-bold text-white'>Chi tiết thanh toán</h2>
                    <button onClick={onClose} className='p-1 hover:bg-white/20 rounded-full transition-colors'>
                        <XIcon className='w-6 h-6 text-white' />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className='overflow-y-auto flex-1 p-6 space-y-4'>
                    <div className='bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100'>
                        <div className='text-center'>
                            <p className='text-sm text-gray-600 mb-1'>Mã giao dịch</p>
                            <p className='text-lg font-bold text-gray-800'>{transactionId}</p>
                        </div>
                    </div>
                    <div className='space-y-3'>
                        <div className='flex items-center gap-3 p-3 bg-pink-50/50 rounded-lg'>
                            <UserIcon className='w-5 h-5 text-pink-500' />
                            <div className='flex-1'>
                                <p className='text-xs text-gray-600'>Khách hàng</p>
                                <p className='text-sm font-medium text-gray-800'>Sarah Johnson</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-3 p-3 bg-pink-50/50 rounded-lg'>
                            <CalendarIcon className='w-5 h-5 text-purple-500' />
                            <div className='flex-1'>
                                <p className='text-xs text-gray-600'>Ngày & Giờ</p>
                                <p className='text-sm font-medium text-gray-800'>15 Tháng 1, 2024 lúc 10:00 AM</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-3 p-3 bg-pink-50/50 rounded-lg'>
                            <CreditCardIcon className='w-5 h-5 text-rose-500' />
                            <div className='flex-1'>
                                <p className='text-xs text-gray-600'>Phương thức thanh toán</p>
                                <p className='text-sm font-medium text-gray-800'>Visa •••• 4242</p>
                            </div>
                        </div>
                    </div>
                    <div className='border-t border-pink-100 pt-4'>
                        <div className='space-y-2'>
                            <div className='flex justify-between'>
                                <span className='text-sm text-gray-600'>Dịch vụ</span>
                                <span className='text-sm font-medium text-gray-800'>Luxury Facial Treatment</span>
                            </div>
                            <div className='flex justify-between'>
                                <span className='text-sm text-gray-600'>Tạm tính</span>
                                <span className='text-sm font-medium text-gray-800'>$120.00</span>
                            </div>
                            <div className='flex justify-between'>
                                <span className='text-sm text-gray-600'>Thuế</span>
                                <span className='text-sm font-medium text-gray-800'>$0.00</span>
                            </div>
                            <div className='flex justify-between pt-2 border-t border-pink-100'>
                                <span className='text-base font-semibold text-gray-800'>Tổng cộng</span>
                                <span className='text-base font-bold text-gray-800'>$120.00</span>
                            </div>
                        </div>
                    </div>

                    {/* Additional Actions */}
                    <div className='grid grid-cols-2 gap-3 pt-2'>
                        <button
                            onClick={handlePrintReceipt}
                            className='px-4 py-2 rounded-lg border border-pink-200 text-gray-700 hover:bg-pink-50 transition-colors flex items-center justify-center gap-2'
                        >
                            <PrinterIcon className='w-4 h-4' />
                            In hóa đơn
                        </button>
                        <button
                            onClick={handleSendEmail}
                            className='px-4 py-2 rounded-lg border border-pink-200 text-gray-700 hover:bg-pink-50 transition-colors flex items-center justify-center gap-2'
                        >
                            <MailIcon className='w-4 h-4' />
                            Gửi Email
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className='flex-shrink-0 p-6 border-t border-pink-100 rounded-b-3xl flex gap-3'>
                    <button
                        onClick={onClose}
                        className='flex-1 px-4 py-2 rounded-lg border border-pink-200 text-gray-700 hover:bg-pink-50 transition-colors'
                    >
                        Đóng
                    </button>
                    <button
                        onClick={handleRefund}
                        className='flex-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all shadow-sm'
                    >
                        Hoàn tiền
                    </button>
                </div>
            </div>
        </div>
    );
}
