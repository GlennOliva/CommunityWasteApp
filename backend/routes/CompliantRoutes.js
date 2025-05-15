const express = require('express');
const router = express.Router();
const controller = require('../controllers/CompliantController.js');
const upload = require('../Middlewares/Upload.js'); // <-- ADD THIS
// 🟢 Register with image upload
router.post('/add_compliant', upload.single('image_attach'), controller.addComplaint);

router.get('/', controller.getComplaints);


    router.get('/:id', controller.getComplaintById); // 👈 this line

// 🟢 Update user
router.put('/:id', upload.single('image_attach'), controller.updateComplaint);

    router.delete('/:id', controller.deleteComplaint)

module.exports = router;
