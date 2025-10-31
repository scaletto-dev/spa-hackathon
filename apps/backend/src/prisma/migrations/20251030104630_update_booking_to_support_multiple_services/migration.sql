/*
  Warnings:

  - You are about to drop the column `serviceId` on the `Booking` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Booking" DROP CONSTRAINT "Booking_serviceId_fkey";

-- DropIndex
DROP INDEX "public"."Booking_serviceId_idx";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "serviceId",
ADD COLUMN     "serviceIds" TEXT[];
