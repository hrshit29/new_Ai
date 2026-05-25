"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGenerationWorker = createGenerationWorker;
exports.getWorker = getWorker;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
const Assignment_1 = require("../models/Assignment");
const QuestionPaper_1 = require("../models/QuestionPaper");
const aiService_1 = require("../services/aiService");
let workerInstance = null;
function createGenerationWorker(io) {
    const worker = new bullmq_1.Worker('question-generation', async (job) => {
        const { assignmentId } = job.data;
        const room = `assignment:${assignmentId}`;
        console.log(`🔄 Processing generation job for assignment: ${assignmentId}`);
        try {
            // 1. Update status → generating
            await Assignment_1.Assignment.findByIdAndUpdate(assignmentId, {
                status: 'generating',
                errorMessage: undefined,
            });
            io.to(room).emit('generation:started', { assignmentId });
            await job.updateProgress(10);
            // 2. Generate question paper using AI
            const generated = await (0, aiService_1.generateQuestionPaper)({
                subject: job.data.subject,
                grade: job.data.grade,
                numberOfQuestions: job.data.numberOfQuestions,
                totalMarks: job.data.totalMarks,
                questionTypes: job.data.questionTypes,
                instructions: job.data.instructions,
            });
            await job.updateProgress(70);
            io.to(room).emit('generation:progress', {
                assignmentId,
                progress: 70,
                message: 'Structuring question paper...',
            });
            // 3. Delete any existing paper for this assignment
            await QuestionPaper_1.QuestionPaper.deleteOne({ assignmentId });
            // 4. Save the question paper
            const paper = await QuestionPaper_1.QuestionPaper.create({
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
            await Assignment_1.Assignment.findByIdAndUpdate(assignmentId, {
                status: 'completed',
            });
            // 6. Cache in Redis (1 hour TTL)
            const redis = (0, redis_1.getRedisClient)();
            await redis.setex(`paper:${assignmentId}`, 3600, JSON.stringify(paper.toJSON()));
            await job.updateProgress(100);
            // 7. Emit completion event
            io.to(room).emit('generation:complete', {
                assignmentId,
                paper: paper.toJSON(),
            });
            console.log(`✅ Generation complete for assignment: ${assignmentId}`);
            return { success: true, paperId: paper._id };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.error(`❌ Generation failed for ${assignmentId}:`, message);
            // Update assignment status → failed
            await Assignment_1.Assignment.findByIdAndUpdate(assignmentId, {
                status: 'failed',
                errorMessage: message,
            });
            io.to(room).emit('generation:failed', {
                assignmentId,
                error: message,
            });
            throw error; // BullMQ will handle retry
        }
    }, {
        connection: (0, redis_1.getRedisClient)(),
        concurrency: 3,
    });
    worker.on('completed', (job) => {
        console.log(`✅ Job ${job.id} completed`);
    });
    worker.on('failed', (job, err) => {
        console.error(`❌ Job ${job?.id} failed:`, err.message);
    });
    workerInstance = worker;
    return worker;
}
function getWorker() {
    return workerInstance;
}
//# sourceMappingURL=generationWorker.js.map