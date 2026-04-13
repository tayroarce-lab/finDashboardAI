const jwt = require('jsonwebtoken');
const env = require('../config/env');
const AppError = require('../utils/AppError');

/**
 * Middleware de autenticación JWT.
 * Extrae el token del header Authorization,
 * lo verifica y adjunta user data al request.
 */
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw AppError.unauthorized('Token no proporcionado');
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        req.user = {
            id: decoded.id,
            clinicId: decoded.clinicId,
            email: decoded.email,
            role: decoded.role
        };
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw AppError.unauthorized('Token expirado');
        }
        throw AppError.unauthorized('Token inválido');
    }
}

module.exports = authMiddleware;
