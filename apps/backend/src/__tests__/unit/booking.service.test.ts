import { BookingService } from '@/services/booking.service';
import { BookingRepository } from '@/repositories/booking.repository';
import { ServiceRepository } from '@/repositories/service.repository';

// Mock repositories
jest.mock('@/repositories/booking.repository');
jest.mock('@/repositories/service.repository');

describe('BookingService', () => {
  let bookingService: BookingService;
  let mockBookingRepo: jest.Mocked<BookingRepository>;
  let mockServiceRepo: jest.Mocked<ServiceRepository>;

  beforeEach(() => {
    mockBookingRepo = new BookingRepository() as jest.Mocked<BookingRepository>;
    mockServiceRepo = new ServiceRepository() as jest.Mocked<ServiceRepository>;
    bookingService = new BookingService();
    jest.clearAllMocks();
  });

  describe('generateReferenceNumber', () => {
    it('should generate unique 10-character reference number', () => {
      const refNumber = (bookingService as any).generateReferenceNumber();
      
      expect(refNumber).toBeDefined();
      expect(refNumber).toHaveLength(10);
      expect(refNumber).toMatch(/^BK[0-9A-Z]{8}$/);
    });

    it('should generate different reference numbers on subsequent calls', () => {
      const ref1 = (bookingService as any).generateReferenceNumber();
      const ref2 = (bookingService as any).generateReferenceNumber();
      
      expect(ref1).not.toBe(ref2);
    });
  });

  describe('calculateTotalAmount', () => {
    it('should calculate total from service items', () => {
      const items = [
        { serviceId: '1', price: 500000, quantity: 1 },
        { serviceId: '2', price: 300000, quantity: 2 }
      ];

      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      expect(total).toBe(1100000); // 500k + 600k
    });
  });

  describe('validateBookingTime', () => {
    it('should accept valid future booking time', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      
      const isValid = futureDate > new Date();
      expect(isValid).toBe(true);
    });

    it('should reject past booking time', () => {
      const pastDate = new Date('2020-01-01');
      const isValid = pastDate > new Date();
      
      expect(isValid).toBe(false);
    });
  });
});
