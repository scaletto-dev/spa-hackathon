// Booking flow types

export interface Branch {
    id: string;
    name: string;
    address: string;
    phone: string;
    slug?: string;
    email?: string;
    operatingHours?: {
        dayOfWeek: number;
        openTime: string;
        closeTime: string;
    }[];
}

export interface Service {
    id: string;
    name: string;
    categoryName: string;
    price: number;
    duration: string;
    images: string[];
    excerpt?: string;
}

export interface Therapist {
    id: number;
    name: string;
    specialty: string;
    rating: number | null;
    recommended: boolean;
}

export interface BookingData {
    serviceIds?: string[];
    service?: Service | null;
    selectedServices?: Service[]; // Array of all selected services
    branch?: Branch | null;
    therapist?: Therapist | string | null;
    date?: string | null;
    time?: string | null;
    duration?: string;
    name?: string;
    email?: string;
    phone?: string;
    notes?: string;
    isLoggedIn?: boolean;
    otpVerified?: boolean;
    useAI?: boolean;
    paymentMethod?: string | null;
    promoCode?: string | null;
    paymentDetailsComplete?: boolean;
    subtotalAmount?: number; // Price before tax
    taxAmount?: number; // Tax (8%)
    totalAmount?: number; // Total price including tax
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
    onSubmit?: () => void;
}
