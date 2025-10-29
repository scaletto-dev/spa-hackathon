import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZapIcon, ListIcon, ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { BookingProgress } from '../components/booking/BookingProgress';
import { BookingServiceSelect } from '../components/booking/BookingServiceSelect';
import { BookingBranchSelect } from '../components/booking/BookingBranchSelect';
import { BookingDateTimeSelect } from '../components/booking/BookingDateTimeSelect';
import { BookingUserInfo } from '../components/booking/BookingUserInfo';
import { BookingPayment } from '../components/booking/BookingPayment';
import { BookingConfirmation } from '../components/booking/BookingConfirmation';
import { QuickBooking } from '../components/booking/QuickBooking';
import { BookingData } from '../components/booking/types';

export function BookingPage() {
    const [bookingMode, setBookingMode] = useState('quick'); // 'quick' or 'full'
    const [currentStep, setCurrentStep] = useState(1);
    const [bookingData, setBookingData] = useState<BookingData>({
        service: null,
        branch: null,
        therapist: null,
        date: null,
        time: null,
        name: '',
        email: '',
        phone: '',
        notes: '',
        useAI: false,
        paymentMethod: null,
        promoCode: null,
    });
    const steps = ['Select Service', 'Choose Branch', 'Pick Date & Time', 'Your Info', 'Payment', 'Confirm'];
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

    // Validation logic for each step
    const canContinue = () => {
        switch (currentStep) {
            case 1: // Select Service
                return bookingData.service !== null;
            case 2: // Choose Branch
                return bookingData.branch !== null;
            case 3: // Pick Date & Time
                return (bookingData.date !== null && bookingData.time !== null) || bookingData.useAI === true;
            case 4: // Your Info
                return bookingData.name !== '' && bookingData.email !== '' && bookingData.phone !== '';
            case 5: // Payment
                // Must select a payment method
                if (!bookingData.paymentMethod || bookingData.paymentMethod === '') {
                    return false;
                }
                // If 'clinic' (pay at clinic), no additional details needed
                if (bookingData.paymentMethod === 'clinic') {
                    return true;
                }
                // For card/ewallet/bank, need payment details to be complete
                return bookingData.paymentDetailsComplete === true;
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
                            Smart Booking
                        </span>
                    </h1>
                    <p className='text-xl text-gray-600 max-w-2xl mx-auto mb-8'>
                        Experience our AI-powered appointment system for personalized beauty treatments
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
                            Full Booking
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
                            Quick Booking
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
                                                <span className='hidden sm:inline'>Back</span>
                                            </button>
                                        ) : (
                                            <div className='w-24'></div>
                                        )}

                                        <div className='text-center'>
                                            <p className='text-sm text-gray-500'>
                                                Step {currentStep} of {steps.length}
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
                                            <span className='hidden sm:inline'>Continue</span>
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
