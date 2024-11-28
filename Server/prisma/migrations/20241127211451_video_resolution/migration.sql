/*
  Warnings:

  - You are about to drop the column `bitrate` on the `VideoResolution` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `VideoResolution` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `VideoResolution` table. All the data in the column will be lost.
  - Added the required column `resolution` to the `VideoResolution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VideoResolution" DROP COLUMN "bitrate",
DROP COLUMN "height",
DROP COLUMN "width",
ADD COLUMN     "resolution" INTEGER NOT NULL;
