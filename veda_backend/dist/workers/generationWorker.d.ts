import { Worker } from 'bullmq';
import { Server as SocketIOServer } from 'socket.io';
export declare function createGenerationWorker(io: SocketIOServer): Worker;
export declare function getWorker(): Worker | null;
//# sourceMappingURL=generationWorker.d.ts.map