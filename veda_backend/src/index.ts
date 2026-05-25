import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { env } from './config/env';
import { connectDB } from './config/db';
import { connectRedis } from './config/redis';
import { createAssignmentRouter } from './routes/assignments';
import { createGenerationWorker } from './workers/generationWorker';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

async function bootstrap() {
  // Connect to DB and Redis
  await connectDB();
  await connectRedis();

  const app = express();
  const httpServer = createServer(app);

  // Socket.IO setup
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.CORS_ORIGIN,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    socket.on('join:assignment', (assignmentId: string) => {
      socket.join(`assignment:${assignmentId}`);
      console.log(`👤 Socket ${socket.id} joined room: assignment:${assignmentId}`);
    });

    socket.on('leave:assignment', (assignmentId: string) => {
      socket.leave(`assignment:${assignmentId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  // Middleware
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Routes
  app.use('/api/assignments', createAssignmentRouter(io));

  // 404 + Error handlers
  app.use(notFoundHandler);
  app.use(errorHandler);

  // Start BullMQ worker
  createGenerationWorker(io);
  console.log('⚙️  Generation worker started');

  httpServer.listen(env.PORT, () => {
    console.log(`🚀 VedaAI Backend running on http://localhost:${env.PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});