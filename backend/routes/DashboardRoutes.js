const express = require('express');
const router = express.Router();
const controller = require('../controllers/DashboardController');

router.get('/total_resident', controller.getTotalResidentByID);
router.get('/total_compliant', controller.getTotalCompliantsByID);
router.get('/total_request', controller.getTotalRequestByID);
router.get('/total_schedule', controller.getCountScheduleByID);
router.get('/pie_chart_request', controller.getPieChartRequestByID);
router.get('/bar_chart_compliants_month', controller.getBarChartCompliantsPerMonthByID);
router.get('/user_total_complaint/:user_id', controller.getTotalComplaintsByUserID);
router.get('/user_total_request/:user_id', controller.getTotalRequestsByUserID);




module.exports = router;
