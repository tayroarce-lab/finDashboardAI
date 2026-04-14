const { Router } = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

// Importar rutas de módulos
const authRoutes = require('./authRoutes');
const treatmentRoutes = require('./treatmentRoutes');
const patientRoutes = require('./patientRoutes');
const expenseRoutes = require('./expenseRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const financialRoutes = require('./financialRoutes');
const doctorRoutes = require('./doctorRoutes');
const inventoryRoutes = require('./inventoryRoutes');


const router = Router();

// ─── Rutas públicas y Server-to-Server ─────────────────────────
router.use('/auth', authRoutes);
router.use('/finance', financialRoutes); // Accesible para n8n en el MVP

// ─── Middleware de autenticación (todo lo siguiente requiere JWT) ───
router.use(authMiddleware);

// ─── Rutas protegidas ───────────────────────
router.use('/treatments', treatmentRoutes);
router.use('/patients', patientRoutes);
router.use('/expenses', expenseRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/doctors', doctorRoutes);
router.use('/inventory', inventoryRoutes);

module.exports = router;

