import { config } from "dotenv"


config();

export const PORT = process.env.PORT as string || 8000;
export const DATABASE_URL = process.env.DATABASE_URL!;

export const JWT_SECRET = process.env.JWT_SECRET!


export const AWS_ACCESS = process.env.AWS_S3_ACCESS_KEY!
export const AWS_SECRET = process.env.AWS_S3_SECRET_ACCESS_KEY!

export const AWS_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!
export const AWS_REGION_NAME = process.env.AWS_S3_REGION_NAME!

