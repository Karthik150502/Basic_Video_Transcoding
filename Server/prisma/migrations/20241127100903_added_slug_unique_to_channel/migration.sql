/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.
  - Made the column `slug` on table `Channel` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Channel_name_key";

-- DropIndex
DROP INDEX "Video_id_idx";

-- AlterTable
ALTER TABLE "Channel" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Channel_slug_key" ON "Channel"("slug");

-- CreateIndex
CREATE INDEX "Video_channel_id_idx" ON "Video"("channel_id");
