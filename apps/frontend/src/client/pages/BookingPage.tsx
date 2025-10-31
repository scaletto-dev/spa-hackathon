import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZapIcon, ListIcon, ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { BookingProgress } from '../components/booking/BookingProgress';
import { BookingServiceSelect } from '../components/booking/BookingServiceSelect';
import { BookingBranchSelect } from '../components/booking/BookingBranchSelect';
import { BookingDateTimeSelect } from '../components/booking/BookingDateTimeSelect';
import { BookingUserInfo } from '../components/booking/BookingUserInfo';
import { BookingPayment } from '../components/booking/BookingPayment';
import { BookingConfirmation } from '../components/booking/BookingConfirmation';
import { QuickBooking } from '../components/booking/QuickBooking';
import { BookingData } from '../components/booking/types';
import { createBooking, createVNPayPaymentUrl, CreateBookingPayload } from '../../services/bookingApi';
import { toast } from '../../utils/toast';
import { useNavigate } from 'react-router-dom';

export function BookingPage() {
    const { t } = useTranslation('common');
    const location = useLocation();
    const navigate = useNavigate();
    const [bookingMode, setBookingMode] = useState('full'); // Default to 'full' mode
    const [currentStep, setCurrentStep] = useState(1);
    const [isRedirectingToPayment, setIsRedirectingToPayment] = useState(false);
    const [bookingData, setBookingData] = useState<BookingData>({
        serviceIds: [],
        branch: null,
        therapist: null,
        date: null,
        time: null,
        name: '',
        email: '',
        phone: '',
        notes: '',
        isLoggedIn: false,
        paymentMethod: null,
        promoCode: null,
    });

    // Check if user is logged in
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setBookingData((prev) => ({
                    ...prev,
                    isLoggedIn: true,
                    name: user.fullName || '',
                    email: user.email || '',
                    phone: user.phone || '',
                }));
            } catch (error) {
                console.error('Failed to load user data:', error);
            }
        }
    }, []);

    // Handle preSelectedService from ServiceDetailPage
    useEffect(() => {
        const state = location.state as {
            preSelectedService?: {
                id: string;
                title: string;
                category: string;
                price: string | number;
                duration: string;
                image?: string;
                description?: string;
            };
        } | null;
        if (state?.preSelectedService) {
            const service = state.preSelectedService;
            setBookingData((prev) => ({
                ...prev,
                serviceIds: [service.id],
                service: {
                    id: service.id,
                    name: service.title,
                    categoryName: service.category,
                    price:
                        typeof service.price === 'string'
                            ? parseFloat(service.price.replace(/[^0-9]/g, ''))
                            : service.price,
                    duration: service.duration,
                    images: service.image ? [service.image] : [],
                    excerpt: service.description || '',
                },
            }));
            // Skip to Branch selection
            setCurrentStep(2);
            toast.success(t('bookings.servicePreSelected'));
        }
    }, [location.state, t]);

    // Parse URL params from chat widget redirect
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const source = params.get('source');
        const aiAssist = params.get('aiAssist');

        if (
            source === 'chat-booking' ||
            source === 'chat-widget' ||
            source === 'home-widget' ||
            (params.has('service') && !source)
        ) {
            const name = params.get('name');
            const phone = params.get('phone');
            const email = params.get('email');
            const date = params.get('date');
            const time = params.get('time');
            const serviceId = params.get('service');
            const branchId = params.get('branch');

            // Load service and branch details
            const loadChatBookingData = async () => {
                try {
                    let branchObj = null;
                    let serviceObj = null;
                    let serviceIds: string[] = [];

                    // Load branch object if branchId provided
                    if (branchId) {
                        try {
                            const { getBranchById } = await import('../../services/bookingApi');
                            branchObj = await getBranchById(branchId);
                        } catch (err) {
                            console.error('Failed to load branch:', err);
                        }
                    }

                    // Load service object if serviceId provided
                    if (serviceId) {
                        try {
                            const { getServiceById } = await import('../../services/servicesApi');
                            serviceObj = await getServiceById(serviceId);
                            serviceIds = [serviceId];
                        } catch (err) {
                            console.error('Failed to load service:', err);
                        }
                    }

                    // Pre-fill booking data with actual objects
                    const updates: Partial<BookingData> = {
                        ...(name && { name }),
                        ...(phone && { phone }),
                        ...(email && { email }),
                        ...(date && { date }),
                        ...(time && { time }),
                        ...(serviceIds.length > 0 && { serviceIds }),
                        ...(branchObj && { branch: branchObj }),
                    };

                    // Map ServiceWithCategory to Service format
                    if (serviceObj) {
                        updates.service = {
                            id: serviceObj.id,
                            name: serviceObj.name,
                            categoryName: serviceObj.categoryName || 'General',
                            price:
                                typeof serviceObj.price === 'string' ? parseFloat(serviceObj.price) : serviceObj.price,
                            duration: String(serviceObj.duration),
                            images: serviceObj.images || [],
                            excerpt: serviceObj.excerpt,
                        };
                    }

                    setBookingData((prev) => ({ ...prev, ...updates }));

                    // Show welcome toast
                    if (source === 'chat-booking') {
                        toast.success(t('bookings.chatPreFilled'));
                    } else if (source === 'chat-widget') {
                        toast.info(t('bookings.aiSuggested'));
                    } else if (source === 'home-widget' && aiAssist === 'true') {
                        toast.info(t('bookings.aiAnalyzing'));
                    } else if (source === 'home-widget') {
                        toast.info(t('bookings.homeWidgetPreFilled'));
                    }

                    // Skip to appropriate step based on what data we have
                    if (serviceId && branchId && date && time) {
                        // All data available - skip to User Info
                        setCurrentStep(4);
                    } else if (serviceId && branchId && aiAssist === 'true') {
                        // AI mode: service + branch available, need AI to suggest date/time
                        // Skip to step 3 (Date/Time) and enable AI mode
                        setCurrentStep(3);
                        setBookingData((prev) => ({ ...prev, useAI: true }));
                    } else if (serviceId && branchId) {
                        // Service + branch available - skip to Date/Time selection
                        setCurrentStep(3);
                    } else if (serviceId) {
                        // Only service available - skip to Branch selection
                        setCurrentStep(2);
                    }
                } catch (error) {
                    console.error('Failed to load chat booking data:', error);
                }
            };

            loadChatBookingData();
        }
    }, [location.search, t]);

    // Step order with i18n
    const steps = [
        t('bookings.steps.selectService'), // Step 1
        t('bookings.steps.chooseBranch'), // Step 2
        t('bookings.steps.pickDateTime'), // Step 3
        t('bookings.steps.yourInfo'), // Step 4
        t('bookings.steps.payment'), // Step 5
        t('bookings.steps.confirm'), // Step 6
    ];

    const handleNextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
            window.scrollTo(0, 0);
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo(0, 0);
        }
    };

    const updateBookingData = (data: Partial<BookingData>) => {
        setBookingData({
            ...bookingData,
            ...data,
        });
    };

    const convertTo24HourFormat = (time12h: string): string => {
        // Convert "9:00 AM" or "2:00 PM" to "09:00" or "14:00"
        const parts = time12h.split(' ');
        const timePart = parts[0] || '9:00';
        const period = parts[1] || 'AM';
        const timeParts = timePart.split(':').map(Number);
        let hours = timeParts[0] || 9;
        const minutes = timeParts[1] || 0;

        if (period === 'PM' && hours !== 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
            hours = 0;
        }

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    const handleSubmitBooking = async () => {
        try {
            if (!bookingData.branch || !bookingData.date || !bookingData.time || !bookingData.serviceIds) {
                toast.error('Thông tin đặt lịch chưa đầy đủ');
                return;
            }

            // Check if user is logged in
            const accessToken = localStorage.getItem('accessToken');
            const isLoggedIn = !!accessToken;

            // Build payload according to API spec
            const payload: CreateBookingPayload = {
                serviceIds: bookingData.serviceIds,
                branchId: bookingData.branch.id,
                appointmentDate: bookingData.date, // YYYY-MM-DD format
                appointmentTime: convertTo24HourFormat(bookingData.time), // Convert to HH:mm format
                notes: bookingData.notes || '',
                language: 'vi',
                paymentType:
                    (bookingData.paymentMethod as 'ATM' | 'CLINIC' | 'WALLET' | 'CASH' | 'BANK_TRANSFER') || 'CLINIC', // Default to CLINIC payment
                guestName: isLoggedIn ? '' : bookingData.name || '',
                guestEmail: isLoggedIn ? '' : bookingData.email || '',
                guestPhone: isLoggedIn ? '' : bookingData.phone || '',
                paymentAmount: bookingData.totalAmount || 0, // Include total with tax
            };

            console.log('Submitting booking with payload:', payload);
            console.log('Is logged in:', isLoggedIn);
            toast.info('Đang xử lý đặt lịch...');

            // Call API to create booking
            const response = await createBooking(payload);
            console.log('Booking created successfully:', response);

            // Check if payment method is ATM (VNPay)
            if (bookingData.paymentMethod === 'ATM') {
                setIsRedirectingToPayment(true);
                toast.info('Đang chuyển hướng đến cổng thanh toán VNPay...');

                try {
                    // Create VNPay payment URL
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
                }
            } else {
                // Other payment methods - show success message
                toast.success(`Đặt lịch thành công! Mã tham chiếu: #${response.referenceNumber}`);

                // Redirect to booking detail page after 2 seconds
                setTimeout(() => {
                    navigate(`/booking/detail?ref=${response.referenceNumber}`);
                }, 2000);
            }
        } catch (error) {
            console.error('Error submitting booking:', error);

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
        }
    };

    // Validation logic for each step
    const canContinue = () => {
        switch (currentStep) {
            case 1: // Select Services - at least one service
                return bookingData.serviceIds && bookingData.serviceIds.length > 0;
            case 2: // Choose Branch
                return bookingData.branch !== null;
            case 3: // Pick Date & Time
                return bookingData.date !== null && bookingData.time !== null;
            case 4: // Your Info
                return bookingData.name !== '' && bookingData.email !== '' && bookingData.phone !== '';
            case 5: // Payment - placeholder validation
                return true;
            case 6: // Confirmation - just show it
                return true;
            default:
                return true;
        }
    };

    return (
        <div className='w-full min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 pt-24'>
            <div className='max-w-6xl mx-auto px-6 py-12'>
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.6,
                    }}
                    className='text-center mb-12'
                >
                    <h1 className='text-4xl md:text-5xl font-bold mb-4'>
                        <span className='bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent'>
                            {t('bookings.smartBooking')}
                        </span>
                    </h1>
                    <p className='text-xl text-gray-600 max-w-2xl mx-auto mb-8'>
                        {t('bookings.smartBookingDescription')}
                    </p>
                    <div className='flex items-center justify-center gap-3'>
                        <motion.button
                            whileHover={{
                                scale: 1.02,
                            }}
                            whileTap={{
                                scale: 0.98,
                            }}
                            onClick={() => setBookingMode('full')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                                bookingMode === 'full'
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                                    : 'bg-white/70 text-gray-700 border-2 border-gray-200'
                            }`}
                        >
                            <ListIcon className='w-5 h-5' />
                            {t('bookings.fullBooking')}
                        </motion.button>
                        <motion.button
                            whileHover={{
                                scale: 1.02,
                            }}
                            whileTap={{
                                scale: 0.98,
                            }}
                            onClick={() => setBookingMode('quick')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                                bookingMode === 'quick'
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                                    : 'bg-white/70 text-gray-700 border-2 border-gray-200'
                            }`}
                        >
                            <ZapIcon className='w-5 h-5' />
                            {t('bookings.quickBooking')}
                        </motion.button>
                    </div>
                </motion.div>
                <AnimatePresence mode='wait'>
                    {bookingMode === 'quick' ? (
                        <QuickBooking
                            key='quick'
                            bookingData={bookingData}
                            updateBookingData={updateBookingData}
                            onSwitchToFull={() => setBookingMode('full')}
                        />
                    ) : (
                        <motion.div
                            key='full'
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
                        >
                            <BookingProgress currentStep={currentStep} steps={steps} />

                            {/* Sticky Navigation Bar - Show for all steps except final confirmation */}
                            {currentStep < steps.length && (
                                <div className='sticky top-20 z-10 bg-gradient-to-r from-pink-50/95 via-white/95 to-purple-50/95 backdrop-blur-lg border-b border-pink-100 p-4 mb-6 rounded-2xl shadow-sm mt-8'>
                                    <div className='flex justify-between items-center'>
                                        {currentStep > 1 ? (
                                            <button
                                                onClick={handlePrevStep}
                                                className='flex items-center gap-2 px-6 py-2 bg-white border border-pink-200 text-gray-700 rounded-full font-medium shadow hover:shadow-md transition-all hover:scale-105'
                                            >
                                                <ArrowLeftIcon className='w-4 h-4' />
                                                <span className='hidden sm:inline'>{t('bookings.back')}</span>
                                            </button>
                                        ) : (
                                            <div className='w-24'></div>
                                        )}

                                        <div className='text-center'>
                                            <p className='text-sm text-gray-500'>
                                                {t('bookings.step')} {currentStep} {t('bookings.of')} {steps.length}
                                            </p>
                                            <p className='font-semibold text-gray-800 hidden sm:block'>
                                                {steps[currentStep - 1]}
                                            </p>
                                        </div>

                                        <button
                                            onClick={handleNextStep}
                                            disabled={!canContinue()}
                                            className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium shadow transition-all ${
                                                canContinue()
                                                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg hover:scale-105'
                                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                        >
                                            <span className='hidden sm:inline'>{t('bookings.continue')}</span>
                                            <ArrowRightIcon className='w-4 h-4' />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className='mt-12 mb-24'>
                                <AnimatePresence mode='wait'>
                                    {currentStep === 1 && (
                                        <BookingServiceSelect
                                            key='step1'
                                            bookingData={bookingData}
                                            updateBookingData={updateBookingData}
                                            onNext={handleNextStep}
                                        />
                                    )}
                                    {currentStep === 2 && (
                                        <BookingBranchSelect
                                            key='step2'
                                            bookingData={bookingData}
                                            updateBookingData={updateBookingData}
                                            onNext={handleNextStep}
                                            onPrev={handlePrevStep}
                                        />
                                    )}
                                    {currentStep === 3 && (
                                        <BookingDateTimeSelect
                                            key='step3'
                                            bookingData={bookingData}
                                            updateBookingData={updateBookingData}
                                            onNext={handleNextStep}
                                            onPrev={handlePrevStep}
                                        />
                                    )}
                                    {currentStep === 4 && (
                                        <BookingUserInfo
                                            key='step4'
                                            bookingData={bookingData}
                                            updateBookingData={updateBookingData}
                                            onNext={handleNextStep}
                                            onPrev={handlePrevStep}
                                        />
                                    )}
                                    {currentStep === 5 && (
                                        <BookingPayment
                                            key='step5'
                                            bookingData={bookingData}
                                            updateBookingData={updateBookingData}
                                            onNext={handleNextStep}
                                            onPrev={handlePrevStep}
                                        />
                                    )}
                                    {currentStep === 6 && (
                                        <BookingConfirmation
                                            key='step6'
                                            bookingData={bookingData}
                                            onPrev={handlePrevStep}
                                            onSubmit={handleSubmitBooking}
                                        />
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* VNPay Redirect Loading Overlay */}
            <AnimatePresence>
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
            </AnimatePresence>
        </div>
    );
}

export default BookingPage;
