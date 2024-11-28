import { Request, Response, Router } from "express";
import prisma from "../db/index";
import jwt from "jsonwebtoken";
import { hash, compare } from "bcryptjs";
import { JWT_SECRET } from "../lib/config";



const app = Router();
app.post("/signup", async (req: Request, res: Response) => {
    // TODO:  Validation - email username, password.
    let { email, password, username } = req.body;

    let users = await prisma.user.findMany({
        where: {
            OR: [
                { email: email },
                { username: username }
            ]
        }
    })


    if (users.length > 0) {
        res.json({
            status: 409,
            message: "User already exists, try other email/ username"
        });
        return;
    }


    const hashedPassword = await hash(password, 10);
    await prisma.user.create({
        data: {
            email, username, password: hashedPassword
        }
    })

    res.json({
        status: 201,
        message: "User has been succesfully created"
    });
    return;

})


app.post("/signin", async (req: Request, res: Response) => {


    let { password, email } = req.body;

    let user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!user) {
        res.json({
            status: 401,
            message: "User does not exist, check the email."
        })
        return;
    }

    let pwdCompare = compare(password, user.password);
    if (!pwdCompare) {
        res.json({
            status: 401,
            message: "User password incorrect"
        })
        return;
    }

    let jwtToken = jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, JWT_SECRET)


    res.setHeader("authentication", jwtToken);
    res.setHeader("httpOnly", "secure");
    res.setHeader("sameSite", "strict");

    res.json({
        access_token: jwtToken,
        user: {
            id: user.id,
            email: user.email,
            username: user.username
        }
    })
    return;
})



export default app;

