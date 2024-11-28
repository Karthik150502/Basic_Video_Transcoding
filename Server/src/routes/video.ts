import { Request, Response, Router } from "express";
import prisma from "../db/index";
import { authMiddleware } from "../middlewares/auth";
import { PAGE_SIZE, upload } from "../lib/video_processing";
import { getRedis } from "../redis";
import { S3Handler } from "../lib/aws/s3-main";
import fs from "fs";
const app = Router();



app.post("/upload", authMiddleware, upload.single('file'), async (req: Request, res: Response) => {

    if (!req.file) {
        res.status(400).json({ message: "No file uploaded." })
        return;
    }

    const file = req.file;
    const userId = req.user?.id!
    const { title, description, category } = req.body;

    console.log('Uploaded file:', file);



    const fileStream = fs.createReadStream(file.path);


    const params = {
        Key: `ytdev_video/${file.filename}`,    // File path in S3
        Body: fileStream,
        ContentType: file.mimetype,       // Set proper MIME type
    };


    // Uploading to S3
    await S3Handler.uploadObject(params);

    // Clean up: Remove the file from temporary storage
    fs.unlinkSync(file.path);






    const pages = Math.ceil(file?.size! / PAGE_SIZE)
    const channel = await prisma.channel.findUnique({
        where: {
            owner_id: userId
        }
    });
    if (!channel) {
        res.json({
            status: 404,
            message: "You don't have a channel, kindly create a channel first."
        })
        return;
    }

    let video = await prisma.video.create({
        data: {
            title,
            description,
            category,
            thubmnail_url: ``,
            total_pages: pages,
            channel_id: channel.id
        }
    })



    const redisC = await getRedis();
    // Send the AWS url to the redis for transcoding
    await redisC.lPush('task_q', JSON.stringify({
        type: 'upload-video',
        data: {
            fileLocation: params.Key,
            videoId: video.id
        }
    }));


    res.json({
        id: video.id,
        title: video.title,
        processing_status: video.processing_status,
        qualities: ["240p", "480p", "720p"]
    })
    return;

})

app.get("/:videoId", authMiddleware, async (req: Request, res: Response) => {


    let { videoId } = req.params;

    let video = await prisma.video.findUnique({
        where: {
            id: videoId
        },
        select: {
            title: true,
            description: true,
            thubmnail_url: true,
            processing_status: true,
            view_count: true,
            channel: {
                select: {
                    name: true,
                    description: true,
                    owner: {
                        select: {
                            email: true,
                            username: true
                        }
                    }
                }
            },
            VideoResolution: {
                select: {
                    resolution: true,
                    thumbnail_url: true
                }
            }
        }
    });

    if (!video) {
        res.json({
            status: 404,
            message: "The video you are looking for doe not exist"
        })
        return;
    }

    res.json({
        id: video?.id,
        title: video?.title,
        description: video?.description,
        creator: {
            id: video?.channel.owner.id,
            username: video?.channel.owner.username
        },
        video: {
            ...video
        }
    })
    return
})




export default app;
