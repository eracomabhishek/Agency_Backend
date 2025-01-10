const express = require('express');
const router = express.Router();
const bookingController = require("../controllers/customer/bookingController")
const customerController = require("../controllers/customer/customerController")
const verifyToken = require("../middleware/verifyToken");

router.post('/customer/register', customerController.registerCustomer);
router.post('/customer/login', customerController.loginCustomer);
router.put('/customer/update', verifyToken, customerController.updateCustomer);
router.get('/customer/rented/vehicles', verifyToken, customerController.customerRentVehicle);
router.get('/customer-details',verifyToken, customerController.getCustomerDetails);
router.post('/forgot-password', customerController.forgotPassword);
router.post('/reset-password', customerController.resetPassword);


// BOOKING ROUTES
router.post('/booking', verifyToken, bookingController.createBooking);                               // create booking
router.put('/update-Booking-Status/:bookingId',bookingController.updateBookingStatus);   // update booking status
router.get('/booking-details/:bookingId', bookingController.getBookingDetailsById);     // get booking details by id
router.get('/all-bookings', bookingController.getAllBookings);                          // fetch all bookings
router.get('/get-booking-by-date', bookingController.getBookingDetailsByDate);          // fetch booking by date




// Protected route
router.get("/home", verifyToken, (req, res) => {
    res.status(200).json({
      msg: "Welcome to the protected home route!",
      user: req.user 
    });
});


module.exports = router;
