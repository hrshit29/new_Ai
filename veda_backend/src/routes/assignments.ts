import { Router, Request, Response, NextFunction } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { Assignment } from '../models/Assignment';
import { QuestionPaper } from '../models/QuestionPaper';
import { enqueueGenerationJob } from '../queues/generationQueue';
import { getRedisClient } from '../config/redis';
import { validate, createAssignmentSchema } from '../middleware/validate';
import { createError } from '../middleware/errorHandler';

export function createAssignmentRouter(io: SocketIOServer): Router {
  const router = Router();

  // POST /api/assignments — Create + enqueue generation
  router.post(
    '/',
    validate(createAssignmentSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const assignment = await Assignment.create({
          ...req.body,
          dueDate: new Date(req.body.dueDate),
          status: 'draft',
        });

        // Enqueue AI generation job
        await enqueueGenerationJob({
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
      } catch (error) {
        next(error);
      }
    }
  );

  // GET /api/assignments — List with search/filter
  router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, status, page = '1', limit = '20' } = req.query;

      const query: Record<string, any> = {};
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { subject: { $regex: search, $options: 'i' } },
        ];
      }
      if (status) query.status = status;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const [assignments, total] = await Promise.all([
        Assignment.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit as string)),
        Assignment.countDocuments(query),
      ]);

      res.json({
        success: true,
        data: assignments,
        pagination: {
          total,
          page: parseInt(page as string),
          pages: Math.ceil(total / parseInt(limit as string)),
        },
      });
    } catch (error) {
      next(error);
    }
  });

  // GET /api/assignments/:id — Single assignment + question paper
  router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // Check Redis cache first
      const redis = getRedisClient();
      const cached = await redis.get(`paper:${id}`).catch(() => null);

      const assignment = await Assignment.findById(id);
      if (!assignment) {
        return next(createError('Assignment not found', 404));
      }

      let questionPaper = null;
      if (cached) {
        questionPaper = JSON.parse(cached);
      } else {
        questionPaper = await QuestionPaper.findOne({ assignmentId: id });
      }

      res.json({
        success: true,
        data: { assignment, questionPaper },
      });
    } catch (error) {
      next(error);
    }
  });

  // DELETE /api/assignments/:id
  router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const assignment = await Assignment.findByIdAndDelete(id);
      if (!assignment) {
        return next(createError('Assignment not found', 404));
      }

      await QuestionPaper.deleteOne({ assignmentId: id });

      // Clear cache
      const redis = getRedisClient();
      await redis.del(`paper:${id}`).catch(() => null);

      res.json({ success: true, message: 'Assignment deleted' });
    } catch (error) {
      next(error);
    }
  });

  // POST /api/assignments/:id/regenerate
  router.post(
    '/:id/regenerate',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;

        const assignment = await Assignment.findById(id);
        if (!assignment) {
          return next(createError('Assignment not found', 404));
        }

        if (assignment.status === 'generating') {
          return next(createError('Generation already in progress', 409));
        }

        // Reset status
        await Assignment.findByIdAndUpdate(id, {
          status: 'draft',
          errorMessage: undefined,
        });

        // Clear existing paper + cache
        await QuestionPaper.deleteOne({ assignmentId: id });
        const redis = getRedisClient();
        await redis.del(`paper:${id}`).catch(() => null);

        await enqueueGenerationJob({
          assignmentId: id,
          subject: assignment.subject,
          grade: assignment.grade,
          numberOfQuestions: assignment.numberOfQuestions,
          totalMarks: assignment.totalMarks,
          questionTypes: assignment.questionTypes,
          instructions: assignment.instructions,
        });

        res.json({ success: true, message: 'Regeneration started' });
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
}