const { Router } = require('express');
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

// Rutas públicas (no requieren JWT)
router.post('/register', AuthController.register());
router.post('/login', AuthController.login());

// Rutas protegidas
router.get('/me', authMiddleware, AuthController.getProfile());

module.exports = router;
