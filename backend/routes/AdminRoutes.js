const express = require('express');
const router = express.Router();
const controller = require('../controllers/AdminController.js');
const upload = require('../Middlewares/Upload.js'); // <-- ADD THIS
// 🟢 Register with image upload
router.post('/add_admin', upload.single('image'), controller.addAdmin);

router.get('/', controller.getAdmin);

    // 🟢 Login
    router.post('/login', controller.loginAdmin);

    router.get('/:id', controller.getAdminById); // 👈 this line

// 🟢 Update user
router.put('/:id', upload.single('image'), controller.updateAdmin);

module.exports = router;
