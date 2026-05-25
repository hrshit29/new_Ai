"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;
async function connectDB(retries = MAX_RETRIES) {
    try {
        mongoose_1.default.connection.on('connected', () => console.log('✅ MongoDB connected'));
        mongoose_1.default.connection.on('error', (err) => console.error('❌ MongoDB error:', err));
        mongoose_1.default.connection.on('disconnected', () => console.warn('⚠️  MongoDB disconnected, retrying...'));
        await mongoose_1.default.connect(env_1.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
    }
    catch (error) {
        if (retries > 0) {
            console.log(`🔄 MongoDB retry in ${RETRY_DELAY / 1000}s... (${retries} left)`);
            await new Promise((res) => setTimeout(res, RETRY_DELAY));
            return connectDB(retries - 1);
        }
        console.error('❌ MongoDB connection failed after max retries');
        throw error;
    }
}
//# sourceMappingURL=db.js.map