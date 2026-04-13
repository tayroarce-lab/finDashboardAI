const { Router } = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

// Importar rutas de módulos
const authRoutes = require('./authRoutes');
const treatmentRoutes = require('./treatmentRoutes');
const patientRoutes = require('./patientRoutes');
const expenseRoutes = require('./expenseRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const dashboardRoutes = require('./dashboardRoutes');

const router = Router();

// ─── Rutas públicas ─────────────────────────
router.use('/auth', authRoutes);

// ─── Middleware de autenticación (todo lo siguiente requiere JWT) ───
router.use(authMiddleware);

// ─── Rutas protegidas ───────────────────────
router.use('/treatments', treatmentRoutes);
router.use('/patients', patientRoutes);
router.use('/expenses', expenseRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
