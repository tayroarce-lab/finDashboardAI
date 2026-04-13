/**
 * AppError - Error personalizado para la aplicación.
 * Permite diferenciar errores operacionales (esperados)
 * de errores de programación (bugs).
 */
class AppError extends Error {
    constructor(message, statusCode, code = null) {
        super(message);
        this.statusCode = statusCode;
        this.code = code || this._getDefaultCode(statusCode);
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }

    _getDefaultCode(statusCode) {
        const codes = {
            400: 'BAD_REQUEST',
            401: 'UNAUTHORIZED',
            403: 'FORBIDDEN',
            404: 'NOT_FOUND',
            409: 'CONFLICT',
            422: 'VALIDATION_ERROR',
            500: 'INTERNAL_ERROR'
        };
        return codes[statusCode] || 'UNKNOWN_ERROR';
    }

    static badRequest(message) {
        return new AppError(message, 400);
    }

    static unauthorized(message = 'No autorizado') {
        return new AppError(message, 401);
    }

    static forbidden(message = 'Acceso denegado') {
        return new AppError(message, 403);
    }

    static notFound(resource = 'Recurso') {
        return new AppError(`${resource} no encontrado`, 404);
    }

    static conflict(message) {
        return new AppError(message, 409);
    }

    static validation(message) {
        return new AppError(message, 422, 'VALIDATION_ERROR');
    }
}

module.exports = AppError;
