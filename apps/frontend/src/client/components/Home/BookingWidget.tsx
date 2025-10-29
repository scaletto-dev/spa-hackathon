import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SparklesIcon } from 'lucide-react';
import { toast } from '../../../utils/toast';
import { FormField, Select, DatePicker, TimePicker } from '../../../components/ui';

export function BookingWidget() {
    const navigate = useNavigate();
    const [aiAssist, setAiAssist] = useState(false);
    const [formData, setFormData] = useState({
        service: '',
        branch: '',
        date: null as Date | null,
        time: '',
    });

    const serviceOptions = [
        { value: '', label: 'Chọn dịch vụ' },
        { value: 'facial', label: 'Chăm sóc da mặt' },
        { value: 'laser', label: 'Triệt lông Laser' },
        { value: 'botox', label: 'Botox & Filler' },
        { value: 'analysis', label: 'Phân tích da' },
    ];

    const branchOptions = [
        { value: '', label: 'Chọn chi nhánh' },
        { value: 'downtown', label: 'Chi nhánh Trung tâm' },
        { value: 'westside', label: 'Chi nhánh Tây' },
        { value: 'eastside', label: 'Chi nhánh Đông' },
    ];

    const handleSelectChange = (name: string) => (value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date: Date | null) => {
        setFormData((prev) => ({ ...prev, date }));
    };

    const handleQuickBook = () => {
        // Validate form
        if (!formData.service || !formData.branch || !formData.date || !formData.time) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }

        // Store in sessionStorage for booking page
        const bookingData = {
            service: formData.service,
            branch: formData.branch,
            date: formData.date?.toISOString(),
            time: formData.time,
            aiAssist,
        };

        sessionStorage.setItem('quickBookingData', JSON.stringify(bookingData));

        toast.success('Đang chuyển đến trang đặt lịch...');
        setTimeout(() => {
            navigate('/booking');
        }, 500);
    };

    return (
        <section className='relative w-full -mt-20 z-20 px-6'>
            <motion.div
                initial={{
                    opacity: 0,
                    y: 50,
                }}
                whileInView={{
                    opacity: 1,
                    y: 0,
                }}
                viewport={{
                    once: true,
                }}
                transition={{
                    duration: 0.6,
                }}
                className='max-w-5xl mx-auto'
            >
                <div className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-8'>
                    <div className='flex items-center justify-between mb-6'>
                        <h2 className='text-2xl font-bold text-gray-800'>Đặt lịch nhanh</h2>
                        <label className='flex items-center gap-2 cursor-pointer'>
                            <input
                                type='checkbox'
                                checked={aiAssist}
                                onChange={(e) => setAiAssist(e.target.checked)}
                                className='w-4 h-4 rounded accent-pink-500'
                            />
                            <span className='text-sm text-gray-600 flex items-center gap-1'>
                                <SparklesIcon className='w-4 h-4 text-pink-500' />
                                Để AI chọn giờ tốt nhất
                            </span>
                        </label>
                    </div>
                    <div className='grid md:grid-cols-4 gap-4 mb-6'>
                        <FormField label='Dịch vụ' name='service'>
                            <Select
                                name='service'
                                value={formData.service}
                                onChange={handleSelectChange('service')}
                                options={serviceOptions}
                                placeholder='Chọn dịch vụ'
                            />
                        </FormField>

                        <FormField label='Chi nhánh' name='branch'>
                            <Select
                                name='branch'
                                value={formData.branch}
                                onChange={handleSelectChange('branch')}
                                options={branchOptions}
                                placeholder='Chọn chi nhánh'
                                searchable={false}
                            />
                        </FormField>

                        <FormField label='Ngày' name='date'>
                            <DatePicker
                                name='date'
                                value={formData.date}
                                onChange={handleDateChange}
                                placeholder='Chọn ngày'
                                disablePastDates
                            />
                        </FormField>

                        <FormField label='Giờ' name='time'>
                            <TimePicker
                                name='time'
                                value={formData.time}
                                onChange={handleSelectChange('time')}
                                placeholder='Chọn giờ'
                                interval={60}
                            />
                        </FormField>
                    </div>
                    <motion.button
                        onClick={handleQuickBook}
                        whileHover={{
                            scale: 1.02,
                        }}
                        whileTap={{
                            scale: 0.98,
                        }}
                        className='w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-shadow'
                    >
                        {aiAssist ? 'Xác nhận với AI Assistant' : 'Xác nhận đặt lịch'}
                    </motion.button>
                </div>
            </motion.div>
        </section>
    );
}
