const bookingService = require('../../services/bookingService');
const Vehicle = require('../../models/Vehicle')

class BOOKING {
    // Create a new booking
    async createBooking(req, res) {
        try {
            const { customerId } = req.user; 
            req.body.customerId = customerId;
    
            const { vehicleId, startDate, endDate, startHour, endHour } = req.body;
            const vehicle = await Vehicle.findOne({ vehicleId });
            if (!vehicle) {
                return res.status(404).json({ message: `Vehicle with ID ${vehicleId} not found.` });
            }
    
            // Validate booking type
            if (!startDate || !endDate) {
                return res.status(400).json({ message: 'Start date and end date are required.' });
            }

           // Scenario 1: Booking for specific hours across days
         if (startHour !== undefined || endHour !== undefined) {
            if (new Date(startDate).toDateString() !== new Date(endDate).toDateString()) {
                return res.status(400).json({
                    message: 'Start date and end date must be the same for hourly bookings.'
                });
            }

            // Ensure start date is in the future
            if (new Date(startDate) < new Date()) {
                return res.status(400).json({
                    message: 'Start date must be in the future.'
                });
            }
        }
        // Scenario 2: Booking for a range of days (no specific hours)
        else if (new Date(startDate).toDateString() !== new Date(endDate).toDateString()) {
            // Validate daily booking (startDate and endDate must be different for multi-day bookings)
            if (new Date(startDate) >= new Date(endDate)) {
                return res.status(400).json({
                    message: 'Start date must be before end date for daily bookings.'
                });
            }

            // Ensure start date is in the future
            if (new Date(startDate) < new Date()) {
                return res.status(400).json({
                    message: 'Start date must be in the future.'
                });
            }
        }
        // Scenario 3: Booking for a single day
        else if (new Date(startDate).toDateString() === new Date(endDate).toDateString()) {
            // For a single-day booking, check if it's in the future
            if (new Date(startDate) < new Date()) {
                return res.status(400).json({
                    message: 'Start date must be in the future.'
                });
            }

    
                // Handle case where only start and end date are the same, and no specific hours are provided
                // Single day bookings without specific hours are allowed.
            } else {
                return res.status(400).json({
                    message: 'Invalid booking configuration.'
                });
            }
    
            const newBooking = await bookingService.createBookingService(req.body);
    
            res.status(201).json({
                message: 'Booking created successfully...',
                data: newBooking,
            });
        } catch (error) {
            // Handle errors
            res.status(500).json({
                message: error.message,
            });
        }
    }
    
    
    
    

    // Update booking status
    async updateBookingStatus(req, res) {
        try {
            const { bookingId } = req.params;
            const { bookingStatus, paymentStatus } = req.body;

            if (bookingStatus === undefined && paymentStatus === undefined) {
                return res.status(400).json({
                    message: 'At least one field (bookingStatus or paymentStatus) must be provided.',
                });
            }

            const updatedBooking = await bookingService.updateBookingStatusService(bookingId, req.body);

            res.status(200).json({
                message: 'Booking updated successfully',
                data: updatedBooking,
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error updating booking status',
                error: error.message,
            });
        }
    }

    // Fetch booking details by ID
    async getBookingDetailsById(req, res) {
        try {
            const { bookingId } = req.params;

            const booking = await bookingService.getBookingDetailsByIdService(bookingId);

            res.status(200).json({
                message: 'Booking details fetched successfully',
                data: booking,
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error fetching booking details',
                error: error.message,
            });
        }
    }

    // Fetch all bookings
    async getAllBookings(req, res) {
        try {
            const bookings = await bookingService.getAllBookingsService();

            res.status(200).json({
                message: 'All bookings fetched successfully',
                data: bookings,
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error fetching bookings',
                error: error.message,
            });
        }
    }

    // Get booking details by date
    async getBookingDetailsByDate(req, res) {
        try {
            const { startDate, endDate } = req.query;

            const bookings = await bookingService.getBookingDetailsByDateService(startDate, endDate);

            res.status(200).json({
                message: 'Bookings retrieved successfully',
                data: bookings,
            });
        } catch (error) {
            res.status(400).json({
                message: 'Error fetching bookings',
                error: error.message,
            });
        }
    }
}

const bookingController = new BOOKING();
module.exports = bookingController;

// Export a new instance of the BookingController class
// module.exports = new BookingController();


















// const bookingService = require('../../services/bookingService');

// // Create a new booking
// exports.createBooking = async (req, res) => {
//     try {
//         // Pass the entire request body to the service
//         const newBooking = await bookingService.createBookingService(req.body);

//         res.status(201).json({ message: 'Booking created successfully', data: newBooking });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Update booking status
// exports.updateBookingStatus = async (req, res) => {
//     try {
//         const { bookingId } = req.params;
//         const { bookingStatus, paymentStatus } = req.body;

//         // If neither bookingStatus nor paymentStatus is provided, return an error
//         if (bookingStatus === undefined && paymentStatus === undefined) {
//             return res.status(400).json({
//                 message: 'At least one field (bookingStatus or paymentStatus) must be provided.'
//             });
//         }

//         const updatedBooking = await bookingService.updateBookingStatusService(
//             bookingId, 
//             req.body // Pass the entire body to the service
//         );

//         res.status(200).json({
//             message: 'Booking updated successfully',
//             data: updatedBooking
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: 'Error updating booking status',
//             error: error.message
//         });
//     }
// };

// // Fetch booking details by ID
// exports.getBookingDetailsById = async (req, res) => {
//     try {
//         const { bookingId } = req.params;

//         const booking = await bookingService.getBookingDetailsByIdService(bookingId);

//         res.status(200).json({ message: 'Booking details fetched successfully', data: booking });
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching booking details', error: error.message });
//     }
// };

// // Fetch all bookings
// exports.getAllBookings = async (req, res) => {
//     try {
//         const bookings = await bookingService.getAllBookingsService();

//         res.status(200).json({
//             message: 'All bookings fetched successfully',
//             data: bookings
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: 'Error fetching bookings',
//             error: error.message
//         });
//     }
// };

// // Get booking details by date
// exports.getBookingDetailsByDate = async (req, res) => {
//     try {
//         const { startDate, endDate } = req.query; // Expecting startDate and endDate from query parameters
//         console.log("start date in controller", startDate)
//         console.log("end Date in controller", endDate)
//         const bookings = await bookingService.getBookingDetailsByDateService(startDate, endDate);
//         res.status(200).json({ message: 'Bookings retrieved successfully', data: bookings });
//     } catch (error) {
//         res.status(400).json({ message: 'Error fetching bookings', error: error.message });
//     }
// };
