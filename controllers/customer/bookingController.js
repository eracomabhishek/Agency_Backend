const bookingService = require('../../services/bookingService');
const Vehicle = require('../../models/Vehicle');
const Agency = require('../../models/Agency');

class BOOKING {
    // Create a new booking
    async createBooking(req, res) {
        try {
            const { customerId } = req.user; // Get customer ID from token
            if (!customerId || isNaN(customerId)) {
                return res.status(400).json({ message: 'Invalid customer ID.' });
            }

             req.body.customerId = customerId;

            const { agencyId, vehicleId, startDate, endDate, startHour, endHour } = req.body;

            // Check if vehicle exists
            const vehicle = await Vehicle.findOne({ vehicleId });
            if (!vehicle) {
                return res.status(404).json({ message: "Vehicle not found." });
            }
            const agency = await Agency.findOne({ agencyId });
            if (!agency) {
                return res.status(404).json({ message: "Agency not found." });
            }

            // Check if all required fields are provided
            if (!startDate || !endDate || !startHour || !endHour) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            // Validate startDate and endDate - should not be in the past
            const today = new Date();
            today.setHours(0, 0, 0, 0);  // Set time to 00:00:00 for today
            const startDateObj = new Date(startDate);
            const endDateObj = new Date(endDate);

            if (startDateObj < today || endDateObj < today) {
                return res.status(400).json({ message: 'Start date and end date must not be in the past.' });
            }

            // Validate that startDate is not after endDate
            if (startDateObj > endDateObj) {
                return res.status(400).json({ message: 'Start date cannot be later than end date.' });
            }

            // Validate startHour and endHour - must be valid hours (00-23) and minutes (00-59)
            const startHourInt = parseInt(startHour);
            const endHourInt = parseInt(endHour);
            const isValidHour = (hour) => hour >= 0 && hour <= 23;
            const isValidMinute = (minute) => minute >= 0 && minute <= 59;

            if (!isValidHour(startHourInt) || !isValidHour(endHourInt)) {
                return res.status(400).json({ message: 'Start hour and end hour must be between 0 and 23.' });
            }

            const startMinute = startHour.split(':')[1] || '00';
            const endMinute = endHour.split(':')[1] || '00';

            if (!isValidMinute(startMinute) || !isValidMinute(endMinute)) {
                return res.status(400).json({ message: 'Start minute and end minute must be between 00 and 59.' });
            }

            // Additional validation for today: startHour cannot be in the past if startDate is today
            if (startDateObj.toDateString() === today.toDateString()) {
                const currentHour = today.getHours();
                const currentMinute = today.getMinutes();

                const [startHourValue, startMinutesValue] = startHour.split(':').map(Number); // Renamed to avoid conflict
                if (startHourValue < currentHour || (startHourValue === currentHour && startMinutesValue < currentMinute)) {
                    return res.status(400).json({ message: 'Start hour cannot be in the past when selecting today\'s date.' });
                }
            }

            // Create booking using the service
            const newBooking = await bookingService.createBookingService(req.body);
            if (typeof newBooking === 'string') {
                return res.status(400).json({ message: newBooking });
            }

            return res.status(201).json({
                message: 'Booking created successfully.',
                data: newBooking,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'An error while creating booking' });
        }

    }

    // Update booking status
    async updateBookingStatus(req, res) {
        try {
            const bookingId  = req.params.bookingId;
            const { bookingStatus, paymentStatus } = req.body;

            if (bookingStatus === undefined && paymentStatus === undefined) {
                return res.status(400).json({
                    message: 'At least one field bookingStatus or paymentStatus must be provided.',
                });
            }
            const updatedBooking = await bookingService.updateBookingStatusService( Number(bookingId), req.body);
            if (!updatedBooking.status) {
                return res.status(400).json({ message: updatedBooking.message });
            }

            return res.status(200).json({ message: updatedBooking.message,
                data: updatedBooking.data,
            });

        } catch (error) {
           return res.status(500).json({
                message: error.message,
            });
        }
    }

    // Fetch booking details by ID
    async getBookingDetailsById(req, res) {
        try {
            const { bookingId } = req.params;
    
            const booking = await bookingService.getBookingDetailsByIdService(bookingId);
            if (!booking) {
                return res.status(404).json({ message: 'Booking not found.' });
            }
    
           return res.status(200).json({
                message: 'Booking details fetched successfully',
                data: booking,
            });
        } catch (error) {
            console.error('Error fetching booking details:', error);
          return res.status(500).json({ message: 'Error fetching booking details' });
        }
    }
    

    // Fetch all bookings
    async getAllBookings(req, res) {
        try {
            const bookings = await bookingService.getAllBookingsService();
            if (bookings) {
                return res.status(400).json({ message: bookings });
            }
            return res.status(200).json({
                message: 'All bookings fetched successfully',
                data: bookings,
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Error fetching bookings',
                error: error.message,
            });
        }
    }

    // Get booking details by date
    async getBookingDetailsByDate(req, res) {
        try {
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                return res.status(400).json({ message: 'Both startDate and endDate are required.' });
            }

            const start = new Date(startDate); // Treat as local time
            const end = new Date(endDate); // Treat as local time

           // Check if startDate and endDate are valid dates
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return res.status(400).json({ message: 'Invalid date format. Use a valid date format (e.g., YYYY-MM-DD).' });
            }

            if (start > end) {
                return res.status(400).json({ message: 'startDate cannot be later than endDate.' });
            }

            const bookings = await bookingService.getBookingDetailsByDateService(startDate, endDate);
            if (!bookings || bookings.length === 0) {
                return res.status(404).json({ message: 'No bookings found for the specified date range.' });
              }

              return  res.status(200).json({
                message: 'Bookings retrieved successfully',
                data: bookings,
            });
        } catch (error) {
            return res.status(400).json({
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
