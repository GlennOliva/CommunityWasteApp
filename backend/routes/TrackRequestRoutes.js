const express = require('express');
const router = express.Router();
const controller = require('../controllers/TrackRequestController.js');
const upload = require('../Middlewares/Upload.js'); // <-- ADD THIS
// 🟢 Register with image upload


router.get('/', controller.getAllCombinedRequests);



module.exports = router;
