import React, { useState } from 'react';
import { XIcon, SparklesIcon } from 'lucide-react';
import { useAppointments } from '../../../hooks/useStore';
import { toast } from '../../../utils/toast';
import { FormField, Select, Textarea, DatePicker, TimePicker } from '../../../components/ui';

interface NewBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function NewBookingModal({ isOpen, onClose, onSuccess }: NewBookingModalProps) {
    const { addAppointment } = useAppointments();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        service: '',
        therapist: '',
        branch: '',
        date: '',
        time: '',
        duration: '60',
        customer: '',
        customerEmail: '',
        customerPhone: '',
        paymentMethod: 'venue',
        notes: '',
    });

    const serviceOptions = [
        { value: '', label: 'Chọn dịch vụ' },
        { value: 'facial', label: 'Chăm sóc da cao cấp - 3,000,000đ' },
        { value: 'massage', label: 'Massage toàn thân - 3,750,000đ' },
        { value: 'hair', label: 'Chăm sóc và tạo kiểu tóc - 5,000,000đ' },
        { value: 'nails', label: 'Manicure & Pedicure - 2,125,000đ' },
    ];

    const therapistOptions = [
        { value: '', label: 'Chọn chuyên viên' },
        { value: 'emma', label: 'Emma Wilson - Chuyên viên da' },
        { value: 'lisa', label: 'Lisa Anderson - Massage' },
        { value: 'sophie', label: 'Sophie Martinez - Tóc' },
        { value: 'rachel', label: 'Rachel Kim - Nail' },
    ];

    const branchOptions = [
        { value: '', label: 'Chọn chi nhánh' },
        { value: 'downtown', label: 'Chi nhánh Trung tâm' },
        { value: 'westside', label: 'Chi nhánh Tây' },
        { value: 'eastside', label: 'Chi nhánh Đông' },
    ];

    const durationOptions = [
        { value: '60', label: '60 phút' },
        { value: '90', label: '90 phút' },
        { value: '120', label: '120 phút' },
    ];

    const customerOptions = [
        { value: '', label: 'Chọn khách hàng' },
        { value: 'sarah', label: 'Sarah Johnson' },
        { value: 'michael', label: 'Michael Chen' },
        { value: 'emily', label: 'Emily Davis' },
        { value: 'james', label: 'James Wilson' },
    ];

    const paymentOptions = [
        { value: 'venue', label: 'Thanh toán tại cơ sở' },
        { value: 'card', label: 'Thẻ tín dụng' },
        { value: 'wallet', label: 'Ví điện tử' },
    ];

    const handleSelectChange = (name: string) => (value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date: Date | null) => {
        setFormData((prev) => ({ ...prev, date: date?.toISOString() || '' }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    if (!isOpen) return null;

    const handleSubmit = () => {
        // Validation
        if (
            !formData.service ||
            !formData.therapist ||
            !formData.branch ||
            !formData.date ||
            !formData.time ||
            !formData.customer
        ) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Add to store
        addAppointment({
            customerName: formData.customer,
            customerEmail: formData.customerEmail,
            customerPhone: formData.customerPhone,
            service: formData.service,
            therapist: formData.therapist,
            branch: formData.branch,
            date: formData.date,
            time: formData.time,
            duration: formData.duration,
            status: 'pending',
            paymentStatus: 'unpaid',
            price: 150, // Mock price
            notes: formData.notes,
        });

        toast.success('Appointment created successfully! (Mocked)');
        onSuccess();
        onClose();
        setStep(1);
        setFormData({
            service: '',
            therapist: '',
            branch: '',
            date: '',
            time: '',
            duration: '60 minutes',
            customer: '',
            customerEmail: '',
            customerPhone: '',
            paymentMethod: 'Pay at venue',
            notes: '',
        });
    };

    return (
        <>
            <div className='!fixed !inset-0 !m-0 !p-0 bg-black/50 backdrop-blur-sm z-[9999]' onClick={onClose} />
            <div className='!fixed !inset-0 !m-0 !p-0 flex items-center justify-center z-[10000] pointer-events-none'>
                <div className='bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-4 pointer-events-auto'>
                    <div className='bg-gradient-to-r from-pink-400 to-purple-400 p-6 rounded-t-3xl flex items-center justify-between flex-shrink-0'>
                        <div>
                            <h2 className='text-xl font-bold text-white'>New Booking</h2>
                            <p className='text-white/80 text-sm'>Step {step} of 3</p>
                        </div>
                        <button onClick={onClose} className='p-1 hover:bg-white/20 rounded-full transition-colors'>
                            <XIcon className='w-6 h-6 text-white' />
                        </button>
                    </div>
                    <div className='p-6 overflow-y-auto flex-1'>
                        <div className='flex items-center justify-between mb-6'>
                            {[1, 2, 3].map((s) => (
                                <div key={s} className='flex items-center flex-1'>
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                                            step >= s
                                                ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white'
                                                : 'bg-gray-200 text-gray-400'
                                        }`}
                                    >
                                        {s}
                                    </div>
                                    {s < 3 && (
                                        <div
                                            className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                                                step > s
                                                    ? 'bg-gradient-to-r from-pink-400 to-purple-400'
                                                    : 'bg-gray-200'
                                            }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        {step === 1 && (
                            <div className='space-y-4 animate-in fade-in slide-in-from-right-2'>
                                <div className='bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100'>
                                    <div className='flex items-center gap-2'>
                                        <SparklesIcon className='w-5 h-5 text-purple-600' />
                                        <button className='text-sm text-purple-600 hover:text-purple-700 font-medium'>
                                            AI: Gợi ý khung giờ tốt nhất
                                        </button>
                                    </div>
                                </div>

                                <FormField label='Dịch vụ' name='service' required>
                                    <Select
                                        name='service'
                                        value={formData.service}
                                        onChange={handleSelectChange('service')}
                                        options={serviceOptions}
                                        placeholder='Chọn dịch vụ'
                                    />
                                </FormField>

                                <FormField label='Chuyên viên' name='therapist' required>
                                    <Select
                                        name='therapist'
                                        value={formData.therapist}
                                        onChange={handleSelectChange('therapist')}
                                        options={therapistOptions}
                                        placeholder='Chọn chuyên viên'
                                    />
                                </FormField>

                                <FormField label='Chi nhánh' name='branch' required>
                                    <Select
                                        name='branch'
                                        value={formData.branch}
                                        onChange={handleSelectChange('branch')}
                                        options={branchOptions}
                                        placeholder='Chọn chi nhánh'
                                    />
                                </FormField>
                            </div>
                        )}
                        {step === 2 && (
                            <div className='space-y-4 animate-in fade-in slide-in-from-right-2'>
                                <div className='grid grid-cols-2 gap-4'>
                                    <FormField label='Ngày' name='date' required>
                                        <DatePicker
                                            name='date'
                                            value={formData.date ? new Date(formData.date) : null}
                                            onChange={handleDateChange}
                                            placeholder='Chọn ngày'
                                            disablePastDates
                                        />
                                    </FormField>

                                    <FormField label='Giờ' name='time' required>
                                        <TimePicker
                                            name='time'
                                            value={formData.time}
                                            onChange={handleSelectChange('time')}
                                            placeholder='Chọn giờ'
                                            interval={30}
                                        />
                                    </FormField>
                                </div>

                                <FormField label='Thời gian' name='duration' required>
                                    <Select
                                        name='duration'
                                        value={formData.duration}
                                        onChange={handleSelectChange('duration')}
                                        options={durationOptions}
                                    />
                                </FormField>

                                <div className='bg-pink-50/50 rounded-lg p-4 border border-pink-100'>
                                    <p className='text-sm text-gray-700'>
                                        <span className='font-semibold'>Khung giờ còn trống:</span> 10:00, 14:00, 16:30
                                    </p>
                                </div>
                            </div>
                        )}
                        {step === 3 && (
                            <div className='space-y-4 animate-in fade-in slide-in-from-right-2'>
                                <FormField label='Khách hàng' name='customer' required>
                                    <Select
                                        name='customer'
                                        value={formData.customer}
                                        onChange={handleSelectChange('customer')}
                                        options={customerOptions}
                                        placeholder='Chọn khách hàng'
                                    />
                                </FormField>
                                <button className='text-sm text-purple-600 hover:text-purple-700'>
                                    + Thêm khách hàng mới
                                </button>

                                <FormField label='Phương thức thanh toán' name='paymentMethod' required>
                                    <Select
                                        name='paymentMethod'
                                        value={formData.paymentMethod}
                                        onChange={handleSelectChange('paymentMethod')}
                                        options={paymentOptions}
                                    />
                                </FormField>

                                <FormField label='Ghi chú đặc biệt' name='notes'>
                                    <Textarea
                                        name='notes'
                                        value={formData.notes}
                                        onChange={handleChange}
                                        placeholder='Yêu cầu hoặc ghi chú đặc biệt...'
                                        rows={3}
                                        maxLength={300}
                                    />
                                </FormField>

                                <div className='bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100'>
                                    <h4 className='font-semibold text-gray-800 mb-2'>Tóm tắt đặt lịch</h4>
                                    <div className='space-y-1 text-sm text-gray-700'>
                                        <p>Dịch vụ: Chăm sóc da cao cấp</p>
                                        <p>Chuyên viên: Emma Wilson</p>
                                        <p>Ngày giờ: Hôm nay lúc 14:00</p>
                                        <p className='font-semibold text-gray-800 pt-2 border-t border-pink-100'>
                                            Tổng: 3,000,000đ
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='flex-shrink-0 bg-white/90 backdrop-blur-xl p-6 border-t border-pink-100 rounded-b-3xl flex gap-3'>
                        {step > 1 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className='flex-1 px-4 py-3 rounded-lg border border-pink-200 text-gray-700 hover:bg-pink-50 transition-colors font-medium'
                            >
                                Back
                            </button>
                        )}
                        {step < 3 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                className='flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm font-medium'
                            >
                                Continue
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                className='flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm font-medium'
                            >
                                Confirm Booking
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
