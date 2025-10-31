/**
 * BookingTab - Quick booking interface with multi-step form
 */
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Message, BookingData, BookingFormData } from './types';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { getFeaturedServices } from '../../../services/bookingApi';
import { getBranches } from '../../../services/bookingApi';
import { toast } from '../../../utils/toast';
import { formatPrice } from '../../../utils/format';
import { useAuth } from '../../../auth/useAuth';

interface BookingTabProps {
    isActive: boolean;
}

type BookingStep =
    | 'service_selection'
    | 'slot_selection'
    | 'ask_name'
    | 'ask_phone'
    | 'ask_email'
    | 'confirmation'
    | 'completed';

interface Service {
    id: string;
    name: string;
    price: number;
    duration: string;
    excerpt: string;
}

export function BookingTab({ isActive }: BookingTabProps) {
    const { t, i18n } = useTranslation('common');
    const navigate = useNavigate();
    const { user } = useAuth();

    const [bookingStep, setBookingStep] = useState<BookingStep>('service_selection');
    const [bookingFormData, setBookingFormData] = useState<Partial<BookingFormData>>({});
    const [isWaitingForInput, setIsWaitingForInput] = useState(false);
    const [_services, setServices] = useState<Service[]>([]);
    const [_isLoadingServices, setIsLoadingServices] = useState(true);

    const [messages, setMessages] = useState<Message[]>([
        {
            type: 'bot',
            text: t('chat.loadingServices'),
            timestamp: new Date(),
        },
    ]);

    const loadServices = useCallback(async () => {
        try {
            setIsLoadingServices(true);
            const data = await getFeaturedServices();
            setServices(data);

            // Show services as action buttons
            setMessages([
                {
                    type: 'bot',
                    text: t('chat.selectServicePrompt'),
                    timestamp: new Date(),
                    actions: data.map((service) => ({
                        type: 'button' as const,
                        label: `${service.name} - ${formatPrice(service.price)}`,
                        action: `select_service_${service.id}`,
                        data: { serviceId: service.id, serviceName: service.name, price: service.price },
                    })),
                },
            ]);
        } catch (error) {
            console.error('Failed to load services:', error);
            toast.error(t('chat.loadingServicesError'));
            setMessages([
                {
                    type: 'bot',
                    text: t('chat.loadingServicesError'),
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsLoadingServices(false);
        }
    }, [t]);

    // Load services on mount
    useEffect(() => {
        if (isActive) {
            loadServices();
        }
    }, [isActive, loadServices]);

    // Handle service selection
    const handleServiceSelection = async (serviceId: string, serviceName: string, price: number) => {
        setMessages((prev) => [
            ...prev,
            {
                type: 'user',
                text: t('chat.serviceSelected', { serviceName }),
                timestamp: new Date(),
            },
        ]);

        // Show loading message
        setMessages((prev) => [
            ...prev,
            {
                type: 'bot',
                text: t('chat.loadingSlots'),
                timestamp: new Date(),
            },
        ]);

        // Load branches and create available slots
        try {
            const branches = await getBranches();
            const availableSlots: BookingData['slots'] = [];

            // Generate time slots (9:00 AM - 9:00 PM, 30-minute intervals)
            const generateTimeSlots = () => {
                const slots: string[] = [];
                for (let hour = 9; hour <= 21; hour++) {
                    if (hour < 21) {
                        slots.push(`${hour.toString().padStart(2, '0')}:00`);
                        slots.push(`${hour.toString().padStart(2, '0')}:30`);
                    } else {
                        slots.push('21:00');
                    }
                }
                return slots;
            };

            // Generate slots for next 3 days
            const now = new Date();
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            for (let i = 0; i < 3; i++) {
                const date = new Date(today);
                date.setDate(date.getDate() + i);

                const timeSlots = generateTimeSlots();

                // Filter out past times if date is today
                const availableTimeSlotsForDay =
                    i === 0
                        ? timeSlots.filter((timeSlot) => {
                              const timeParts = timeSlot.split(':');
                              const hours = parseInt(timeParts[0] || '0', 10);
                              const minutes = parseInt(timeParts[1] || '0', 10);
                              const slotDateTime = new Date();
                              slotDateTime.setHours(hours, minutes, 0, 0);
                              return slotDateTime > now;
                          })
                        : timeSlots;

                // Add slots for first branch
                if (branches.length > 0 && branches[0]) {
                    const branch = branches[0];

                    // Take first 3 available time slots for this day
                    availableTimeSlotsForDay.slice(0, 3).forEach((timeSlot) => {
                        const timeParts = timeSlot.split(':');
                        const hours = parseInt(timeParts[0] || '0', 10);
                        const minutes = parseInt(timeParts[1] || '0', 10);
                        const slotDateTime = new Date(date);
                        slotDateTime.setHours(hours, minutes, 0, 0);

                        availableSlots.push({
                            datetime: slotDateTime.toISOString(),
                            branchName: branch.name,
                            branchId: branch.id,
                            price,
                        });
                    });
                }
            }

            // Remove loading message and show slots
            setMessages((prev) => {
                const filtered = prev.filter((msg) => !msg.text.includes(t('chat.loadingSlots')));
                return [
                    ...filtered,
                    {
                        type: 'bot',
                        text: t('chat.slotsAvailable'),
                        timestamp: new Date(),
                        bookingData: {
                            serviceName,
                            serviceId,
                            slots: availableSlots.slice(0, 6), // Show 6 slots
                        },
                    },
                ];
            });

            setBookingStep('slot_selection');
        } catch (error) {
            console.error('Failed to load slots:', error);
            setMessages((prev) => {
                const filtered = prev.filter((msg) => !msg.text.includes(t('chat.loadingSlots')));
                return [
                    ...filtered,
                    {
                        type: 'bot',
                        text: t('chat.loadingSlotsError'),
                        timestamp: new Date(),
                    },
                ];
            });
        }
    };

    // Handle slot click - start booking flow
    const handleBookSlot = (slot: BookingData['slots'][0], serviceName: string, serviceId?: string) => {
        console.log('📝 handleBookSlot called with:', { slot, serviceName, serviceId });

        const slotDate = new Date(slot.datetime);
        const dateStr = slotDate.toISOString().split('T')[0];
        const timeStr = slotDate.toTimeString().slice(0, 5);

        if (!dateStr || !timeStr) {
            console.error('Invalid date/time');
            return;
        }

        const formData: BookingFormData = {
            serviceName,
            serviceId: serviceId,
            date: dateStr,
            time: timeStr,
            branchName: slot.branchName,
            branchId: slot.branchId,
            price: slot.price,
        };

        console.log('📋 Form data prepared:', formData);
        setBookingFormData(formData);

        // If user is logged in, skip asking for info and redirect directly
        if (user) {
            console.log('👤 User is logged in, skipping info collection');
            const params = new URLSearchParams();
            params.set('service', serviceId || serviceName);
            params.set('branch', slot.branchId || slot.branchName);
            params.set('date', dateStr);
            params.set('time', timeStr);
            if (user.name) params.set('name', user.name);
            params.set('phone', '');
            params.set('email', user.email);
            params.set('source', 'chat-booking');
            params.set('ai_suggested', 'false');

            console.log('🔗 Redirect URL params:', params.toString());

            setMessages((prev) => [
                ...prev,
                {
                    type: 'bot',
                    text: t('chat.redirectingToBooking'),
                    timestamp: new Date(),
                },
            ]);

            setTimeout(() => {
                navigate(`/booking?${params.toString()}`);
            }, 800);

            setBookingStep('completed');
            return;
        }

        // Bot asks for name
        const datetime = slotDate.toLocaleString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

        setMessages((prev) => [
            ...prev,
            {
                type: 'bot',
                text: t('chat.slotConfirmed', { serviceName, datetime, branchName: slot.branchName }),
                timestamp: new Date(),
            },
        ]);

        setBookingStep('ask_name');
        setIsWaitingForInput(true);
    };

    // Handle user input during booking flow
    const handleUserInput = (text: string) => {
        if (!isWaitingForInput) return;

        // Add user message
        setMessages((prev) => [
            ...prev,
            {
                type: 'user',
                text,
                timestamp: new Date(),
            },
        ]);

        switch (bookingStep) {
            case 'ask_name':
                handleNameInput(text);
                break;
            case 'ask_phone':
                handlePhoneInput(text);
                break;
            case 'ask_email':
                handleEmailInput(text);
                break;
            default:
                break;
        }
    };

    const handleNameInput = (name: string) => {
        if (name.trim().length < 2) {
            setMessages((prev) => [
                ...prev,
                {
                    type: 'bot',
                    text: t('chat.nameTooShort'),
                    timestamp: new Date(),
                },
            ]);
            return;
        }

        setBookingFormData((prev) => ({ ...prev, customerName: name.trim() }));

        setMessages((prev) => [
            ...prev,
            {
                type: 'bot',
                text: t('chat.thankYouName', { name }),
                timestamp: new Date(),
            },
        ]);

        setBookingStep('ask_phone');
    };

    const handlePhoneInput = (phone: string) => {
        // Simple phone validation
        const phoneRegex = /^[0-9+\s()-]{8,15}$/;
        if (!phoneRegex.test(phone.trim())) {
            setMessages((prev) => [
                ...prev,
                {
                    type: 'bot',
                    text: t('chat.phoneInvalid'),
                    timestamp: new Date(),
                },
            ]);
            return;
        }

        setBookingFormData((prev) => ({ ...prev, customerPhone: phone.trim() }));

        setMessages((prev) => [
            ...prev,
            {
                type: 'bot',
                text: t('chat.askEmail'),
                timestamp: new Date(),
            },
        ]);

        setBookingStep('ask_email');
    };

    const handleEmailInput = (email: string) => {
        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setMessages((prev) => [
                ...prev,
                {
                    type: 'bot',
                    text: t('chat.emailInvalid'),
                    timestamp: new Date(),
                },
            ]);
            return;
        }

        const updatedFormData = { ...bookingFormData, customerEmail: email.trim() };
        setBookingFormData(updatedFormData);

        // Show confirmation
        const formData = updatedFormData as BookingFormData;
        const datetime = new Date(`${formData.date}T${formData.time}`).toLocaleString(
            i18n.language === 'vi' ? 'vi-VN' : 'en-US',
            {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            },
        );

        const confirmationText = `${t('chat.confirmationTitle')}

👤 ${t('bookings.name')}: ${formData.customerName}
📞 ${t('bookings.phone')}: ${formData.customerPhone}
📧 ${t('bookings.email')}: ${formData.customerEmail}

💆 ${t('bookings.service')}: ${formData.serviceName}
📅 ${t('bookings.time')}: ${datetime}
📍 ${t('bookings.branch')}: ${formData.branchName}
💰 ${t('bookings.price')}: ${formatPrice(formData.price)}

${i18n.language === 'vi' ? 'Nhấn nút bên dưới để hoàn tất đặt lịch!' : 'Click the button below to complete booking!'}`;

        setMessages((prev) => [
            ...prev,
            {
                type: 'bot',
                text: confirmationText,
                timestamp: new Date(),
                actions: [
                    {
                        type: 'confirm_booking',
                        label: t('chat.confirmBookingButton'),
                        action: 'confirm_and_redirect',
                    },
                    {
                        type: 'button',
                        label: t('chat.editInfoButton'),
                        action: 'edit_booking',
                    },
                ],
            },
        ]);

        setBookingStep('confirmation');
        setIsWaitingForInput(false);
    };

    const handleAction = (action: {
        type: string;
        action: string;
        data?: Record<string, string | number | boolean | undefined>;
    }) => {
        // Handle service selection
        if (action.action.startsWith('select_service_')) {
            const { serviceId, serviceName, price } = action.data || {};
            if (serviceId && serviceName && price) {
                handleServiceSelection(serviceId as string, serviceName as string, price as number);
            }
            return;
        }

        // Handle booking actions
        if (action.action === 'confirm_and_redirect') {
            handleConfirmBooking();
        } else if (action.action === 'edit_booking') {
            handleEditBooking();
        }
    };

    const handleConfirmBooking = () => {
        const formData = bookingFormData as BookingFormData;

        // Build URL params
        const params = new URLSearchParams({
            service: formData.serviceId || formData.serviceName,
            branch: formData.branchId || formData.branchName,
            date: formData.date,
            time: formData.time,
            name: formData.customerName || '',
            phone: formData.customerPhone || '',
            email: formData.customerEmail || '',
            source: 'chat-booking',
            ai_suggested: 'false',
        });

        setMessages((prev) => [
            ...prev,
            {
                type: 'bot',
                text: t('chat.redirectingToBooking'),
                timestamp: new Date(),
            },
        ]);

        // Navigate to booking page
        setTimeout(() => {
            navigate(`/booking?${params.toString()}`);
        }, 800);

        setBookingStep('completed');
    };

    const handleEditBooking = () => {
        setMessages((prev) => [
            ...prev,
            {
                type: 'bot',
                text: t('chat.askName'),
                timestamp: new Date(),
            },
        ]);

        setBookingStep('ask_name');
        setIsWaitingForInput(true);
    };

    if (!isActive) return null;

    const shouldShowInput = bookingStep !== 'slot_selection' && bookingStep !== 'completed' && isWaitingForInput;

    return (
        <div className='flex flex-col h-full'>
            <div className='px-4 py-2 bg-green-50 border-b border-green-200'>
                <p className='text-xs text-center font-medium text-gray-700'>
                    {bookingStep === 'service_selection' && t('chat.step1')}
                    {bookingStep === 'slot_selection' && t('chat.step2')}
                    {bookingStep === 'ask_name' && t('chat.step3')}
                    {bookingStep === 'ask_phone' && t('chat.step4')}
                    {bookingStep === 'ask_email' && t('chat.step5')}
                    {bookingStep === 'confirmation' && t('chat.stepConfirmation')}
                </p>
            </div>
            <MessageList messages={messages} onBookSlot={handleBookSlot} onAction={handleAction} />
            {shouldShowInput && (
                <ChatInput
                    onSend={handleUserInput}
                    placeholder={
                        bookingStep === 'ask_name'
                            ? t('chat.namePlaceholder')
                            : bookingStep === 'ask_phone'
                            ? t('chat.phonePlaceholder')
                            : bookingStep === 'ask_email'
                            ? t('chat.emailPlaceholder')
                            : t('chat.placeholder')
                    }
                    hideOptions
                />
            )}
        </div>
    );
}
