// Re-export all types from store
export type {
    Service,
    Branch,
    Staff,
    Customer,
    Appointment,
    Review,
    BlogPost,
    Payment,
} from '../store/mockDataStore';

// Common UI types
export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectGroup {
    label: string;
    options: SelectOption[];
}

// Form types
export interface FormErrors {
    [key: string]: string | undefined;
}

// Booking types
export interface BookingData {
    service?: string;
    branch?: string;
    therapist?: string;
    date?: string;
    time?: string;
    name?: string;
    email?: string;
    phone?: string;
    notes?: string;
}

// Payment types
export interface PromoCode {
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
}

export type PaymentMethod = 'card' | 'bank' | 'ewallet' | 'clinic';

// Component Props types
export interface BaseComponentProps {
    className?: string;
    'data-testid'?: string;
}
