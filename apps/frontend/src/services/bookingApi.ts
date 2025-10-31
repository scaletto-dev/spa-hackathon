import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/v1';

export interface FeaturedService {
  id: string;
  name: string;
  categoryName: string;
  images: string[];
  duration: string; // "90 min" format
  price: number;
  excerpt: string;
}

export interface Branch {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  email?: string;
  images?: string[];
  operatingHours?: {
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
  }[];
}

export interface CreateBookingPayload {
  serviceIds: string[];
  branchId: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:mm
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  notes?: string;
  userId?: string; // For authenticated users
  language: string;
  paymentType?: 'ATM' | 'CLINIC' | 'WALLET' | 'CASH' | 'BANK_TRANSFER';
  paymentAmount?: number; // Total amount in VND
}

export interface BookingResponse {
  id: string;
  referenceNumber: string;
  status: string;
  appointmentDate: string;
  appointmentTime: string;
  totalPrice: number;
}

export interface OTPVerificationPayload {
  email: string;
  otp: string;
}

// Get featured services for step 1
export const getFeaturedServices = async (): Promise<FeaturedService[]> => {
  try {
    const response = await axios.get(`${API_BASE}/services?featured=true`);
    return response.data.data || [];
  } catch (error) {
    console.error('Failed to fetch featured services:', error);
    throw error;
  }
};

// Get all branches for step 2
export const getBranches = async (): Promise<Branch[]> => {
  try {
    const response = await axios.get(`${API_BASE}/branches`);
    return response.data.data || [];
  } catch (error) {
    console.error('Failed to fetch branches:', error);
    throw error;
  }
};

// Get branch details including operating hours
export const getBranchById = async (branchId: string): Promise<Branch> => {
  try {
    const response = await axios.get(`${API_BASE}/branches/${branchId}`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch branch details:', error);
    throw error;
  }
};

// Verify OTP for step 5
export const verifyOTP = async (payload: OTPVerificationPayload): Promise<{ valid: boolean }> => {
  try {
    const response = await axios.post(`${API_BASE}/bookings/verify-otp`, payload);
    return response.data.data || { valid: false };
  } catch (error) {
    console.error('Failed to verify OTP:', error);
    throw error;
  }
};

// Send OTP to email
export const sendOTP = async (email: string): Promise<{ sent: boolean }> => {
  try {
    const response = await axios.post(`${API_BASE}/bookings/send-otp`, { email });
    return response.data.data || { sent: false };
  } catch (error) {
    console.error('Failed to send OTP:', error);
    throw error;
  }
};

// Create booking for step 6
export const createBooking = async (payload: CreateBookingPayload): Promise<BookingResponse> => {
  try {
    const response = await axios.post(`${API_BASE}/bookings`, payload);
    return response.data.data;
  } catch (error) {
    console.error('Failed to create booking:', error);
    throw error;
  }
};

// Send booking confirmation email
export const sendBookingConfirmationEmail = async (bookingId: string, email: string): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE}/bookings/${bookingId}/send-confirmation`, { email });
    return response.data;
  } catch (error) {
    console.error('Failed to send booking confirmation email:', error);
    throw error;
  }
};

// Get booking by reference number (for confirmation page)
export const getBookingByReference = async (referenceNumber: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE}/bookings/${referenceNumber}`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch booking:', error);
    throw error;
  }
};

// ============= Payment API =============

export interface PaymentResponse {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  paymentType: string;
  status: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

// Create payment for a booking
export const createPayment = async (
  bookingId: string,
  amount: number,
  paymentType: string,
  notes?: string
): Promise<PaymentResponse> => {
  try {
    const response = await axios.post(`${API_BASE}/payments`, {
      bookingId,
      amount,
      paymentType,
      notes,
    });
    return response.data.data;
  } catch (error) {
    console.error('Failed to create payment:', error);
    throw error;
  }
};

// Get payment by ID
export const getPaymentById = async (paymentId: string): Promise<PaymentResponse> => {
  try {
    const response = await axios.get(`${API_BASE}/payments/${paymentId}`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch payment:', error);
    throw error;
  }
};

// Get all payments for a booking
export const getPaymentsByBooking = async (bookingId: string): Promise<PaymentResponse[]> => {
  try {
    const response = await axios.get(`${API_BASE}/payments/bookings/${bookingId}`);
    return response.data.data || [];
  } catch (error) {
    console.error('Failed to fetch payments:', error);
    throw error;
  }
};

// Update payment status (for payment gateway callbacks)
export const updatePaymentStatus = async (
  paymentId: string,
  status: string,
  transactionId?: string
): Promise<PaymentResponse> => {
  try {
    const response = await axios.patch(`${API_BASE}/payments/${paymentId}/status`, {
      status,
      transactionId,
    });
    return response.data.data;
  } catch (error) {
    console.error('Failed to update payment status:', error);
    throw error;
  }
};

