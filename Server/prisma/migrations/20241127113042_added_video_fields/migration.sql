-- CreateEnum
CREATE TYPE "ProcessingStatus" AS ENUM ('PROCESSING', 'TRANSCODED');

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "processing_status" "ProcessingStatus" NOT NULL DEFAULT 'PROCESSING',
ADD COLUMN     "qualities" TEXT[];
