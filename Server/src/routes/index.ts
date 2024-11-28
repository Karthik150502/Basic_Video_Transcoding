import { Router } from "express";
import authRouter from "./auth"
import channelRouter from "./channel"
import videoRouter from "./video"



const indexRouter = Router();






indexRouter.use("/auth", authRouter);
indexRouter.use("/channel", channelRouter);
indexRouter.use("/vidoes", videoRouter);

export default indexRouter;