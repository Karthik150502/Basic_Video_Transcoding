
import { config } from "dotenv"
config();

export const AWS_ACCESS = process.env.AWS_S3_ACCESS_KEY!
export const AWS_SECRET = process.env.AWS_S3_SECRET_ACCESS_KEY!

export const AWS_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!
export const AWS_REGION_NAME = process.env.AWS_S3_REGION_NAME!

