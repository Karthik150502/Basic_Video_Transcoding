import multer from "multer";
import { randomUUID } from "crypto";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = randomUUID() + ".mp4"
        cb(null, "video" + '-' + uniqueSuffix)
    }
})
export const upload = multer({ dest: './public/uploads', storage });
export const PAGE_SIZE = 2 * 1000000;



