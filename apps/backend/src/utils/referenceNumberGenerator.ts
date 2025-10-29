/**
 * Booking Reference Number Generator
 *
 * Generates unique booking reference numbers in format:
 * BC-YYYYMMDD-XXXX
 *
 * BC = Beauty Clinic prefix
 * YYYYMMDD = Booking date
 * XXXX = Random 4-digit number
 */

class ReferenceNumberGenerator {
   /**
    * Generate a unique reference number
    * @param appointmentDate - The appointment date
    * @returns Reference number string (e.g., BC-20231125-1234)
    */
   generate(appointmentDate: Date): string {
      const dateStr = this.formatDate(appointmentDate);
      const randomNum = this.generateRandomNumber();
      return `BC-${dateStr}-${randomNum}`;
   }

   /**
    * Validate reference number format
    * @param referenceNumber - The reference number to validate
    * @returns True if valid format
    */
   isValid(referenceNumber: string): boolean {
      const pattern = /^BC-\d{8}-\d{4}$/;
      return pattern.test(referenceNumber);
   }

   /**
    * Format date to YYYYMMDD
    */
   private formatDate(date: Date): string {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}${month}${day}`;
   }

   /**
    * Generate random 4-digit number
    */
   private generateRandomNumber(): string {
      const num = Math.floor(Math.random() * 10000);
      return String(num).padStart(4, "0");
   }
}

export default new ReferenceNumberGenerator();
