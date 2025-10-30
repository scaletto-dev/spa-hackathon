-- AlterEnum
ALTER TYPE "BookingStatus" ADD VALUE 'PENDING';

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "benefits" TEXT[],
ADD COLUMN     "longDescription" TEXT;
