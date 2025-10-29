import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserIcon, MailIcon, PhoneIcon, SendIcon } from 'lucide-react';
import { toast } from '../../../utils/toast';
import { FormField, Input, Textarea, Select } from '../../../components/ui';

export function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const serviceOptions = [
        { value: '', label: 'Chọn dịch vụ quan tâm...' },
        { value: 'facial', label: 'Chăm sóc da mặt' },
        { value: 'laser', label: 'Công nghệ Laser' },
        { value: 'body', label: 'Điều trị Body' },
        { value: 'consultation', label: 'Tư vấn chung' },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        // Clear error when user types
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleServiceChange = (value: string) => {
        setFormData({ ...formData, service: value });
        if (errors.service) {
            setErrors({ ...errors, service: '' });
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập họ tên';
        if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
        if (!formData.message.trim()) newErrors.message = 'Vui lòng nhập nội dung';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            setIsSubmitting(true);
            // Mock submission
            setTimeout(() => {
                setIsSubmitting(false);
                setIsSubmitted(true);
                toast.success('Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi trong 24h.');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    service: '',
                    message: '',
                });
            }, 1000);
        } else {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
        }
    };
    return (
        <motion.div
            initial={{
                opacity: 0,
                x: -20,
            }}
            animate={{
                opacity: 1,
                x: 0,
            }}
            transition={{
                duration: 0.6,
            }}
            className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-8'
        >
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>Send Us a Message</h2>
            {isSubmitted ? (
                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.9,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    className='bg-green-50 rounded-2xl p-8 text-center'
                >
                    <div className='w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6'>
                        <SendIcon className='w-10 h-10 text-white' />
                    </div>
                    <h3 className='text-xl font-bold text-gray-800 mb-2'>Message Sent Successfully!</h3>
                    <p className='text-gray-600 mb-4'>
                        Thank you for reaching out to us. Our team will get back to you within 24 hours.
                    </p>
                    <motion.button
                        whileHover={{
                            scale: 1.05,
                        }}
                        whileTap={{
                            scale: 0.95,
                        }}
                        onClick={() => setIsSubmitted(false)}
                        className='px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium shadow-lg'
                    >
                        Send Another Message
                    </motion.button>
                </motion.div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className='grid md:grid-cols-2 gap-6 mb-6'>
                        <FormField label='Họ và tên' name='name' error={errors.name} required>
                            <Input
                                name='name'
                                value={formData.name}
                                onChange={handleChange}
                                leftIcon={UserIcon}
                                placeholder='Nhập họ và tên của bạn'
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

                        <FormField label='Số điện thoại' name='phone' helpText='Định dạng: 0912 345 678'>
                            <Input
                                type='phone'
                                name='phone'
                                value={formData.phone}
                                onChange={handleChange}
                                leftIcon={PhoneIcon}
                                placeholder='0912 345 678'
                            />
                        </FormField>

                        <FormField label='Dịch vụ quan tâm' name='service'>
                            <Select
                                name='service'
                                value={formData.service}
                                onChange={handleServiceChange}
                                options={serviceOptions}
                                placeholder='Chọn dịch vụ...'
                            />
                        </FormField>

                        <div className='md:col-span-2'>
                            <FormField label='Nội dung tin nhắn' name='message' error={errors.message} required>
                                <Textarea
                                    name='message'
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder='Chúng tôi có thể giúp gì cho bạn?'
                                    rows={5}
                                    maxLength={500}
                                    showCounter
                                />
                            </FormField>
                        </div>
                    </div>
                    <div className='flex items-center justify-between mt-8'>
                        <p className='text-sm text-gray-500'>* Required fields</p>
                        <motion.button
                            whileHover={{
                                scale: 1.05,
                            }}
                            whileTap={{
                                scale: 0.95,
                            }}
                            type='submit'
                            disabled={isSubmitting}
                            className='px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium shadow-xl flex items-center gap-2'
                        >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                            <SendIcon className='w-5 h-5' />
                        </motion.button>
                    </div>
                </form>
            )}
        </motion.div>
    );
}
