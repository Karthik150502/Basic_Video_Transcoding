-- CreateTable
CREATE TABLE "VideoResolution" (
    "id" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "bitrate" INTEGER NOT NULL,

    CONSTRAINT "VideoResolution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VideoResolution_id_key" ON "VideoResolution"("id");

-- AddForeignKey
ALTER TABLE "VideoResolution" ADD CONSTRAINT "VideoResolution_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;
