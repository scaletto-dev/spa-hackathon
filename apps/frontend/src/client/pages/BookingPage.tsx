import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZapIcon, ListIcon, ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BookingProgress } from '../components/booking/BookingProgress';
import { BookingServiceSelect } from '../components/booking/BookingServiceSelect';
import { BookingBranchSelect } from '../components/booking/BookingBranchSelect';
import { BookingDateTimeSelect } from '../components/booking/BookingDateTimeSelect';
import { BookingUserInfo } from '../components/booking/BookingUserInfo';
import { BookingPayment } from '../components/booking/BookingPayment';
import { BookingConfirmation } from '../components/booking/BookingConfirmation';
import { QuickBooking } from '../components/booking/QuickBooking';
import { BookingData } from '../components/booking/types';
import { createBooking } from '../../services/bookingApi';
import { toast } from '../../utils/toast';

export function BookingPage() {
    const { t } = useTranslation('common');
    const [bookingMode, setBookingMode] = useState('full'); // Default to 'full' mode
    const [currentStep, setCurrentStep] = useState(1);
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
            const payload: any = {
                serviceIds: bookingData.serviceIds,
                branchId: bookingData.branch.id,
                appointmentDate: bookingData.date, // YYYY-MM-DD format
                appointmentTime: convertTo24HourFormat(bookingData.time), // Convert to HH:mm format
                notes: bookingData.notes || '',
                language: 'vi',
                paymentType: (bookingData.paymentMethod as 'ATM' | 'CLINIC' | 'WALLET' | 'CASH' | 'BANK_TRANSFER') || 'CLINIC', // Default to CLINIC payment
            };

            // Only add guest fields if NOT logged in
            if (!isLoggedIn) {
                payload.guestName = bookingData.name || '';
                payload.guestEmail = bookingData.email || '';
                payload.guestPhone = bookingData.phone || '';
            }

            console.log('Submitting booking with payload:', payload);
            console.log('Is logged in:', isLoggedIn);
            toast.info('Đang xử lý đặt lịch...');

            // Call API
            const response = await createBooking(payload);
            console.log('Booking created successfully:', response);

            toast.success(`Đặt lịch thành công! Mã tham chiếu: #${response.referenceNumber}`);
        } catch (error) {
            console.error('Error submitting booking:', error);
            toast.error('Đặt lịch thất bại. Vui lòng thử lại.');
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
        </div>
    );
}

export default BookingPage;
