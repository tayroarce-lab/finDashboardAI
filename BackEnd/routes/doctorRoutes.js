const { Router } = require('express');
const doctorController = require('../controllers/DoctorController');

const router = Router();

// Métricas de rendimiento
router.get('/performance', doctorController.getPerformance());

// CRUD básico
router.get('/', doctorController.getAll());
router.post('/', doctorController.create());
router.get('/:id', doctorController.getById());
router.put('/:id', doctorController.update());
router.delete('/:id', doctorController.remove());

module.exports = router;
