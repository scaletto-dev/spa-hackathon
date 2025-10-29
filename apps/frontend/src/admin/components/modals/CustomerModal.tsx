import React, { useState } from 'react';
import { XIcon } from 'lucide-react';
import { toast } from '../../../utils/toast';
import { useCustomers } from '../../../hooks/useStore';
import { Input, Select, Textarea, FormField } from '../../../components/ui';

interface CustomerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CustomerModal({ isOpen, onClose }: CustomerModalProps) {
    const { addCustomer } = useCustomers();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        membershipTier: 'New',
        notes: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        // Validation
        if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        // Email validation
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            toast.error('Email không hợp lệ');
            return;
        }

        // Add to store
        addCustomer({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            membershipTier: formData.membershipTier as 'New' | 'Silver' | 'Gold' | 'VIP',
            totalSpent: 0,
            visits: 0,
            lastVisit: new Date().toISOString(),
            notes: formData.notes,
        });

        toast.success('Khách hàng đã được thêm thành công! (Mocked)');

        // Reset form
        setFormData({
            name: '',
            email: '',
            phone: '',
            membershipTier: 'New',
            notes: '',
        });

        onClose();
    };

    const tierOptions = [
        { value: 'New', label: 'Mới' },
        { value: 'Silver', label: 'Bạc' },
        { value: 'Gold', label: 'Vàng' },
        { value: 'VIP', label: 'VIP' },
    ];

    if (!isOpen) return null;
    return (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col animate-in fade-in slide-in-from-bottom-4'>
                {/* Header */}
                <div className='bg-gradient-to-r from-pink-400 to-purple-400 p-6 rounded-t-3xl flex items-center justify-between flex-shrink-0'>
                    <h2 className='text-xl font-bold text-white'>Thêm khách hàng mới</h2>
                    <button onClick={onClose} className='p-1 hover:bg-white/20 rounded-full transition-colors'>
                        <XIcon className='w-6 h-6 text-white' />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className='overflow-y-auto flex-1 p-6 space-y-4'>
                    <FormField label='Họ và tên' name='name' required>
                        <Input
                            type='text'
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                            placeholder='Nhập tên khách hàng'
                        />
                    </FormField>

                    <FormField label='Địa chỉ Email' name='email' required>
                        <Input
                            type='email'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            placeholder='email@example.com'
                        />
                    </FormField>

                    <FormField label='Số điện thoại' name='phone' required>
                        <Input
                            type='tel'
                            name='phone'
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder='0912 345 678'
                        />
                    </FormField>

                    <FormField label='Hạng thành viên' name='membershipTier'>
                        <Select
                            name='membershipTier'
                            value={formData.membershipTier}
                            onChange={(value) => setFormData((prev) => ({ ...prev, membershipTier: value }))}
                            options={tierOptions}
                        />
                    </FormField>

                    <FormField label='Ghi chú' name='notes'>
                        <Textarea
                            name='notes'
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                            placeholder='Thêm ghi chú...'
                        />
                    </FormField>
                </div>

                {/* Footer */}
                <div className='flex-shrink-0 p-6 border-t border-pink-100 rounded-b-3xl flex gap-3'>
                    <button
                        onClick={onClose}
                        className='flex-1 px-4 py-2 rounded-lg border border-pink-200 text-gray-700 hover:bg-pink-50 transition-colors'
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        className='flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm'
                    >
                        Thêm khách hàng
                    </button>
                </div>
            </div>
        </div>
    );
}
