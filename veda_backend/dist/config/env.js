"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    PORT: parseInt(process.env.PORT || '5000', 10),
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/vedaai',
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
};
// Validate critical env vars
const missing = [];
if (!exports.env.GEMINI_API_KEY)
    missing.push('GEMINI_API_KEY');
if (missing.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missing.join(', ')}`);
    console.warn('   AI generation will not work without GEMINI_API_KEY');
}
//# sourceMappingURL=env.js.map