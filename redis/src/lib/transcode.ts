import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import { AWS_BUCKET_NAME } from "./config";
import { S3Handler } from "./aws/s3-main";
import { randomUUID } from "crypto"
import prisma from "../db";
import { Video } from "@prisma/client";
import { ProcessingStatus } from "@prisma/client";
enum TranscodingResolutions {
    SEVEN_TWENTY = "720",
    FOUR_EIGHTY = "480",
    TWO_FORTY = "240"
}

export async function downloadAndTranscode(s3Key: string, videoId: string) {
    // Download from aws s3;
    // Put in the uploads folder.

    const localfilePath = (`./public/uploads/${new Date().getTime() + Math.floor(Math.random() * 1000)}.mp4`);
    try {
        // Create a writable stream to store the file locally
        const fileStream = fs.createWriteStream(localfilePath);
        // Get the object from S3
        const params = {
            Bucket: AWS_BUCKET_NAME,
            Key: s3Key,
        };

        console.log(`Starting download: ${s3Key} from bucket: ${AWS_BUCKET_NAME}`);
        const s3Stream = await S3Handler.getObjectStream(params);


        // Pipe S3 stream to local file
        s3Stream.pipe(fileStream);

        s3Stream.on('error', (err) => {
            console.error('Error downloading file:', err);
            cleanFile(localfilePath) // Clean file if there is some error.
        });


        let video = await prisma.video.findUnique({
            where: {
                id: videoId
            }
        })

        fileStream.on('finish', async () => {
            console.log(`File downloaded successfully to ${localfilePath} `);

            try {
                await transcodeVideo(localfilePath, TranscodingResolutions.TWO_FORTY, videoId);
                await transcodeVideo(localfilePath, TranscodingResolutions.FOUR_EIGHTY, videoId);
                await transcodeVideo(localfilePath, TranscodingResolutions.SEVEN_TWENTY, videoId);
                await prisma.video.update({
                    where: {
                        id: videoId
                    },
                    data: {
                        processing_status: ProcessingStatus.TRANSCODED
                    }
                })
                console.log("Video record - row updated.")
            } catch (e) {
                console.log("Error occured while transcoding: ", e);
                cleanFile(localfilePath) // Cleanup if there's an error while transcoding.
            }
            getThumbnail(localfilePath, videoId).then((res) => {
                console.log("Thumbnail result = ", res)
            }).catch(error => {
                console.log("Thumbnail error = ", error)
            });
        });
    } catch (error) {
        console.error('Error:', error);
    }



}




export async function uploadToS3AndUpdateDb(localPath: string, fileSuffix: string, resolution: string, videoId: string) {
    const fileStream = fs.createReadStream(localPath);
    const params = {
        Key: `ytdev_video/${fileSuffix}`,    // File path in S3
        Body: fileStream,
        ContentType: "video/mp4",       // Set proper MIME type
    };
    let url = await S3Handler.uploadObject(params);
    cleanFile(localPath);
    await prisma.videoResolution.create({
        data: {
            video_id: videoId,
            resolution: resolution,
            thumbnail_url: url
        }
    })
    return url;
}
export async function uploadToS3ThumbnailAndUpdateDb(localPath: string, fileSuffix: string, videoId: string) {
    const fileStream = fs.readFileSync(localPath);

    const params = {
        Key: `ytdev_thumbnail/${fileSuffix}`,    // File path in S3
        Body: fileStream,
    };
    let url = await S3Handler.uploadObjectImage(params);
    await prisma.video.update({
        where: {
            id: videoId
        },
        data: {
            thubmnail_url: url
        }
    })
    return url;
}

export async function getThumbnail(localfilePath: string, videoId: string) {
    return new Promise((res, rej) => {
        const thumbnail_filename = (`${new Date().getTime() + Math.floor(Math.random() * 1000)}-720p.png`);
        ffmpeg(localfilePath)
            .screenshots({
                timestamps: ['10%'],
                folder: "./public/uploads_thumbnail",
                filename: thumbnail_filename,
                size: "240x?",
            }).on('error', (err) => {
                console.log("Error occured while thumbnail screnshotting: ", err);
                rej("Error occured while thumbnail screnshotting: " + err);
            }).on('end', async () => {
                const fileUniqueSuffix = `thumbnail-${videoId}`
                await uploadToS3ThumbnailAndUpdateDb(localfilePath, fileUniqueSuffix, videoId);
                cleanFile("./public/uploads_thumbnail/" + thumbnail_filename);
                res(`Cleared ${thumbnail_filename}`);
            })
    })
}




export async function transcodeVideo(localfilePath: string, resolution: TranscodingResolutions, videoId: string) {
    // Get the video, and transcode, and get the screenshot for thumbnail and upload to s3.
    const localfilePathTranscoded = (`./public/uploads/${new Date().getTime() + Math.floor(Math.random() * 1000)}-${resolution}p.mp4`);
    return new Promise((res, rej) => {
        ffmpeg(localfilePath)
            .videoCodec('libx264')
            .audioCodec('libmp3lame')
            .size(`${resolution}x?`)
            .on('error', (err) => {
                rej("Error occured while transcoding: " + err);
            }).on('end', async () => {
                console.log(`Transcoding complete to ${resolution}p`);
                const fileUniqueSuffix = `video-${randomUUID()}-${resolution}.mp4`
                uploadToS3AndUpdateDb(localfilePathTranscoded, fileUniqueSuffix, resolution, videoId)
                res(localfilePathTranscoded);
            }).save(localfilePathTranscoded)
    })
}


export function cleanFile(path: string) {
    fs.unlinkSync(path);
}