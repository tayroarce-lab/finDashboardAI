const env = require('../config/env');

/**
 * Middleware de logging de requests.
 * Solo activo en desarrollo.
 */
function requestLogger(req, res, next) {
    if (!env.isDev()) return next();

    const start = Date.now();
    const { method, originalUrl } = req;

    res.on('finish', () => {
        const duration = Date.now() - start;
        const status = res.statusCode;
        const color = status >= 400 ? '\x1b[31m' : status >= 300 ? '\x1b[33m' : '\x1b[32m';
        console.log(`${color}${method}\x1b[0m ${originalUrl} → ${status} (${duration}ms)`);
    });

    next();
}

module.exports = requestLogger;
