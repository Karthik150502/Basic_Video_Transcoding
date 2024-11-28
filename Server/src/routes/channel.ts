import { Request, Response, Router } from "express";
import prisma from "../db/index";
import { authMiddleware } from "../middlewares/auth";



const app = Router();
app.post("/", authMiddleware, async (req: Request, res: Response) => {
    let { name, description, slug } = req.body;


    let userId = req.user?.id!;



    let channel = await prisma.channel.findUnique({
        where: {
            owner_id: userId
        }
    })

    if (channel) {
        res.json({
            status: 411,
            message: "Channel exists for the User."
        })
        return;
    }



    let channelSlug = await prisma.channel.findUnique({
        where: {
            slug
        }
    })


    if (channelSlug) {
        res.json({
            status: 409,
            message: "Slug already exists, try another slug."
        })
        return;
    }


    const response = await prisma.channel.create({
        data: {
            name, description, slug, owner_id: userId
        }
    })


    res.json({
        status: 201,
        message: "Channel created successfully",
        channel: response
    })
    return;

})




export default app;

