import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ArrowLeftIcon, UserIcon, MailIcon, PhoneIcon } from 'lucide-react';
import { FormField, Input, Textarea } from '../../../components/ui';

export function BookingUserInfo({ bookingData, updateBookingData, onNext, onPrev }: any) {
    const [formData, setFormData] = useState({
        name: bookingData.name || '',
        email: bookingData.email || '',
        phone: bookingData.phone || '',
        notes: bookingData.notes || '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const updatedFormData = {
            ...formData,
            [name]: value,
        };
        setFormData(updatedFormData);
        // Update bookingData immediately for validation
        updateBookingData({ [name]: value });
        // Clear error when user types
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập họ tên';
        if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
        if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            updateBookingData(formData);
            onNext();
        }
    };

    // Check if form is valid for enabling button
    const isFormValid = () => {
        return (
            formData.name.trim() !== '' &&
            formData.email.trim() !== '' &&
            /\S+@\S+\.\S+/.test(formData.email) &&
            formData.phone.trim() !== ''
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
        >
            <div className='mb-8'>
                <h2 className='text-2xl font-bold text-gray-800 mb-4'>Thông tin của bạn</h2>
                <p className='text-gray-600'>Vui lòng cung cấp thông tin liên hệ để hoàn tất đặt lịch</p>
            </div>
            <div className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-8 mb-8'>
                <div className='grid md:grid-cols-2 gap-6 mb-6'>
                    <FormField label='Họ và tên' name='name' error={errors.name} required>
                        <Input
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                            leftIcon={UserIcon}
                            placeholder='Nhập họ và tên'
                        />
                    </FormField>

                    <FormField label='Địa chỉ Email' name='email' error={errors.email} required>
                        <Input
                            type='email'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            leftIcon={MailIcon}
                            placeholder='email@example.com'
                        />
                    </FormField>

                    <div className='md:col-span-2'>
                        <FormField label='Số điện thoại' name='phone' error={errors.phone} required>
                            <Input
                                type='phone'
                                name='phone'
                                value={formData.phone}
                                onChange={handleChange}
                                leftIcon={PhoneIcon}
                                placeholder='0912 345 678'
                            />
                        </FormField>
                    </div>

                    <div className='md:col-span-2'>
                        <FormField
                            label='Ghi chú đặc biệt'
                            name='notes'
                            helpText='Thông tin hoặc yêu cầu đặc biệt (không bắt buộc)'
                        >
                            <Textarea
                                name='notes'
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder='Bất kỳ yêu cầu đặc biệt hoặc thông tin nào chúng tôi cần biết...'
                                rows={4}
                                maxLength={300}
                            />
                        </FormField>
                    </div>
                </div>
                <div className='bg-pink-50 rounded-2xl p-6 border border-pink-200'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-2'>Tóm tắt cuộc hẹn</h3>
                    <div className='space-y-2 text-gray-700'>
                        <p>
                            <span className='font-medium'>Dịch vụ:</span> {bookingData.service?.title}
                        </p>
                        <p>
                            <span className='font-medium'>Chi nhánh:</span> {bookingData.branch?.name}
                        </p>
                        <p>
                            <span className='font-medium'>Ngày:</span>{' '}
                            {bookingData.date
                                ? new Date(bookingData.date).toLocaleDateString('vi-VN', {
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                  })
                                : 'Chưa chọn'}
                        </p>
                        <p>
                            <span className='font-medium'>Giờ:</span> {bookingData.time}
                        </p>
                        <p>
                            <span className='font-medium'>Giá:</span> {bookingData.service?.price}
                        </p>
                        <p>
                            <span className='font-medium'>Thời gian:</span> {bookingData.service?.duration}
                        </p>
                    </div>
                </div>
            </div>
            <div className='flex justify-between mt-12'>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onPrev}
                    className='flex items-center gap-2 px-8 py-4 bg-white border-2 border-pink-200 text-gray-700 rounded-full font-semibold shadow-lg'
                >
                    <ArrowLeftIcon className='w-5 h-5' />
                    Quay lại
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    disabled={!isFormValid()}
                    className={`flex items-center gap-2 px-8 py-4 rounded-full font-semibold shadow-xl ${
                        isFormValid()
                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    Hoàn tất đặt lịch
                    <ArrowRightIcon className='w-5 h-5' />
                </motion.button>
            </div>
        </motion.div>
    );
}
