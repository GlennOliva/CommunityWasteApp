const express = require('express');
const router = express.Router();
const controller = require('../controllers/PickupController');
// 🟢 Register with image upload
router.post('/add_pickup_request', controller.addPickupRequest);

router.get('/', controller.getPickupRequests);




    router.get('/:id', controller.getPickupRequestById); // 👈 this line

    router.delete('/:id', controller.deletePickupRequest)

     router.get('/user/:user_id', controller.getPickupRequestByUserId); // 👈 this line

// 🟢 Update user
router.put('/:id',  controller.updatePickupRequest);

module.exports = router;
