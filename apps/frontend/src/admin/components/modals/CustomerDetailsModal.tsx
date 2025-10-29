import React, { useState } from 'react';
import { XIcon, Edit3Icon, TrashIcon, CalendarIcon, DollarSignIcon } from 'lucide-react';
import { toast } from '../../../utils/toast';
import { Input, Select, Textarea, FormField } from '../../../components/ui';

interface CustomerDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    customerId: number | null;
    mode: 'view' | 'edit';
    onUpdate?: () => void;
    onDelete?: () => void;
}

export function CustomerDetailsModal({
    isOpen,
    onClose,
    customerId,
    mode,
    onUpdate,
    onDelete,
}: CustomerDetailsModalProps) {
    const [isEditing, setIsEditing] = useState(mode === 'edit');
    const [formData, setFormData] = useState({
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '(555) 123-4567',
        membershipTier: 'VIP',
        notes: 'Prefers Emma Wilson for facials. Allergic to lavender products.',
    });

    if (!isOpen || !customerId) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value: string) => {
        setFormData((prev) => ({ ...prev, membershipTier: value }));
    };

    const handleSave = () => {
        // Validation
        if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        // Mock: Update customer
        console.log(`✏️ Mock: Updated customer #${customerId}:`, formData);
        toast.success('Đã cập nhật thông tin khách hàng! (Mocked)');

        setIsEditing(false);
        onUpdate?.();
    };

    const handleDelete = () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa khách hàng này? Hành động này không thể hoàn tác.')) {
            console.log(`🗑️ Mock: Deleted customer #${customerId}`);
            toast.success('Đã xóa khách hàng! (Mocked)');
            onDelete?.();
            onClose();
        }
    };

    const tierOptions = [
        { value: 'New', label: 'New' },
        { value: 'Silver', label: 'Silver' },
        { value: 'Gold', label: 'Gold' },
        { value: 'VIP', label: 'VIP' },
    ];

    return (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in'>
            <div className='bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-4'>
                {/* Header - Sticky */}
                <div className='bg-gradient-to-r from-pink-400 to-purple-400 p-6 rounded-t-3xl flex items-center justify-between flex-shrink-0'>
                    <h2 className='text-xl font-bold text-white'>
                        {isEditing ? 'Chỉnh sửa khách hàng' : 'Chi tiết khách hàng'}
                    </h2>
                    <button onClick={onClose} className='p-1 hover:bg-white/20 rounded-full transition-colors'>
                        <XIcon className='w-6 h-6 text-white' />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className='overflow-y-auto flex-1 p-6 space-y-6'>
                    <div className='flex items-center gap-6'>
                        <img
                            src='https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
                            alt='Customer'
                            className='w-20 h-20 rounded-full border-4 border-pink-200'
                        />
                        <div className='flex-1'>
                            {isEditing ? (
                                <Input
                                    name='name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    className='font-semibold text-lg'
                                />
                            ) : (
                                <h3 className='text-2xl font-bold text-gray-800'>{formData.name}</h3>
                            )}
                            <div className='flex items-center gap-2 mt-2'>
                                <span className='px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white'>
                                    {formData.membershipTier} Member
                                </span>
                                <span className='text-sm text-gray-600'>Since Jan 2023</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className='grid grid-cols-3 gap-4'>
                        <div className='bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-4 border border-pink-100'>
                            <div className='flex items-center gap-2 mb-1'>
                                <CalendarIcon className='w-4 h-4 text-pink-500' />
                                <p className='text-xs text-gray-600'>Tổng đặt lịch</p>
                            </div>
                            <p className='text-2xl font-bold text-gray-800'>24</p>
                        </div>
                        <div className='bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-4 border border-pink-100'>
                            <div className='flex items-center gap-2 mb-1'>
                                <DollarSignIcon className='w-4 h-4 text-purple-500' />
                                <p className='text-xs text-gray-600'>Tổng chi tiêu</p>
                            </div>
                            <p className='text-2xl font-bold text-gray-800'>$2,880</p>
                        </div>
                        <div className='bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-4 border border-pink-100'>
                            <div className='flex items-center gap-2 mb-1'>
                                <p className='text-xs text-gray-600'>Giữ chân</p>
                            </div>
                            <p className='text-2xl font-bold text-green-600'>95%</p>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className='space-y-4'>
                        <FormField label='Email' name='email' required>
                            <Input
                                type='email'
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </FormField>

                        <FormField label='Số điện thoại' name='phone' required>
                            <Input
                                type='tel'
                                name='phone'
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </FormField>

                        <FormField label='Hạng thành viên' name='membershipTier'>
                            <Select
                                name='membershipTier'
                                value={formData.membershipTier}
                                onChange={handleSelectChange}
                                options={tierOptions}
                                disabled={!isEditing}
                            />
                        </FormField>

                        <FormField label='Ghi chú' name='notes'>
                            <Textarea
                                name='notes'
                                value={formData.notes}
                                onChange={handleChange}
                                rows={3}
                                disabled={!isEditing}
                            />
                        </FormField>
                    </div>
                </div>

                {/* Footer - Sticky */}
                <div className='flex-shrink-0 bg-white/90 backdrop-blur-xl p-6 border-t border-pink-100 rounded-b-3xl flex gap-3'>
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    // Reset form data if needed
                                }}
                                className='flex-1 px-4 py-2 rounded-lg border border-pink-200 text-gray-700 hover:bg-pink-50 transition-colors'
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSave}
                                className='flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm'
                            >
                                Lưu thay đổi
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className='flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm flex items-center justify-center gap-2'
                            >
                                <Edit3Icon className='w-4 h-4' />
                                Sửa thông tin
                            </button>
                            <button
                                onClick={handleDelete}
                                className='px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all shadow-sm flex items-center gap-2'
                            >
                                <TrashIcon className='w-4 h-4' />
                                Xóa
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
