const AuthService = require('../services/AuthService');

/**
 * AuthController — Maneja endpoints de autenticación.
 */
class AuthController {
    /**
     * POST /api/auth/register
     */
    register() {
        return async (req, res, next) => {
            try {
                const result = await AuthService.register(req.body);
                res.status(201).json({ success: true, data: result });
            } catch (error) {
                next(error);
            }
        };
    }

    /**
     * POST /api/auth/login
     */
    login() {
        return async (req, res, next) => {
            try {
                const result = await AuthService.login(req.body);
                res.status(200).json({ success: true, data: result });
            } catch (error) {
                next(error);
            }
        };
    }

    /**
     * GET /api/auth/me (requiere auth)
     */
    getProfile() {
        return async (req, res, next) => {
            try {
                const profile = await AuthService.getProfile(req.user.id);
                res.status(200).json({ success: true, data: profile });
            } catch (error) {
                next(error);
            }
        };
    }
}

module.exports = new AuthController();
