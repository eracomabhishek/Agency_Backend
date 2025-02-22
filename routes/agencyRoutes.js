const express = require('express');
const router = express.Router();
const agencyController = require("../controllers/agency/agencyController")
const vehicleController = require("../controllers/agency/vehicleController")
const billingService = require("../services/billingService");
const upload = require("../middleware/multerConfig");
const paginationService = require("../services/pagination")
const verifyToken = require("../middleware/verifyToken");

router.get('/pagination', paginationService.paginateVehicles);
router.get('/vehicle/options', paginationService.fetchOptions);

// Agency routes
router.post('/agencies', agencyController.createAgency);                        // create agency
router.post('/loginAgency', agencyController.loginAgency);                      // login  agency
router.put('/update/agency', agencyController.updateAgencyProfile); // update agency
router.get('/agency-details/:agencyId', agencyController.getAgencyDetails);                             // get agency
router.get('/booking-count', verifyToken, agencyController.getBookingCount);
router.post('/agency-forgot-password', agencyController.forgotPassword);
router.post('/agency-reset-password', agencyController.resetPassword);


// Vehicle routes
router.get('/total-vehicle', verifyToken, vehicleController.getTotalVehicles);
router.post('/create/vehicle', verifyToken, upload.array('images', 5), vehicleController.createVehicle); // create vehicle
router.get('/get-all-vehicles', vehicleController.getVehicles);                       // Fetch all Vehicles with Agency name and id
router.get('/get-vehicle-By/:vehicleId', vehicleController.getVehicleById);           // get vehicle by id
router.get('/vehicles-with-agency/:agencyId', vehicleController.getVehiclesByAgency); //... Find vehicles with agency id
router.post('/vehicle/delete/:vehicleId', vehicleController.deleteVehicle);           // for delete vehicle
router.post('/vehicles/update/:vehicleId', upload.array('images', 5), vehicleController.updateVehicle);           // update vehic    le
// router.get('/get-vehicle/:', vehicleController.getVehicleByRegistrationNumber) // fetch vehicle by registration number
router.get('/get-rented-Vehicle/:agencyId', vehicleController.getRentedVehicles);
router.get('/vehicle-booking-period/:vehicleId', vehicleController.vehicleBookingPeriod);


router.post('/billing', billingService.billing);





module.exports = router;
