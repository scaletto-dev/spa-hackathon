describe('Authentication Validation', () => {
  describe('Email validation', () => {
    it('should accept valid email addresses', () => {
      const validEmails = [
        'user@example.com',
        'test.user@domain.co',
        'admin+test@company.vn'
      ];

      validEmails.forEach(email => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        expect(isValid).toBe(true);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user@.com'
      ];

      invalidEmails.forEach(email => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        expect(isValid).toBe(false);
      });
    });
  });

  describe('Password validation', () => {
    it('should accept strong passwords', () => {
      const strongPasswords = [
        'SecurePass123!',
        'MyP@ssw0rd',
        'C0mpl3x!Pass'
      ];

      strongPasswords.forEach(password => {
        // At least 8 chars, contains letter, number
        const isValid = password.length >= 8 && 
                       /[A-Za-z]/.test(password) && 
                       /[0-9]/.test(password);
        expect(isValid).toBe(true);
      });
    });

    it('should reject weak passwords', () => {
      const weakPasswords = [
        'short',           // Too short
        '12345678',        // No letters
        'password',        // No numbers
        'pass'             // Too short and no numbers
      ];

      weakPasswords.forEach(password => {
        const isValid = password.length >= 8 && 
                       /[A-Za-z]/.test(password) && 
                       /[0-9]/.test(password);
        expect(isValid).toBe(false);
      });
    });
  });

  describe('Phone number validation', () => {
    it('should accept valid Vietnamese phone numbers', () => {
      const validPhones = [
        '0912345678',
        '0987654321',
        '0123456789'
      ];

      validPhones.forEach(phone => {
        const isValid = /^0[0-9]{9}$/.test(phone);
        expect(isValid).toBe(true);
      });
    });

    it('should reject invalid phone numbers', () => {
      const invalidPhones = [
        '123456789',       // Missing leading 0
        '09123456789',     // Too long
        '091234567',       // Too short
        'abcdefghij'       // Not numbers
      ];

      invalidPhones.forEach(phone => {
        const isValid = /^0[0-9]{9}$/.test(phone);
        expect(isValid).toBe(false);
      });
    });
  });
});
