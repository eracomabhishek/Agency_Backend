const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin/adminController');
const agencyController = require('../controllers/agency/agencyController');
const agencyService = require('../services/agencyService');

router.post('/adminlogin', adminController.adminLogin);
router.get('/pendingagency', adminController.getStatusByAgency);
router.get('/getagencydetails/:agencyId', agencyController.getAgencyDetails);
router.post('/getvehiclebyagency/:agencyId', adminController.getVehicleWithAgencyId);
router.post('/updateagencystatus', adminController.updateAgencyStatus);

module.exports = router;