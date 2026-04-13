const AppError = require('../utils/AppError');
const env = require('../config/env');

/**
 * Middleware centralizado de manejo de errores.
 * Captura todos los errores y envía respuesta estandarizada.
 */
function errorHandler(err, req, res, next) {
    // Si es un error operacional (AppError), usamos sus datos
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            error: {
                code: err.code,
                message: err.message
            }
        });
    }

    // Error de MySQL: duplicado
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            success: false,
            error: {
                code: 'DUPLICATE_ENTRY',
                message: 'El registro ya existe'
            }
        });
    }

    // Error de MySQL: FK violation
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({
            success: false,
            error: {
                code: 'INVALID_REFERENCE',
                message: 'Referencia a un registro que no existe'
            }
        });
    }

    // Error de JSON malformado
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            success: false,
            error: {
                code: 'INVALID_JSON',
                message: 'El body de la petición no es JSON válido'
            }
        });
    }

    // Error inesperado — log completo en dev
    console.error('❌ Error no controlado:', err);

    res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message: 'Error interno del servidor',
            ...(env.isDev() && { stack: err.stack, detail: err.message })
        }
    });
}

module.exports = errorHandler;
