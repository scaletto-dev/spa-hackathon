import React, { useState, useEffect } from 'react';
import { XIcon, Edit3Icon, TrashIcon, CalendarIcon, DollarSignIcon } from 'lucide-react';
import { toast } from '../../../utils/toast';
import { Input, FormField } from '../../../components/ui';
import { adminCustomersAPI } from '../../../api/adapters/admin';

interface CustomerDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    customerId: string | null;
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
    const [loading, setLoading] = useState(false);
    const [customer, setCustomer] = useState<any>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        language: 'en',
    });

    useEffect(() => {
        if (isOpen && customerId) {
            loadCustomer();
        }
    }, [isOpen, customerId]);

    const loadCustomer = async () => {
        try {
            setLoading(true);
            const response = await adminCustomersAPI.getById(customerId!);
            console.log('Customer API Response:', response);

            // Backend returns { success: true, data: {...}, timestamp: ... }
            const data = response.data || response;
            console.log('Customer Data:', data);

            setCustomer(data);
            setFormData({
                fullName: data.fullName || '',
                email: data.email || '',
                phone: data.phone || '',
                language: data.language || 'en',
            });
        } catch (error: any) {
            console.error('Failed to load customer:', error);
            toast.error(error.message || 'Failed to load customer');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        // Validation
        if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        try {
            setLoading(true);
            await adminCustomersAPI.update(customerId!, formData);
            toast.success('Đã cập nhật thông tin khách hàng!');
            setIsEditing(false);
            onUpdate?.();
        } catch (error: any) {
            toast.error(error.message || 'Failed to update customer');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (
            window.confirm(
                'Bạn có chắc chắn muốn xóa khách hàng này? Hành động này không thể hoàn tác.'
            )
        ) {
            try {
                setLoading(true);
                await adminCustomersAPI.delete(customerId!);
                toast.success('Đã xóa khách hàng!');
                onDelete?.();
                onClose();
            } catch (error: any) {
                toast.error(error.message || 'Failed to delete customer');
            } finally {
                setLoading(false);
            }
        }
    };

    if (!isOpen || !customerId) return null;

    return (
        <>
            <div
                className="!fixed !inset-0 !m-0 !p-0 bg-black/50 backdrop-blur-sm z-[9999]"
                onClick={onClose}
            />
            <div className="!fixed !inset-0 !m-0 !p-0 flex items-center justify-center z-[10000] pointer-events-none">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto">
                    {loading || !customer ? (
                        <>
                            {/* Header - Loading State */}
                            <div className="bg-gradient-to-r from-pink-400 to-purple-400 p-6 rounded-t-3xl flex items-center justify-between flex-shrink-0">
                                <h2 className="text-xl font-bold text-white">Đang tải...</h2>
                                <button
                                    onClick={onClose}
                                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <XIcon className="w-6 h-6 text-white" />
                                </button>
                            </div>
                            {/* Loading Spinner */}
                            <div className="flex-1 flex items-center justify-center p-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Header - Sticky */}
                            <div className="bg-gradient-to-r from-pink-400 to-purple-400 p-6 rounded-t-3xl flex items-center justify-between flex-shrink-0">
                                <h2 className="text-xl font-bold text-white">
                                    {isEditing ? 'Chỉnh sửa khách hàng' : 'Chi tiết khách hàng'}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <XIcon className="w-6 h-6 text-white" />
                                </button>
                            </div>

                            {/* Content - Scrollable */}
                            <div className="overflow-y-auto flex-1 p-6 space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-full border-4 border-pink-200 bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold text-2xl">
                                        {customer?.fullName?.charAt(0) || '?'}
                                    </div>
                                    <div className="flex-1">
                                        {isEditing ? (
                                            <Input
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                className="font-semibold text-lg"
                                            />
                                        ) : (
                                            <h3 className="text-2xl font-bold text-gray-800">
                                                {formData.fullName}
                                            </h3>
                                        )}
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-xs font-medium text-gray-600">
                                                Verification:{' '}
                                                {customer?.emailVerified
                                                    ? '✅ Verified'
                                                    : '⏳ Pending'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-4 border border-pink-100">
                                        <div className="flex items-center gap-2 mb-1">
                                            <CalendarIcon className="w-4 h-4 text-pink-500" />
                                            <p className="text-xs text-gray-600">Tổng đặt lịch</p>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-800">
                                            {customer?._count?.bookings || 0}
                                        </p>
                                    </div>
                                    <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-4 border border-pink-100">
                                        <div className="flex items-center gap-2 mb-1">
                                            <DollarSignIcon className="w-4 h-4 text-purple-500" />
                                            <p className="text-xs text-gray-600">Tổng chi tiêu</p>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-800">-</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-4 border border-pink-100">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-xs text-gray-600">Tham gia</p>
                                        </div>
                                        <p className="text-sm font-bold text-gray-800">
                                            {new Date(customer?.createdAt).toLocaleDateString(
                                                'vi-VN'
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="space-y-4">
                                    <FormField label="Email" name="email" required>
                                        <Input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                        />
                                    </FormField>

                                    <FormField label="Số điện thoại" name="phone" required>
                                        <Input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                        />
                                    </FormField>

                                    <FormField label="Ngôn ngữ" name="language">
                                        <select
                                            name="language"
                                            value={formData.language}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:bg-gray-50"
                                        >
                                            <option value="en">English</option>
                                            <option value="vi">Tiếng Việt</option>
                                            <option value="es">Español</option>
                                        </select>
                                    </FormField>
                                </div>
                            </div>

                            {/* Footer - Sticky */}
                            <div className="flex-shrink-0 bg-white/90 backdrop-blur-xl p-6 border-t border-pink-100 rounded-b-3xl flex gap-3">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                setFormData({
                                                    fullName: customer?.fullName || '',
                                                    email: customer?.email || '',
                                                    phone: customer?.phone || '',
                                                    language: customer?.language || 'en',
                                                });
                                            }}
                                            className="flex-1 px-4 py-2 rounded-lg border border-pink-200 text-gray-700 hover:bg-pink-50 transition-colors"
                                            disabled={loading}
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={loading}
                                            className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm disabled:opacity-50"
                                        >
                                            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            disabled={loading}
                                            className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            <Edit3Icon className="w-4 h-4" />
                                            Sửa thông tin
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            disabled={loading}
                                            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                            Xóa
                                        </button>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
