"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const redis_1 = require("./config/redis");
const assignments_1 = require("./routes/assignments");
const generationWorker_1 = require("./workers/generationWorker");
const errorHandler_1 = require("./middleware/errorHandler");
async function bootstrap() {
    // Connect to DB and Redis
    await (0, db_1.connectDB)();
    await (0, redis_1.connectRedis)();
    const app = (0, express_1.default)();
    const httpServer = (0, http_1.createServer)(app);
    // Socket.IO setup
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: env_1.env.CORS_ORIGIN,
            methods: ['GET', 'POST'],
        },
    });
    io.on('connection', (socket) => {
        console.log(`🔌 Client connected: ${socket.id}`);
        socket.on('join:assignment', (assignmentId) => {
            socket.join(`assignment:${assignmentId}`);
            console.log(`👤 Socket ${socket.id} joined room: assignment:${assignmentId}`);
        });
        socket.on('leave:assignment', (assignmentId) => {
            socket.leave(`assignment:${assignmentId}`);
        });
        socket.on('disconnect', () => {
            console.log(`🔌 Client disconnected: ${socket.id}`);
        });
    });
    // Middleware
    app.use((0, cors_1.default)({ origin: env_1.env.CORS_ORIGIN, credentials: true }));
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true }));
    // Health check
    app.get('/health', (_req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    // Routes
    app.use('/api/assignments', (0, assignments_1.createAssignmentRouter)(io));
    // 404 + Error handlers
    app.use(errorHandler_1.notFoundHandler);
    app.use(errorHandler_1.errorHandler);
    // Start BullMQ worker
    (0, generationWorker_1.createGenerationWorker)(io);
    console.log('⚙️  Generation worker started');
    httpServer.listen(env_1.env.PORT, () => {
        console.log(`🚀 VedaAI Backend running on http://localhost:${env_1.env.PORT}`);
    });
}
bootstrap().catch((err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map