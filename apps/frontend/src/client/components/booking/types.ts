// Booking flow types

export interface Branch {
    id: number;
    name: string;
    image: string;
    address: string;
    phone: string;
    hours: string;
}

export interface Service {
    id: number;
    title: string;
    category: string;
    price: string; // Format: "$150"
    duration: string;
    image: string;
    description?: string;
}

export interface Therapist {
    id: number;
    name: string;
    specialty: string;
    rating: number | null;
    recommended: boolean;
}

export interface BookingData {
    service?: Service | null;
    branch?: Branch | null;
    therapist?: Therapist | string | null;
    date?: string | null;
    time?: string | null;
    duration?: string;
    name?: string;
    email?: string;
    phone?: string;
    notes?: string;
    useAI?: boolean;
    paymentMethod?: string | null;
    promoCode?: string | null;
}

export interface BookingStepProps {
    bookingData: BookingData;
    updateBookingData: (data: Partial<BookingData>) => void;
    onNext: () => void;
    onPrev: () => void;
}

export interface BookingConfirmationProps {
    bookingData: BookingData;
    onPrev: () => void;
}
