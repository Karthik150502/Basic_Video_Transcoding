/*
  Warnings:

  - You are about to drop the column `thubmnail_url` on the `VideoResolution` table. All the data in the column will be lost.
  - Added the required column `thumbnail_url` to the `VideoResolution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VideoResolution" DROP COLUMN "thubmnail_url",
ADD COLUMN     "thumbnail_url" TEXT NOT NULL;
