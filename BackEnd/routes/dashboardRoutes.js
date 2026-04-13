const { Router } = require('express');
const DashboardController = require('../controllers/DashboardController');

const router = Router();

router.get('/kpis', DashboardController.getKPIs());
router.get('/revenue-chart', DashboardController.getRevenueChart());
router.get('/top-treatments', DashboardController.getTopTreatments());
router.get('/alerts', DashboardController.getAlerts());

module.exports = router;
