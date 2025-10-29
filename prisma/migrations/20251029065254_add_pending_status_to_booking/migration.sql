-- AlterEnum: Add PENDING value to BookingStatus enum
-- PostgreSQL requires this to be done in a separate transaction
DO $$ 
BEGIN
  -- Add the new enum value if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'PENDING' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'BookingStatus')) THEN
    ALTER TYPE "BookingStatus" ADD VALUE 'PENDING' BEFORE 'CONFIRMED';
  END IF;
END $$;

-- AlterTable: Change default status to PENDING
ALTER TABLE "Booking" ALTER COLUMN "status" SET DEFAULT 'PENDING'::"BookingStatus";
