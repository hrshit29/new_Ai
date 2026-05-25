"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGenerationQueue = getGenerationQueue;
exports.enqueueGenerationJob = enqueueGenerationJob;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
let generationQueue = null;
function getGenerationQueue() {
    if (!generationQueue) {
        generationQueue = new bullmq_1.Queue('question-generation', {
            connection: (0, redis_1.getRedisClient)(),
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
                removeOnComplete: { count: 50 },
                removeOnFail: { count: 20 },
            },
        });
    }
    return generationQueue;
}
async function enqueueGenerationJob(data) {
    const queue = getGenerationQueue();
    const job = await queue.add('generate', data, {
        jobId: `gen-${data.assignmentId}`,
    });
    return job.id ?? data.assignmentId;
}
//# sourceMappingURL=generationQueue.js.map