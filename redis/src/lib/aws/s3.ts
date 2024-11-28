import { ReadStream } from "fs"

export type S3FileParams = {
    Key: string,    // File path in S3
    Body: ReadStream,
    ContentType: string,       // Set proper MIME type
}


export type S3ImageParams = {
    Key: string,
    Body: Buffer,
}

export type GetFileType = {
    Bucket: string,
    Key: string
}

export abstract class S3 {
    public static uploadObject(): void { }
    public static deletObject(): void { }
    public static getUrl() { }
    public static downloadFromS3(): void { }
}