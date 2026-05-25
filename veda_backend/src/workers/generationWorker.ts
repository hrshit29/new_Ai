import { Worker, Job } from 'bullmq';
import { Server as SocketIOServer } from 'socket.io';
import { getRedisClient } from '../config/redis';
import { Assignment } from '../models/Assignment';
import { QuestionPaper } from '../models/QuestionPaper';
import { generateQuestionPaper } from '../services/aiService';
import { GenerationJobData } from '../queues/generationQueue';
import { QuestionType } from '../models/Assignment';

let workerInstance: Worker | null = null;

export function createGenerationWorker(io: SocketIOServer): Worker {
  const worker = new Worker(
    'question-generation',
    async (job: Job) => {
      const { assignmentId } = job.data;
      const room = `assignment:${assignmentId}`;

      console.log(`🔄 Processing generation job for assignment: ${assignmentId}`);

      try {
        // 1. Update status → generating
        await Assignment.findByIdAndUpdate(assignmentId, {
          status: 'generating',
          errorMessage: undefined,
        });

        io.to(room).emit('generation:started', { assignmentId });
        await job.updateProgress(10);

        // 2. Generate question paper using AI
        const generated = await generateQuestionPaper({
          subject: job.data.subject,
          grade: job.data.grade,
          numberOfQuestions: job.data.numberOfQuestions,
          totalMarks: job.data.totalMarks,
          questionTypes: job.data.questionTypes as QuestionType[],
          instructions: job.data.instructions,
        });

        await job.updateProgress(70);
        io.to(room).emit('generation:progress', {
          assignmentId,
          progress: 70,
          message: 'Structuring question paper...',
        });

        // 3. Delete any existing paper for this assignment
        await QuestionPaper.deleteOne({ assignmentId });

        // 4. Save the question paper
        const paper = await QuestionPaper.create({
          assignmentId,
          schoolName: 'Delhi Public School, Bokaro Steel City',
          subject: job.data.subject,
          grade: job.data.grade,
          timeAllowed: generated.timeAllowed,
          maxMarks: generated.maxMarks,
          generalInstructions: generated.generalInstructions,
          sections: generated.sections,
          generatedAt: new Date(),
        });

        await job.updateProgress(90);

        // 5. Update assignment status → completed
        await Assignment.findByIdAndUpdate(assignmentId, {
          status: 'completed',
        });

        // 6. Cache in Redis (1 hour TTL)
        const redis = getRedisClient();
        await redis.setex(
          `paper:${assignmentId}`,
          3600,
          JSON.stringify(paper.toJSON())
        );

        await job.updateProgress(100);

        // 7. Emit completion event
        io.to(room).emit('generation:complete', {
          assignmentId,
          paper: paper.toJSON(),
        });

        console.log(`✅ Generation complete for assignment: ${assignmentId}`);
        return { success: true, paperId: paper._id };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ Generation failed for ${assignmentId}:`, message);

        // Update assignment status → failed
        await Assignment.findByIdAndUpdate(assignmentId, {
          status: 'failed',
          errorMessage: message,
        });

        io.to(room).emit('generation:failed', {
          assignmentId,
          error: message,
        });

        throw error; // BullMQ will handle retry
      }
    },
    {
      connection: getRedisClient(),
      concurrency: 3,
    }
  );

  worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.id} failed:`, err.message);
  });

  workerInstance = worker;
  return worker;
}

export function getWorker(): Worker | null {
  return workerInstance;
}