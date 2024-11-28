import { ReadStream } from "fs"

export type S3FileParams = {
    Key: string,    // File path in S3
    Body: ReadStream,
    ContentType: string,       // Set proper MIME type
}

export abstract class S3 {
    public static uploadObject(): void { }
    public static deletObject(): void { }
    public static getUrl() { }
}