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
router.get('/alluser', adminController.getAllUser);
router.get('/userdetails/:customerId', adminController.getUserDetails);
router.get('/allcounts', adminController.getCounts);
router.post('/deleteuser/:customerId', adminController.deleteUser);
router.post('/deleteagency/:agencyId', adminController.deleteAgency);

module.exports = router;