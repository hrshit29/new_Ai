import { Queue } from 'bullmq';
import { getRedisClient } from '../config/redis';

export interface GenerationJobData {
  assignmentId: string;
  subject: string;
  grade: string;
  numberOfQuestions: number;
  totalMarks: number;
  questionTypes: string[];
  instructions: string;
}

let generationQueue: Queue | null = null;

export function getGenerationQueue(): Queue {
  if (!generationQueue) {
    generationQueue = new Queue('question-generation', {
      connection: getRedisClient(),
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

export async function enqueueGenerationJob(
  data: GenerationJobData
): Promise<string> {
  const queue = getGenerationQueue();
  const job = await queue.add('generate', data, {
    jobId: `gen-${data.assignmentId}`,
  });
  return job.id ?? data.assignmentId;
}