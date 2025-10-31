import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, ZapIcon, ListIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { InlinePaymentMethod } from './InlinePaymentMethod';
import { AvailabilityIndicator } from './AvailabilityIndicator';
import { QuickBookingConfirmationModal } from './QuickBookingConfirmationModal';
import { AITimeSlotSelector } from './AITimeSlotSelector';
import { BookingData } from './types';
import { createBooking, createVNPayPaymentUrl, getBranchById, getBranches, Branch } from '../../../services/bookingApi';
import { getServices } from '../../../services/servicesApi';
import { toast } from '../../../utils/toast';
import { Select } from '../../../components/ui/Select';
import { formatPrice, formatDuration } from '../../../utils/format';
import { Service } from '../../../types/service';

interface QuickBookingProps {
    bookingData: BookingData;
    updateBookingData: (data: Partial<BookingData>) => void;
    onSwitchToFull: () => void;
}

// Generate time slots dynamically based on operating hours (9 AM - 9 PM)
const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    const startHour = 9; // 9:00
    const endHour = 21; // 21:00
    const intervalMinutes = 30; // 30-minute intervals

    for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += intervalMinutes) {
            const hourStr = hour.toString().padStart(2, '0');
            const minuteStr = minute.toString().padStart(2, '0');
            slots.push(`${hourStr}:${minuteStr}`);
        }
    }
    return slots;
};

