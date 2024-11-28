import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../lib/config";
import { JwtPayload } from "../types";
import prisma from "../db";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {

    let tokenString = req.headers.authorization;

    if (!tokenString) {
        res.json({
            status: 403,
            message: "Unauthorized"
        })
        return;
    }

    const token = tokenString?.split(" ")[1]
    let jwtPayload: JwtPayload;
    try {
        jwtPayload = jwt.verify(token, JWT_SECRET) as JwtPayload;
        req.user = jwtPayload;
        next()
    } catch {
        res.json({
            status: 403,
            message: "Unauthorized"
        })
        return;
    }


}



