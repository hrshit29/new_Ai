"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAssignmentRouter = createAssignmentRouter;
const express_1 = require("express");
const Assignment_1 = require("../models/Assignment");
const QuestionPaper_1 = require("../models/QuestionPaper");
const generationQueue_1 = require("../queues/generationQueue");
const redis_1 = require("../config/redis");
const validate_1 = require("../middleware/validate");
const errorHandler_1 = require("../middleware/errorHandler");
function createAssignmentRouter(io) {
    const router = (0, express_1.Router)();
    // POST /api/assignments — Create + enqueue generation
    router.post('/', (0, validate_1.validate)(validate_1.createAssignmentSchema), async (req, res, next) => {
        try {
            const assignment = await Assignment_1.Assignment.create({
                ...req.body,
                dueDate: new Date(req.body.dueDate),
                status: 'draft',
            });
            // Enqueue AI generation job
            await (0, generationQueue_1.enqueueGenerationJob)({
                assignmentId: assignment._id.toString(),
                subject: assignment.subject,
                grade: assignment.grade,
                numberOfQuestions: assignment.numberOfQuestions,
                totalMarks: assignment.totalMarks,
                questionTypes: assignment.questionTypes,
                instructions: assignment.instructions,
            });
            res.status(201).json({
                success: true,
                data: assignment,
            });
        }
        catch (error) {
            next(error);
        }
    });
    // GET /api/assignments — List with search/filter
    router.get('/', async (req, res, next) => {
        try {
            const { search, status, page = '1', limit = '20' } = req.query;
            const query = {};
            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { subject: { $regex: search, $options: 'i' } },
                ];
            }
            if (status)
                query.status = status;
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const [assignments, total] = await Promise.all([
                Assignment_1.Assignment.find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(parseInt(limit)),
                Assignment_1.Assignment.countDocuments(query),
            ]);
            res.json({
                success: true,
                data: assignments,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / parseInt(limit)),
                },
            });
        }
        catch (error) {
            next(error);
        }
    });
    // GET /api/assignments/:id — Single assignment + question paper
    router.get('/:id', async (req, res, next) => {
        try {
            const { id } = req.params;
            // Check Redis cache first
            const redis = (0, redis_1.getRedisClient)();
            const cached = await redis.get(`paper:${id}`).catch(() => null);
            const assignment = await Assignment_1.Assignment.findById(id);
            if (!assignment) {
                return next((0, errorHandler_1.createError)('Assignment not found', 404));
            }
            let questionPaper = null;
            if (cached) {
                questionPaper = JSON.parse(cached);
            }
            else {
                questionPaper = await QuestionPaper_1.QuestionPaper.findOne({ assignmentId: id });
            }
            res.json({
                success: true,
                data: { assignment, questionPaper },
            });
        }
        catch (error) {
            next(error);
        }
    });
    // DELETE /api/assignments/:id
    router.delete('/:id', async (req, res, next) => {
        try {
            const { id } = req.params;
            const assignment = await Assignment_1.Assignment.findByIdAndDelete(id);
            if (!assignment) {
                return next((0, errorHandler_1.createError)('Assignment not found', 404));
            }
            await QuestionPaper_1.QuestionPaper.deleteOne({ assignmentId: id });
            // Clear cache
            const redis = (0, redis_1.getRedisClient)();
            await redis.del(`paper:${id}`).catch(() => null);
            res.json({ success: true, message: 'Assignment deleted' });
        }
        catch (error) {
            next(error);
        }
    });
    // POST /api/assignments/:id/regenerate
    router.post('/:id/regenerate', async (req, res, next) => {
        try {
            const { id } = req.params;
            const assignment = await Assignment_1.Assignment.findById(id);
            if (!assignment) {
                return next((0, errorHandler_1.createError)('Assignment not found', 404));
            }
            if (assignment.status === 'generating') {
                return next((0, errorHandler_1.createError)('Generation already in progress', 409));
            }
            // Reset status
            await Assignment_1.Assignment.findByIdAndUpdate(id, {
                status: 'draft',
                errorMessage: undefined,
            });
            // Clear existing paper + cache
            await QuestionPaper_1.QuestionPaper.deleteOne({ assignmentId: id });
            const redis = (0, redis_1.getRedisClient)();
            await redis.del(`paper:${id}`).catch(() => null);
            await (0, generationQueue_1.enqueueGenerationJob)({
                assignmentId: id,
                subject: assignment.subject,
                grade: assignment.grade,
                numberOfQuestions: assignment.numberOfQuestions,
                totalMarks: assignment.totalMarks,
                questionTypes: assignment.questionTypes,
                instructions: assignment.instructions,
            });
            res.json({ success: true, message: 'Regeneration started' });
        }
        catch (error) {
            next(error);
        }
    });
    return router;
}
//# sourceMappingURL=assignments.js.map