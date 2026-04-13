const { Router } = require('express');
const PatientController = require('../controllers/PatientController');
const validateRequest = require('../middlewares/validateRequest');

const router = Router();

// ⚠️ Rutas estáticas ANTES de /:id
router.get('/search', PatientController.search());

// CRUD
router.get('/', PatientController.getAll());
router.post('/', validateRequest(['name']), PatientController.create());
router.get('/:id', PatientController.getById());
router.put('/:id', PatientController.update());

module.exports = router;
