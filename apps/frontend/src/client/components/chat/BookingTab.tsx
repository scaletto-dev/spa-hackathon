/**
 * BookingTab - Quick booking interface
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Message, BookingData } from './types';
import { MessageList } from './MessageList';
import { toast } from '../../../utils/toast';

interface BookingTabProps {
    isActive: boolean;
}

export function BookingTab({ isActive }: BookingTabProps) {
    const { t } = useTranslation('common');

    const [messages, setMessages] = useState<Message[]>(() => {
        const mockBooking: BookingData = {
            serviceName: 'HydraFacial Treatment',
            slots: [
                {
                    datetime: '2025-10-31T14:00:00Z',
                    branchName: 'Downtown Spa',
                    price: 150,
                },
                {
                    datetime: '2025-10-31T15:30:00Z',
                    branchName: 'Downtown Spa',
                    price: 150,
                },
                {
                    datetime: '2025-11-01T10:00:00Z',
                    branchName: 'Westside Spa',
                    price: 150,
                },
            ],
        };

        return [
            {
                type: 'bot',
                text: t('chat.availableSlots'),
                timestamp: new Date(),
                bookingData: mockBooking,
            },
        ];
    });

    const handleBookSlot = (slot: BookingData['slots'][0], serviceName: string) => {
        // TODO: Call API POST /api/v1/ai/chat/quick-book
        toast.success(t('chat.bookingConfirmed'));

        setMessages((prev) => [
            ...prev,
            {
                type: 'system',
                text: t('chat.bookingSuccess', {
                    service: serviceName,
                    time: new Date(slot.datetime).toLocaleString(),
                }),
                timestamp: new Date(),
            },
        ]);
    };

    if (!isActive) return null;

    return (
        <div className='flex flex-col h-full'>
            <div className='px-4 py-2 bg-green-50 border-b border-green-200'>
                <p className='text-xs text-center font-medium text-gray-700'>{t('chat.selectSlotToBook')}</p>
            </div>
            <MessageList messages={messages} onBookSlot={handleBookSlot} />
        </div>
    );
}
