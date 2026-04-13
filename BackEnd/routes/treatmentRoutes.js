const { Router } = require('express');
const TreatmentController = require('../controllers/TreatmentController');
const validateRequest = require('../middlewares/validateRequest');

const router = Router();

// ⚠️ Rutas estáticas ANTES de /:id para evitar conflicto con Express
// Registros de tratamientos realizados (ingresos)
router.get('/records/list', TreatmentController.getRecords());
router.post('/records', validateRequest(['treatment_id', 'patient_id']), TreatmentController.createRecord());

// Análisis de rentabilidad
router.get('/analysis/profitability', TreatmentController.getProfitability());

// Catálogo de tratamientos (CRUD)
router.get('/', TreatmentController.getAll());
router.post('/', validateRequest(['name', 'price', 'estimated_cost']), TreatmentController.create());
router.get('/:id', TreatmentController.getById());
router.put('/:id', TreatmentController.update());
router.delete('/:id', TreatmentController.remove());

module.exports = router;
