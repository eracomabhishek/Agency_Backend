const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin/adminController');
const agencyService = require('../services/agencyService');
const agencyController = require('../controllers/agency/agencyController');

router.post('/adminlogin', adminController.adminLogin);
router.get('/pendingagency', adminController.getPendingAgency);
router.get('/getagencydetails/:agencyId', agencyController.getAgencyDetails);

module.exports = router;