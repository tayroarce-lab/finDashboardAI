const { Router } = require('express');
const inventoryController = require('../controllers/InventoryController');

const router = Router();

// Todas estas rutas requieren autenticación (se aplica en index.js)

router.get('/status', inventoryController.getStatus.bind(inventoryController));
router.post('/movements', inventoryController.addMovement.bind(inventoryController));
router.get('/:id/history', inventoryController.getHistory.bind(inventoryController));

// CRUD Básico de items (heredado de BaseController)
router.get('/', inventoryController.getAll.bind(inventoryController));
router.post('/', inventoryController.create.bind(inventoryController));
router.put('/:id', inventoryController.update.bind(inventoryController));
router.delete('/:id', inventoryController.remove.bind(inventoryController));

module.exports = router;
