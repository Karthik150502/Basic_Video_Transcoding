/*
  Warnings:

  - Added the required column `thubmnail_url` to the `VideoResolution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VideoResolution" ADD COLUMN     "thubmnail_url" TEXT NOT NULL;
