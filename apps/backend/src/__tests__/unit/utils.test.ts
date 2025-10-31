describe('Utility Functions', () => {
  describe('Date formatting', () => {
    it('should format date to ISO string', () => {
      const date = new Date('2025-10-31T10:30:00.000Z');
      const formatted = date.toISOString();
      
      expect(formatted).toBe('2025-10-31T10:30:00.000Z');
    });

    it('should handle invalid dates', () => {
      const invalidDate = new Date('invalid');
      
      expect(isNaN(invalidDate.getTime())).toBe(true);
    });
  });

  describe('Price formatting', () => {
    it('should format price to VND', () => {
      const formatVND = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(amount);
      };

      expect(formatVND(500000)).toContain('500.000');
      expect(formatVND(1000000)).toContain('1.000.000');
    });

    it('should handle zero and negative amounts', () => {
      const formatVND = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(amount);
      };

      expect(formatVND(0)).toContain('0');
      expect(formatVND(-100000)).toContain('-100.000');
    });
  });

  describe('String manipulation', () => {
    it('should generate slug from Vietnamese text', () => {
      const generateSlug = (text: string) => {
        return text
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[đĐ]/g, 'd')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      };

      expect(generateSlug('Dịch vụ spa')).toBe('dich-vu-spa');
      expect(generateSlug('Massage thư giãn')).toBe('massage-thu-gian');
    });

    it('should sanitize HTML input', () => {
      const sanitize = (input: string) => {
        return input.replace(/<[^>]*>/g, '');
      };

      expect(sanitize('<script>alert("xss")</script>Test')).toBe('Test');
      expect(sanitize('<b>Bold</b> text')).toBe('Bold text');
    });
  });

  describe('Array operations', () => {
    it('should remove duplicates from array', () => {
      const removeDuplicates = <T>(arr: T[]) => {
        return [...new Set(arr)];
      };

      expect(removeDuplicates([1, 2, 2, 3, 3, 4])).toEqual([1, 2, 3, 4]);
      expect(removeDuplicates(['a', 'b', 'b', 'c'])).toEqual(['a', 'b', 'c']);
    });

    it('should chunk array into smaller arrays', () => {
      const chunk = <T>(arr: T[], size: number) => {
        const result: T[][] = [];
        for (let i = 0; i < arr.length; i += size) {
          result.push(arr.slice(i, i + size));
        }
        return result;
      };

      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
      expect(chunk(['a', 'b', 'c'], 1)).toEqual([['a'], ['b'], ['c']]);
    });
  });
});
