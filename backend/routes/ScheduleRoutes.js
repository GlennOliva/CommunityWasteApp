const express = require('express');
const router = express.Router();
const controller = require('../controllers/ScheduleController.js');
// insert schedule
router.post('/add_schedule', controller.addSchedule);

  router.get('/:admin_id', controller.getSchedule); // 👈 this line

    router.get('/:id', controller.getScheduleById); // 👈 this line

    router.delete('/:id', controller.deleteSchedule)

// 🟢 Update schedule
router.put('/:id',  controller.updateSchedule);

module.exports = router;