export function QuickBooking({ bookingData, updateBookingData, onSwitchToFull }: QuickBookingProps) {
    const { t } = useTranslation('common');
    const location = useLocation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        service: bookingData.service || null,
        branch: bookingData.branch || null,
        therapist: bookingData.therapist || null,
        date: bookingData.date || null,
        time: bookingData.time || null,
        name: bookingData.name || '',
        email: bookingData.email || '',
        phone: bookingData.phone || '',
        paymentMethod: bookingData.paymentMethod || 'vnpay',
        useAI: false,
        promoCode: '',
    });
    const [paymentDetailsComplete, setPaymentDetailsComplete] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isRedirectingToPayment, setIsRedirectingToPayment] = useState(false);
    const [services, setServices] = useState<Service[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

    // Load services and branches on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const [servicesData, branchesData] = await Promise.all([getServices(), getBranches()]);
                setServices(servicesData.data || []);
                setBranches(branchesData || []);
            } catch (error) {
                console.error('Error loading services/branches:', error);
                toast.error('Không thể tải dữ liệu dịch vụ');
            }
        };
        loadData();
    }, []);

    // Update available time slots when date changes
    useEffect(() => {
        if (formData.date) {
            const selectedDate = new Date(formData.date);
            const today = new Date();
            const isToday = selectedDate.toDateString() === today.toDateString();

            if (isToday) {
                // Filter out past time slots for today
                const currentHour = today.getHours();
                const currentMinute = today.getMinutes();
                const allSlots = generateTimeSlots();

                const filteredSlots = allSlots.filter((timeStr) => {
                    // Parse time string in 24h format "09:00" or "14:30"
                    const timeParts = timeStr.split(':');
                    const hour = parseInt(timeParts[0] || '0', 10);
                    const minute = parseInt(timeParts[1] || '0', 10);

                    // Compare with current time
                    return hour > currentHour || (hour === currentHour && minute > currentMinute);
                });

                setAvailableTimeSlots(filteredSlots);
            } else {
                // For future dates, show all slots
                setAvailableTimeSlots(generateTimeSlots());
            }
        } else {
            setAvailableTimeSlots(generateTimeSlots());
        }
    }, [formData.date]);

    // Load data from URL params (from chatbot redirect)
    useEffect(() => {
        const loadFromURLParams = async () => {
            const params = new URLSearchParams(location.search);
            const serviceId = params.get('service');
            const branchId = params.get('branch');
            const date = params.get('date');
            const time = params.get('time');
            const name = params.get('name');
            const phone = params.get('phone');
            const email = params.get('email');

            if (serviceId || branchId || date || time || name || email || phone) {
                try {
                    let serviceObj = null;
                    let branchObj = null;

                    // Load service details if serviceId provided
                    if (serviceId) {
                        try {
                            const { getServiceById } = await import('../../../services/servicesApi');
                            serviceObj = await getServiceById(serviceId);
                        } catch (err) {
                            console.error('Failed to load service:', err);
                        }
                    }

                    // Load branch details if branchId provided
                    if (branchId) {
                        try {
                            branchObj = await getBranchById(branchId);
                        } catch (err) {
                            console.error('Failed to load branch:', err);
                        }
                    }

                    // Keep time in 24h format (no conversion needed)
                    const formattedTime = time || null;

                    setFormData((prev) => ({
                        ...prev,
                        ...(serviceObj && { service: serviceObj as unknown as typeof prev.service }),
                        ...(branchObj && { branch: branchObj }),
                        ...(date && { date }),
                        ...(formattedTime && { time: formattedTime }),
                        ...(name && { name: decodeURIComponent(name) }),
                        ...(phone && { phone: decodeURIComponent(phone) }),
                        ...(email && { email: decodeURIComponent(email) }),
                    }));
                } catch (error) {
                    console.error('Error loading URL params:', error);
                }
            }
        };

        loadFromURLParams();
    }, [location.search]);

    // Sync formData when bookingData prop changes (e.g., from sessionStorage) or when navigating back
    useEffect(() => {
        // Check URL params first
        const params = new URLSearchParams(location.search);
        const hasURLParams = params.get('service') || params.get('branch') || params.get('date') || params.get('time');

        // If there are URL params, wait for them to load (handled by loadFromURLParams effect)
        if (hasURLParams) {
            return;
        }

        if (bookingData.service || bookingData.branch || bookingData.date || bookingData.time) {
            setFormData((prev) => {
                // Convert ISO date string to yyyy-MM-dd format for date input
                let formattedDate: string | null = bookingData.date || prev.date;
                if (formattedDate && typeof formattedDate === 'string' && formattedDate.includes('T')) {
                    formattedDate = formattedDate.split('T')[0] || null; // Extract yyyy-MM-dd part
                }

                // Keep time in 24h format (no conversion needed)
                const formattedTime: string | null = bookingData.time || prev.time;

                return {
                    ...prev,
                    service: bookingData.service || prev.service,
                    branch: bookingData.branch || prev.branch,
                    therapist: bookingData.therapist || prev.therapist,
                    date: formattedDate,
                    time: formattedTime,
                    name: bookingData.name || prev.name,
                    email: bookingData.email || prev.email,
                    phone: bookingData.phone || prev.phone,
                    paymentMethod: bookingData.paymentMethod || prev.paymentMethod,
                    useAI: bookingData.useAI || prev.useAI,
                };
            });
        }
    }, [bookingData, location.search]);

    const handleChange = (field: string, value: unknown) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };
    const handleAISelection = () => {
        handleChange('useAI', !formData.useAI);
        if (!formData.useAI) {
            // Simulate AI selection
            setTimeout(() => {
                const aiDate = new Date();
                aiDate.setDate(aiDate.getDate() + 1);
                handleChange('date', aiDate);
                handleChange('time', '15:30');
                handleChange('branch', branches[0]);
            }, 500);
        }
    };

    const handleSubmit = async () => {
        try {
            if (!formData.service || !formData.branch || !formData.date || !formData.time) {
                toast.error('Thông tin đặt lịch chưa đầy đủ');
                return;
            }

            setIsProcessing(true);

            // Map payment method: vnpay/ewallet/bank -> ATM, clinic -> CLINIC
            let paymentType: 'ATM' | 'CLINIC' | 'WALLET' | 'CASH' | 'BANK_TRANSFER' = 'CLINIC';
            if (
                formData.paymentMethod === 'vnpay' ||
                formData.paymentMethod === 'ewallet' ||
                formData.paymentMethod === 'bank'
            ) {
                paymentType = 'ATM';
            } else if (formData.paymentMethod === 'clinic') {
                paymentType = 'CLINIC';
            }

            // Build payload - always include guest fields
            const payload = {
                serviceIds: [formData.service.id],
                branchId: formData.branch.id,
                appointmentDate: formData.date,
                appointmentTime: formData.time, // Already in 24h format
                notes: '',
                language: 'vi',
                paymentType,
                // Guest fields (required by API, even for logged-in users)
                guestName: formData.name || '',
                guestEmail: formData.email || '',
                guestPhone: formData.phone || '',
            };

            console.log('Quick Booking - Submitting booking:', payload);
            toast.info('Đang xử lý đặt lịch...');

            // Call API to create booking
            const response = await createBooking(payload);
            console.log('Quick Booking - Booking created:', response);

            // Update booking data
            updateBookingData(formData);

            // Check if payment method is VNPay (ATM)
            if (formData.paymentMethod === 'vnpay') {
                setIsRedirectingToPayment(true);
                toast.info('Đang chuyển hướng đến cổng thanh toán VNPay...');

                try {
                    const vnpayResponse = await createVNPayPaymentUrl({
                        bookingId: response.id,
                        locale: 'vn',
                    });

                    // Redirect to VNPay payment page
                    window.location.href = vnpayResponse.paymentUrl;
                } catch (vnpayError) {
                    console.error('Error creating VNPay payment URL:', vnpayError);
                    toast.error('Không thể tạo liên kết thanh toán. Vui lòng thử lại.');
                    setIsRedirectingToPayment(false);
                    setIsProcessing(false);
                }
            } else {
                // Other payment methods - show success
                setIsProcessing(false);
                toast.success(`Đặt lịch thành công! Mã tham chiếu: #${response.referenceNumber}`);
                setShowConfirmation(true);

                // Redirect to confirmation page after 2 seconds
                setTimeout(() => {
                    navigate(`/booking/confirmation?ref=${response.referenceNumber}`);
                }, 2000);
            }
        } catch (error) {
            console.error('Quick Booking - Error:', error);

            // Extract error message from backend response
            let errorMessage = 'Đặt lịch thất bại. Vui lòng thử lại.';

            if (error instanceof Error) {
                // Check if it's an axios error with response data
                const axiosError = error as any;
                if (axiosError.response?.data) {
                    const { message, error: errorType } = axiosError.response.data;
                    if (message) {
                        errorMessage = message;
                    } else if (errorType) {
                        errorMessage = errorType;
                    }
                } else if (error.message) {
                    errorMessage = error.message;
                }
            }

            toast.error(errorMessage);
            setIsProcessing(false);
        }
    };

    // Validation: for quick booking, just check if payment method is selected
    // (Quick booking is meant to be fast, detailed payment forms are in Full Booking)
    const isPaymentReady = () => {
        // Pay at clinic doesn't need details
        if (formData.paymentMethod === 'clinic') {
            return true;
        }
        // Other methods need payment details to be complete
        return formData.paymentMethod !== '' && formData.paymentMethod !== null && paymentDetailsComplete;
    };

    const isFormValid =
        formData.service &&
        formData.branch &&
        formData.date &&
        formData.time &&
        formData.name &&
        formData.email &&
        formData.phone &&
        isPaymentReady();
    return (
        <>
            <motion.div
                initial={{
                    opacity: 0,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                exit={{
                    opacity: 0,
                    y: -20,
                }}
                className='grid lg:grid-cols-3 gap-6'
            >
                {/* Main Booking Card */}
                <div className='lg:col-span-2'>
                    <div className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-6 md:p-8'>
                        {/* AI Quick Select Banner */}
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: -10,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            className='mb-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4 border border-pink-200/50'
                        >
                            <div className='flex items-center gap-3'>
                                <SparklesIcon className='w-5 h-5 text-pink-500 flex-shrink-0' />
                                <label className='flex items-center gap-2 cursor-pointer flex-1'>
                                    <input
                                        type='checkbox'
                                        checked={formData.useAI}
                                        onChange={handleAISelection}
                                        className='w-4 h-4 rounded accent-pink-500'
                                    />
                                    <span className='text-sm text-gray-700 font-medium'>
                                        Let AI choose the best available slot for me
                                    </span>
                                </label>
                            </div>
                        </motion.div>
                        {/* AI Selection Result */}
                        {formData.useAI && formData.date && formData.time && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    scale: 0.95,
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                }}
                                className='mb-6 bg-pink-50 rounded-2xl p-4 border border-pink-200'
                            >
                                <div className='flex items-start gap-4'>
                                    <div className='w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0'>
                                        <SparklesIcon className='w-6 h-6 text-white' />
                                    </div>
                                    <div>
                                        <h4 className='font-semibold text-gray-800 mb-1'>AI Recommendation</h4>
                                        <p className='text-sm text-gray-600 mb-2'>
                                            Based on optimal conditions and availability:
                                        </p>
                                        <div className='flex flex-wrap gap-2'>
                                            <span className='px-3 py-1 bg-white rounded-full text-sm font-medium text-pink-600'>
                                                {formData.date &&
                                                    new Date(formData.date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                            </span>
                                            <span className='px-3 py-1 bg-white rounded-full text-sm font-medium text-pink-600'>
                                                {formData.time}
                                            </span>
                                            <span className='px-3 py-1 bg-white rounded-full text-sm font-medium text-pink-600'>
                                                {formData.branch?.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        {/* Form Fields */}
                        <div className='space-y-6'>
                            {/* Service Selection */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    {t('bookings.selectServiceLabel')}
                                </label>
                                <Select
                                    name='service'
                                    value={formData.service?.id?.toString() || ''}
                                    onChange={(value) => {
                                        console.log('Service selected:', value);
                                        const service = services.find((s) => s.id.toString() === value);
                                        console.log('Found service:', service);
                                        handleChange('service', service);
                                    }}
                                    options={services.map((service) => ({
                                        value: service.id.toString(),
                                        label: `${service.name} - ${formatPrice(
                                            typeof service.price === 'string'
                                                ? parseFloat(service.price)
                                                : service.price,
                                        )} (${formatDuration(
                                            typeof service.duration === 'string'
                                                ? parseInt(service.duration)
                                                : service.duration,
                                        )})`,
                                    }))}
                                    placeholder={t('bookings.chooseService')}
                                    searchable={true}
                                    className='w-full'
                                />
                            </div>
                            {/* Branch Selection */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    {t('bookings.selectBranchLabel')}
                                </label>
                                <Select
                                    name='branch'
                                    value={formData.branch?.id?.toString() || ''}
                                    onChange={(value) => {
                                        console.log('Branch selected:', value);
                                        const branch = branches.find((b) => b.id.toString() === value);
                                        console.log('Found branch:', branch);
                                        handleChange('branch', branch);
                                    }}
                                    options={branches.map((branch) => ({
                                        value: branch.id.toString(),
                                        label: `${branch.name} - ${branch.address}`,
                                    }))}
                                    placeholder={t('bookings.chooseLocation')}
                                    disabled={formData.useAI}
                                    searchable={true}
                                    className='w-full'
                                />
                            </div>
                            {/* Date & Time Selection */}
                            <div className='grid md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        {t('bookings.selectDateLabel')}
                                    </label>
                                    <input
                                        type='date'
                                        value={formData.date || ''}
                                        onChange={(e) => handleChange('date', e.target.value)}
                                        disabled={formData.useAI}
                                        min={new Date().toISOString().split('T')[0]}
                                        className='w-full px-4 py-3 bg-white/80 border-2 border-pink-100 rounded-2xl focus:outline-none focus:border-pink-300 transition-colors disabled:opacity-50'
                                    />
                                </div>

                                {/* AI Time Slot Selector - Show when date and branch are selected */}
                                {formData.date && formData.branch && (
                                    <div className='col-span-full'>
                                        <AITimeSlotSelector
                                            date={formData.date}
                                            branchId={formData.branch.id}
                                            {...(formData.service && { serviceIds: [formData.service.id] })}
                                            onTimeSlotSelected={(time: string) => handleChange('time', time)}
                                            {...(formData.time && { currentTimeSlot: formData.time })}
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'>
                                        {t('bookings.selectTimeLabel')}
                                        {formData.date && formData.service && <AvailabilityIndicator />}
                                    </label>
                                    <Select
                                        name='time'
                                        value={formData.time || ''}
                                        onChange={(value) => handleChange('time', value)}
                                        options={availableTimeSlots.map((time) => ({
                                            value: time,
                                            label: time,
                                        }))}
                                        placeholder={t('bookings.chooseTime')}
                                        disabled={formData.useAI}
                                        searchable={false}
                                        className='w-full'
                                    />
                                </div>
                            </div>
                            {/* Contact Information */}
                            <div className='pt-4 border-t border-gray-200'>
                                <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                                    {t('bookings.yourInformationLabel')}
                                </h3>
                                <div className='grid md:grid-cols-2 gap-4'>
                                    <input
                                        type='text'
                                        placeholder={t('bookings.fullNamePlaceholder')}
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        className='px-4 py-3 bg-white/80 border-2 border-pink-100 rounded-2xl focus:outline-none focus:border-pink-300 transition-colors'
                                    />
                                    <input
                                        type='tel'
                                        placeholder={t('bookings.phoneNumberPlaceholder')}
                                        value={formData.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        className='px-4 py-3 bg-white/80 border-2 border-pink-100 rounded-2xl focus:outline-none focus:border-pink-300 transition-colors'
                                    />
                                </div>
                                <input
                                    type='email'
                                    placeholder={t('bookings.emailAddressPlaceholder')}
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className='mt-4 w-full px-4 py-3 bg-white/80 border-2 border-pink-100 rounded-2xl focus:outline-none focus:border-pink-300 transition-colors'
                                />
                            </div>
                            {/* Payment Method */}
                            <div className='pt-4 border-t border-gray-200'>
                                <InlinePaymentMethod
                                    selectedMethod={formData.paymentMethod}
                                    onSelect={(method: string) => handleChange('paymentMethod', method)}
                                    promoCode={formData.promoCode}
                                    onPromoChange={(code: string) => handleChange('promoCode', code)}
                                    onPaymentDetailsChange={(isComplete: boolean) =>
                                        setPaymentDetailsComplete(isComplete)
                                    }
                                />
                            </div>
                        </div>
                        {/* Action Buttons */}
                        <div className='mt-8 flex flex-col sm:flex-row gap-4'>
                            <motion.button
                                whileHover={{
                                    scale: 1.02,
                                }}
                                whileTap={{
                                    scale: 0.98,
                                }}
                                onClick={onSwitchToFull}
                                className='flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-pink-200 text-gray-700 rounded-full font-semibold'
                            >
                                <ListIcon className='w-5 h-5' />
                                Switch to Full Booking Mode
                            </motion.button>
                            <motion.button
                                whileHover={{
                                    scale: isFormValid ? 1.02 : 1,
                                }}
                                whileTap={{
                                    scale: isFormValid ? 0.98 : 1,
                                }}
                                onClick={handleSubmit}
                                disabled={!isFormValid || isProcessing}
                                className={`flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold shadow-xl ${
                                    isFormValid && !isProcessing
                                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <motion.div
                                            animate={{
                                                rotate: 360,
                                            }}
                                            transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                                ease: 'linear',
                                            }}
                                            className='w-5 h-5 border-2 border-white border-t-transparent rounded-full'
                                        />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <ZapIcon className='w-5 h-5' />
                                        Book Now
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </div>
                </div>
                {/* Summary Sidebar */}
                <div className='lg:col-span-1'>
                    <div className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-6 sticky top-24'>
                        <h3 className='text-xl font-bold text-gray-800 mb-6'>Booking Summary</h3>
                        <div className='space-y-4'>
                            {formData.service ? (
                                <div className='p-3 bg-pink-50 rounded-xl'>
                                    <p className='text-xs text-gray-500 mb-1'>Service</p>
                                    <p className='font-medium text-gray-800'>{formData.service.name}</p>
                                    <p className='text-sm text-gray-600'>
                                        {typeof formData.service.duration === 'number'
                                            ? formatDuration(formData.service.duration)
                                            : formData.service.duration}
                                    </p>
                                </div>
                            ) : (
                                <div className='p-3 bg-gray-50 rounded-xl'>
                                    <p className='text-sm text-gray-400'>No service selected</p>
                                </div>
                            )}
                            {formData.branch && (
                                <div className='p-3 bg-purple-50 rounded-xl'>
                                    <p className='text-xs text-gray-500 mb-1'>Location</p>
                                    <p className='font-medium text-gray-800'>{formData.branch.name}</p>
                                </div>
                            )}
                            {formData.therapist && (
                                <div className='p-3 bg-blue-50 rounded-xl'>
                                    <p className='text-xs text-gray-500 mb-1'>Therapist</p>
                                    <p className='font-medium text-gray-800'>
                                        {typeof formData.therapist === 'string'
                                            ? formData.therapist
                                            : formData.therapist.name}
                                    </p>
                                </div>
                            )}
                            {formData.date && formData.time && (
                                <div className='p-3 bg-green-50 rounded-xl'>
                                    <p className='text-xs text-gray-500 mb-1'>Date & Time</p>
                                    <p className='font-medium text-gray-800'>
                                        {new Date(formData.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </p>
                                    <p className='text-sm text-gray-600'>{formData.time}</p>
                                </div>
                            )}
                            {formData.service && (
                                <div className='pt-4 border-t border-gray-200'>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-gray-600'>Total</span>
                                        <span className='text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent'>
                                            {formatPrice(formData.service.price)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='mt-6 p-3 bg-yellow-50 rounded-xl border border-yellow-200'>
                            <p className='text-xs text-gray-600'>
                                <span className='font-medium'>⚡ Quick Booking:</span> Complete your appointment in
                                seconds with AI assistance
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
            {/* Confirmation Modal */}
            {showConfirmation && (
                <QuickBookingConfirmationModal bookingData={formData} onClose={() => setShowConfirmation(false)} />
            )}

            {/* VNPay Redirect Loading Overlay */}
            {isRedirectingToPayment && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'
                    onClick={(e) => e.stopPropagation()}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className='bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-4'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='text-center'>
                            {/* Loading Animation */}
                            <div className='relative mb-6'>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                    className='w-20 h-20 mx-auto border-4 border-pink-200 border-t-pink-500 rounded-full'
                                />
                                <div className='absolute inset-0 flex items-center justify-center'>
                                    <div className='w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full animate-pulse' />
                                </div>
                            </div>

                            {/* Text */}
                            <h3 className='text-2xl font-bold text-gray-800 mb-2'>Đang chuyển đến VNPay...</h3>
                            <p className='text-gray-600 mb-6'>
                                Vui lòng đợi, bạn sẽ được chuyển hướng đến cổng thanh toán trong giây lát
                            </p>

                            {/* Cancel Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setIsRedirectingToPayment(false);
                                    toast.info('Đã hủy chuyển hướng thanh toán');
                                }}
                                className='px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-semibold transition-colors'
                            >
                                Hủy
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </>
    );
}
