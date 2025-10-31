import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SparklesIcon } from 'lucide-react';
import { toast } from '../../../utils/toast';
import { FormField, Select, DatePicker, TimePicker } from '../../../components/ui';
import { useTranslation } from 'react-i18next';

export function BookingWidget() {
    const navigate = useNavigate();
    const { t } = useTranslation('common');
    const [aiAssist, setAiAssist] = useState(false);
    const [formData, setFormData] = useState({
        service: '',
        branch: '',
        date: null as Date | null,
        time: '',
    });

    const serviceOptions = [
        { value: '', label: t('home.bookingWidget.selectService') },
        { value: 'facial', label: t('home.bookingWidget.services.facial') },
        { value: 'laser', label: t('home.bookingWidget.services.laser') },
        { value: 'botox', label: t('home.bookingWidget.services.botox') },
        { value: 'analysis', label: t('home.bookingWidget.services.analysis') },
    ];

    const branchOptions = [
        { value: '', label: t('home.bookingWidget.selectBranch') },
        { value: 'downtown', label: t('home.bookingWidget.branches.downtown') },
        { value: 'westside', label: t('home.bookingWidget.branches.westside') },
        { value: 'eastside', label: t('home.bookingWidget.branches.eastside') },
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
            toast.error(t('home.bookingWidget.fillAllFields'));
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

        toast.success(t('home.bookingWidget.redirecting'));
        setTimeout(() => {
            navigate('/booking');
        }, 500);
    };

    return (
        <section className="relative w-full -mt-20 z-20 px-6">
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
                className="max-w-5xl mx-auto"
            >
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {t('home.bookingWidget.title')}
                        </h2>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={aiAssist}
                                onChange={(e) => setAiAssist(e.target.checked)}
                                className="w-4 h-4 rounded accent-pink-500"
                            />
                            <span className="text-sm text-gray-600 flex items-center gap-1">
                                <SparklesIcon className="w-4 h-4 text-pink-500" />
                                {t('home.bookingWidget.aiAssist')}
                            </span>
                        </label>
                    </div>
                    <div className="grid md:grid-cols-4 gap-4 mb-6">
                        <FormField label={t('home.bookingWidget.service')} name="service">
                            <Select
                                name="service"
                                value={formData.service}
                                onChange={handleSelectChange('service')}
                                options={serviceOptions}
                                placeholder={t('home.bookingWidget.selectService')}
                            />
                        </FormField>

                        <FormField label={t('home.bookingWidget.branch')} name="branch">
                            <Select
                                name="branch"
                                value={formData.branch}
                                onChange={handleSelectChange('branch')}
                                options={branchOptions}
                                placeholder={t('home.bookingWidget.selectBranch')}
                                searchable={false}
                            />
                        </FormField>

                        <FormField label={t('home.bookingWidget.date')} name="date">
                            <DatePicker
                                name="date"
                                value={formData.date}
                                onChange={handleDateChange}
                                placeholder={t('home.bookingWidget.selectDate')}
                                disablePastDates
                            />
                        </FormField>

                        <FormField label={t('home.bookingWidget.time')} name="time">
                            <TimePicker
                                name="time"
                                value={formData.time}
                                onChange={handleSelectChange('time')}
                                placeholder={t('home.bookingWidget.selectTime')}
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
                        className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-shadow"
                    >
                        {aiAssist
                            ? t('home.bookingWidget.confirmWithAI')
                            : t('home.bookingWidget.confirmBooking')}
                    </motion.button>
                </div>
            </motion.div>
        </section>
    );
}
