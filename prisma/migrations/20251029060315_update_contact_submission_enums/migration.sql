/*
  Warnings:

  - The values [NEW] on the enum `ContactStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [GENERAL,BOOKING_INQUIRY,COMPLAINT] on the enum `MessageType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ContactStatus_new" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED');
ALTER TABLE "public"."ContactSubmission" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ContactSubmission" ALTER COLUMN "status" TYPE "ContactStatus_new" USING ("status"::text::"ContactStatus_new");
ALTER TYPE "ContactStatus" RENAME TO "ContactStatus_old";
ALTER TYPE "ContactStatus_new" RENAME TO "ContactStatus";
DROP TYPE "public"."ContactStatus_old";
ALTER TABLE "ContactSubmission" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "MessageType_new" AS ENUM ('GENERAL_INQUIRY', 'SERVICE_QUESTION', 'BOOKING_ASSISTANCE', 'FEEDBACK', 'OTHER');
ALTER TABLE "ContactSubmission" ALTER COLUMN "messageType" TYPE "MessageType_new" USING ("messageType"::text::"MessageType_new");
ALTER TYPE "MessageType" RENAME TO "MessageType_old";
ALTER TYPE "MessageType_new" RENAME TO "MessageType";
DROP TYPE "public"."MessageType_old";
COMMIT;

-- AlterTable
ALTER TABLE "ContactSubmission" ALTER COLUMN "status" SET DEFAULT 'PENDING';
