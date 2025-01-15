const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin/adminController');
const agencyController = require('../controllers/agency/agencyController');
const agencyService = require('../services/agencyService');

router.post('/adminlogin', adminController.adminLogin);
router.get('/getstatusagency', adminController.getStatusByAgency);
router.get('/getagencydetails/:agencyId', agencyController.getAgencyDetails);
router.post('/getvehiclebyagency/:agencyId', adminController.getVehicleWithAgencyId);
router.post('/updateagencystatus', adminController.updateAgencyStatus);
router.get('/alluser', adminController.getAllUser);
router.get('/userdetails/:customerId', adminController.getUserDetails);
router.get('/allcounts', adminController.getCounts);
router.delete('/deleteuser', adminController.deleteUser);
router.delete('/deleteagency', adminController.deleteAgency);
router.put('/updateagency', adminController.updateAgencyProfile);
router.put('/updateuser', adminController.updateUserProfile);

module.exports = router;