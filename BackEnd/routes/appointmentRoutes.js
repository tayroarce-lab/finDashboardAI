const { Router } = require('express');
const AppointmentController = require('../controllers/AppointmentController');
const validateRequest = require('../middlewares/validateRequest');

const router = Router();

router.get('/', AppointmentController.getByWeek());
router.get('/occupancy', AppointmentController.getOccupancy());
router.get('/:id', AppointmentController.getById());
router.post('/', validateRequest(['start_time', 'end_time']), AppointmentController.create());
router.patch('/:id/status', validateRequest(['status']), AppointmentController.updateStatus());

module.exports = router;
