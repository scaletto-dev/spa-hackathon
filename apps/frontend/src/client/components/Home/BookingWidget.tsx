import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SparklesIcon } from 'lucide-react';
import { toast } from '../../../utils/toast';
import { FormField, Select, DatePicker, TimePicker } from '../../../components/ui';
import { useTranslation } from 'react-i18next';
import { getServices } from '../../../services/servicesApi';
import { getBranches } from '../../../services/bookingApi';
import { Service } from '../../../types/service';
import { Branch } from '../../../services/bookingApi';

export function BookingWidget() {
    const navigate = useNavigate();
    const { t } = useTranslation('common');
    const [aiAssist, setAiAssist] = useState(false);
    const [services, setServices] = useState<Service[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [formData, setFormData] = useState({
        service: null as Service | null,
        branch: null as Branch | null,
        date: null as Date | null,
        time: '',
    });

    // Load services and branches from API
    useEffect(() => {
        const loadData = async () => {
            try {
                const [servicesData, branchesData] = await Promise.all([getServices(), getBranches()]);
                setServices(servicesData.data || []);
                setBranches(branchesData || []);
            } catch (error) {
                console.error('Error loading data:', error);
                toast.error('Không thể tải dữ liệu');
            }
        };
        loadData();
    }, []);

    // Generate service options from API data
    const serviceOptions = [
        { value: '', label: t('home.bookingWidget.selectService') },
        ...services.map((service) => ({
            value: service.id.toString(),
            label: service.name, // Just show name, not price/duration to avoid overflow
        })),
    ];

    // Generate branch options from API data
    const branchOptions = [
        { value: '', label: t('home.bookingWidget.selectBranch') },
        ...branches.map((branch) => ({
            value: branch.id.toString(),
            label: `${branch.name} - ${branch.address}`,
        })),
    ];

    const handleServiceChange = (value: string) => {
        const service = services.find((s) => s.id.toString() === value);
        setFormData((prev) => ({ ...prev, service: service || null }));
    };

    const handleBranchChange = (value: string) => {
        const branch = branches.find((b) => b.id.toString() === value);
        setFormData((prev) => ({ ...prev, branch: branch || null }));
    };

    const handleDateChange = (date: Date | null) => {
        setFormData((prev) => ({ ...prev, date }));
    };

    const handleTimeChange = (time: string) => {
        setFormData((prev) => ({ ...prev, time }));
    };

    // Calculate disabled time slots for today
    const getDisabledTimeSlots = (): string[] => {
        if (!formData.date) return [];

        const selectedDate = formData.date;
        const today = new Date();
        const isToday = selectedDate.toDateString() === today.toDateString();

        if (!isToday) return [];

        // Disable past times for today
        const currentHour = today.getHours();
        const currentMinute = today.getMinutes();
        const disabledSlots: string[] = [];

        // Calculate current time in minutes since midnight
        const currentTotalMinutes = currentHour * 60 + currentMinute;

        // Generate all time slots from 9:00 until now
        for (let hour = 9; hour < 22; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const slotTotalMinutes = hour * 60 + minute;

                // Disable if slot is in the past or within 30 minutes from now
                if (slotTotalMinutes <= currentTotalMinutes) {
                    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                    disabledSlots.push(timeStr);
                }
            }
        }

        return disabledSlots;
    };

    const handleQuickBook = () => {
        // Validate form based on AI assist mode
        if (!formData.service) {
            toast.error(t('home.bookingWidget.selectServiceError'));
            return;
        }

        // If AI assist is enabled, only require service and branch
        // AI will suggest date and time automatically
        if (aiAssist) {
            if (!formData.branch) {
                toast.error(t('home.bookingWidget.selectBranchForAI'));
                return;
            }
            // Date and time are optional - AI will suggest them
            toast.info(t('home.bookingWidget.aiWillSuggest'));
        } else {
            // Normal mode: all fields are required
            if (!formData.branch || !formData.date || !formData.time) {
                toast.error(t('home.bookingWidget.fillAllFields'));
                return;
            }
        }

        // Build query params for redirect
        const params = new URLSearchParams({
            source: 'home-widget',
            service: formData.service.id.toString(),
            ...(formData.branch && { branch: formData.branch.id.toString() }),
            ...(formData.date && { date: formData.date.toISOString().split('T')[0] || '' }),
            ...(formData.time && { time: formData.time }),
            ...(aiAssist && { aiAssist: 'true' }),
        });

        toast.success(t('home.bookingWidget.redirecting'));
        navigate(`/booking?${params.toString()}`);
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
                        <h2 className='text-2xl font-bold text-gray-800'>{t('home.bookingWidget.title')}</h2>
                        <label className='flex items-center gap-2 cursor-pointer'>
                            <input
                                type='checkbox'
                                checked={aiAssist}
                                onChange={(e) => setAiAssist(e.target.checked)}
                                className='w-4 h-4 rounded accent-pink-500'
                            />
                            <span className='text-sm text-gray-600 flex items-center gap-1'>
                                <SparklesIcon className='w-4 h-4 text-pink-500' />
                                {t('home.bookingWidget.aiAssist')}
                            </span>
                        </label>
                    </div>
                    <div className='grid md:grid-cols-4 gap-4 mb-6'>
                        <FormField label={t('home.bookingWidget.service')} name='service'>
                            <Select
                                name='service'
                                value={formData.service?.id?.toString() || ''}
                                onChange={handleServiceChange}
                                options={serviceOptions}
                                placeholder={t('home.bookingWidget.selectService')}
                                searchable={true}
                            />
                        </FormField>

                        <FormField label={t('home.bookingWidget.branch')} name='branch'>
                            <Select
                                name='branch'
                                value={formData.branch?.id?.toString() || ''}
                                onChange={handleBranchChange}
                                options={branchOptions}
                                placeholder={t('home.bookingWidget.selectBranch')}
                                searchable={true}
                            />
                        </FormField>

                        <FormField label={t('home.bookingWidget.date')} name='date'>
                            <div className='relative'>
                                <DatePicker
                                    name='date'
                                    value={formData.date}
                                    onChange={handleDateChange}
                                    placeholder={t('home.bookingWidget.selectDate')}
                                    disablePastDates
                                    disabled={aiAssist}
                                />
                                {aiAssist && (
                                    <div className='absolute inset-0 bg-pink-50/50 rounded-xl flex items-center justify-center pointer-events-none'>
                                        <SparklesIcon className='w-5 h-5 text-pink-400' />
                                        <span className='ml-2 text-xs text-pink-600 font-medium'>
                                            {t('home.bookingWidget.aiWillSuggestShort')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </FormField>

                        <FormField label={t('home.bookingWidget.time')} name='time'>
                            <div className='relative'>
                                <TimePicker
                                    name='time'
                                    value={formData.time}
                                    onChange={handleTimeChange}
                                    placeholder={t('home.bookingWidget.selectTime')}
                                    interval={30}
                                    disabled={aiAssist}
                                    disabledSlots={getDisabledTimeSlots()}
                                />
                                {aiAssist && (
                                    <div className='absolute inset-0 bg-pink-50/50 rounded-xl flex items-center justify-center pointer-events-none'>
                                        <SparklesIcon className='w-5 h-5 text-pink-400' />
                                        <span className='ml-2 text-xs text-pink-600 font-medium'>
                                            {t('home.bookingWidget.aiWillSuggestShort')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </FormField>
                    </div>

                    {/* AI mode hint */}
                    {aiAssist && formData.service && formData.branch && (
                        <div className='mb-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200'>
                            <div className='flex items-start gap-3'>
                                <SparklesIcon className='w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5' />
                                <div className='flex-1'>
                                    <p className='text-sm font-medium text-gray-800 mb-1'>
                                        {t('home.bookingWidget.aiHintTitle')}
                                    </p>
                                    <p className='text-xs text-gray-600'>{t('home.bookingWidget.aiHintDesc')}</p>
                                </div>
                            </div>
                        </div>
                    )}

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
                        {aiAssist ? t('home.bookingWidget.confirmWithAI') : t('home.bookingWidget.confirmBooking')}
                    </motion.button>
                </div>
            </motion.div>
        </section>
    );
}
