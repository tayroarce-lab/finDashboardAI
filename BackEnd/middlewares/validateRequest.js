const AppError = require('../utils/AppError');

/**
 * Factory de middleware para validar campos del request body.
 * @param {string[]} requiredFields - Campos obligatorios
 * @returns {Function} Middleware de Express
 * 
 * Uso: router.post('/', validateRequest(['name', 'price']), controller.create)
 */
function validateRequest(requiredFields) {
    return (req, res, next) => {
        const missing = [];

        for (const field of requiredFields) {
            if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
                missing.push(field);
            }
        }

        if (missing.length > 0) {
            throw AppError.validation(
                `Campos requeridos faltantes: ${missing.join(', ')}`
            );
        }

        next();
    };
}

module.exports = validateRequest;
