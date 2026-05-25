"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.notFoundHandler = notFoundHandler;
exports.createError = createError;
function errorHandler(err, _req, res, _next) {
    const statusCode = err.statusCode ?? 500;
    const message = err.message || 'Internal Server Error';
    console.error(`❌ [${statusCode}] ${message}`, err.stack);
    res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors ?? undefined,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
}
function notFoundHandler(req, res) {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} not found`,
    });
}
function createError(message, statusCode = 500) {
    const err = new Error(message);
    err.statusCode = statusCode;
    return err;
}
//# sourceMappingURL=errorHandler.js.map