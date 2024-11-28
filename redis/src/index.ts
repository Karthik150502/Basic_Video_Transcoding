import { downloadAndTranscode } from "./lib/transcode";
import { getRedis } from "./redis";



type RedisIncoming = {
    type: string,
    data: {
        fileLocation: string,
        videoId: string
    }
}

export async function processQueue() {
    let redisClient = await getRedis();
    while (true) {
        // Listen for new tasks in the Redis list (queue)
        const message = await redisClient.brPop('task_q', 0);
        const { data } = JSON.parse(message?.element!) as RedisIncoming;
        console.log("Data br Popped processQueue = ", data)
        await downloadAndTranscode(data.fileLocation, data.videoId)
    }
}


processQueue().catch((error) => console.error('Error processing queue:', error));