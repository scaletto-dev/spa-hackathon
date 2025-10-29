/**
 * Reference Number Generator
 *
 * Generates unique booking reference numbers in format: BC-YYYYMMDD-XXXX
 * BC = Beauty Clinic
 * YYYYMMDD = Date
 * XXXX = Random alphanumeric (4 chars)
 */

export class ReferenceNumberGenerator {
   /**
    * Generate a unique booking reference number
    *
    * @param date - Date object for the booking
    * @returns Reference number in format BC-YYYYMMDD-XXXX
    */
   static generate(date: Date = new Date()): string {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateStr = `${year}${month}${day}`;

      // Generate 4-character random alphanumeric code
      const randomCode = this.generateRandomCode(4);

      return `BC-${dateStr}-${randomCode}`;
   }

   /**
    * Generate random alphanumeric code
    *
    * @param length - Length of the code
    * @returns Random alphanumeric string
    */
   private static generateRandomCode(length: number): string {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let result = "";

      for (let i = 0; i < length; i++) {
         const randomIndex = Math.floor(Math.random() * characters.length);
         result += characters.charAt(randomIndex);
      }

      return result;
   }

   /**
    * Validate reference number format
    *
    * @param referenceNumber - Reference number to validate
    * @returns True if valid format
    */
   static isValid(referenceNumber: string): boolean {
      const regex = /^BC-\d{8}-[A-Z0-9]{4}$/;
      return regex.test(referenceNumber);
   }
}

export default ReferenceNumberGenerator;

