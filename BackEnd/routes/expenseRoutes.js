const { Router } = require('express');
const ExpenseController = require('../controllers/ExpenseController');
const validateRequest = require('../middlewares/validateRequest');

const router = Router();

// ⚠️ Rutas estáticas ANTES de /:id
router.get('/categories', ExpenseController.getCategories());
router.get('/by-category', ExpenseController.getByCategory());

// CRUD
router.get('/', ExpenseController.getAll());
router.post('/', validateRequest(['category_id', 'amount', 'expense_date']), ExpenseController.create());
router.get('/:id', ExpenseController.getById());
router.put('/:id', ExpenseController.update());
router.delete('/:id', ExpenseController.remove());

module.exports = router;
