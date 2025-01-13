const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin/adminController');

router.post('/adminlogin', adminController.adminLogin);
router.get('/pendingagency', adminController.getPendingAgency);

module.exports = router;