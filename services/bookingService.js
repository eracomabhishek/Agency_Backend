const Booking = require('../models/Booking');
const Customer = require('../models/Customer');
const Vehicle = require('../models/Vehicle');

class BOOKINGSERVICE {
  async createBookingService({
    customerId,
    vehicleId,
    startDate,
    endDate,
    startHour,
    endHour,
    agencyId
}) {
    // Ensure that customerId, vehicleId, and agencyId are numbers
    const validCustomerId = Number(customerId);
    const validVehicleId = Number(vehicleId);
    const validAgencyId = Number(agencyId);

    // Validate customer existence
    const customer = await Customer.findOne({ customerId: validCustomerId });
    if (!customer) {
        throw new Error('Customer not found');
    }

    const customerName = customer.fullName;
    const customerNumber = customer.phoneNumber;

    // Create a new booking
    const newBooking = new Booking({
        customerId: validCustomerId,
        vehicleId: validVehicleId,
        agencyId: validAgencyId,
        customerName: customerName,
        customerNumber: customerNumber,
        startDate,
        endDate,
        startHour: startHour || null,
        endHour: endHour || null,
        paymentStatus: 'Pending',
        bookingStatus: 'Confirmed'
    });

    await newBooking.save();

    // Update customer's booking history
    await Customer.findOneAndUpdate(
      { customerId: validCustomerId }, // Querying with the Number customerId
      { $push: { bookingHistory: Number(newBooking.bookingId) } } // Convert _id to Number
    );

    return newBooking;
}



  // Update booking status
  async updateBookingStatusService(bookingId, { bookingStatus, paymentStatus }) {
    const booking = await Booking.findOne({ bookingId: bookingId });

    if (!booking) {
      throw new Error('Booking not found.');
    }

    if (bookingStatus !== undefined) {
      booking.bookingStatus = bookingStatus;
    }

    if (paymentStatus !== undefined) {
      booking.paymentStatus = paymentStatus;
    }

    // Save and return updated booking
    return await booking.save();
  }

  // Fetch booking details by ID
  async getBookingDetailsByIdService(bookingId) {
    const booking = await Booking.findById(bookingId).populate([
      { path: 'customerId' },
      { path: 'vehicleId' },
      { path: 'agencyId' }
    ]);

    if (!booking) {
      throw new Error('Booking not found.');
    }

    return booking;
  }

  // Get all bookings
  async getAllBookingsService() {
    return await Booking.find().populate('customerId').populate('vehicleId').populate('agencyId');
  }

  // Get booking details by date range
  async getBookingDetailsByDateService(startDate, endDate) {
    console.log("Raw startDate:", startDate);
    console.log("Raw endDate:", endDate);

    if (!startDate || !endDate) {
      throw new Error('Both startDate and endDate are required.');
    }

    // Parse the start and end dates (ensure they are treated as local time)
    const start = new Date(startDate);  // Treat as local time
    const end = new Date(endDate);      // Treat as local time

    if (isNaN(start) || isNaN(end)) {
      throw new Error('Invalid date format. Use a valid date format (e.g., YYYY-MM-DD).');
    }

    if (start > end) {
      throw new Error('startDate cannot be later than endDate.');
    }

    // Adjust to start of day and end of day in local time (no UTC offset)
    const startOfDay = new Date(start); 
    startOfDay.setHours(0, 0, 0, 0); // Start of the day in local time

    const endOfDay = new Date(end); 
    endOfDay.setHours(23, 59, 59, 999); // End of the day in local time

    console.log("Adjusted Start Date (Local):", startOfDay);
    console.log("Adjusted End Date (Local):", endOfDay);

    // MongoDB query using local time, no UTC adjustment
    const query = {
      $and: [
        { startDate: { $gte: startOfDay } }, // Greater than or equal to start date
        { endDate: { $lte: endOfDay } }      // Less than or equal to end date
      ]
    };

    console.log("MongoDB Query:", query);

    // Execute query
    const bookings = await Booking.find(query)
      .populate('vehicleId', 'vehicleName agencyId')
      .populate('agencyId', 'agencyName');

    console.log("Retrieved Bookings:", bookings);

    return bookings;
  }

}

const bookingService = new BOOKINGSERVICE();
module.exports = bookingService;









// const Booking = require('../models/Booking');
// const Customer = require('../models/Customer');
// const Vehicle = require('../models/Vehicle')

// // Create a new booking
// exports.createBookingService = async ({
//     customerId,
//     vehicleId,
//     agencyId,
//     startDate,
//     endDate,
//     Hours,
//     Days,
//     totalCost
// }) => {
//     // Ensure that customerId, vehicleId, and agencyId are numbers
//     const validCustomerId = Number(customerId);
//     const validVehicleId = Number(vehicleId);
//     const validAgencyId = Number(agencyId);


//     const newBooking = new Booking({
//         customerId: validCustomerId,
//         vehicleId: validVehicleId,
//         agencyId: validAgencyId,
//         startDate,
//         endDate,
//         Days: Days || null, // Optional field
//         Hours: Hours || null, // Optional field
//         totalCost,
//         paymentStatus: 'Pending',
//         bookingStatus: 'Confirmed'
//     });

//     await newBooking.save();

//     // Update customer's booking history
//     await Customer.findOneAndUpdate(
//         { customerId: validCustomerId }, // Querying with the Number customerId
//         { $push: { bookingHistory: newBooking.bookingId } } // Assuming bookingId is being set as a unique number
//     );

//     return newBooking;
// };


// // Update booking status
// exports.updateBookingStatusService = async (bookingId, { bookingStatus, paymentStatus }) => {
//     const booking = await Booking.findOne({ bookingId:bookingId });

//     if (!booking) {
//         throw new Error('Booking not found.');
//     }

//     if (bookingStatus !== undefined) {
//         booking.bookingStatus = bookingStatus;
//     }

//     if (paymentStatus !== undefined) {
//         booking.paymentStatus = paymentStatus;
//     }

//     // Save and return updated booking
//     return await booking.save();
// };

// // Fetch booking details by ID
// exports.getBookingDetailsByIdService = async (bookingId) => {
//     const booking = await Booking.findById(bookingId).populate([
//         { path: 'customerId' },
//         { path: 'vehicleId' },
//         { path: 'agencyId' }
//     ]);

//     if (!booking) {
//         throw new Error('Booking not found.');
//     }

//     return booking;
// };

// // Get all bookings
// exports.getAllBookingsService = async () => {
//     return await Booking.find().populate('customerId').populate('vehicleId').populate('agencyId');
// };


// exports.getBookingDetailsByDateService = async (startDate, endDate) => {
//     console.log("Raw startDate:", startDate);
//     console.log("Raw endDate:", endDate);

//     if (!startDate || !endDate) {
//         throw new Error('Both startDate and endDate are required.');
//     }

//     // Parse the start and end dates (ensure they are treated as local time)
//     const start = new Date(startDate);  // Treat as local time
//     const end = new Date(endDate);      // Treat as local time

//     if (isNaN(start) || isNaN(end)) {
//         throw new Error('Invalid date format. Use a valid date format (e.g., YYYY-MM-DD).');
//     }

//     if (start > end) {
//         throw new Error('startDate cannot be later than endDate.');
//     }

//     // Adjust to start of day and end of day in local time (no UTC offset)
//     const startOfDay = new Date(start); 
//     startOfDay.setHours(0, 0, 0, 0); // Start of the day in local time

//     const endOfDay = new Date(end); 
//     endOfDay.setHours(23, 59, 59, 999); // End of the day in local time

//     console.log("Adjusted Start Date (Local):", startOfDay);
//     console.log("Adjusted End Date (Local):", endOfDay);

//     // MongoDB query using local time, no UTC adjustment
//     const query = {
//         $and: [
//             { startDate: { $gte: startOfDay } }, // Greater than or equal to start date
//             { endDate: { $lte: endOfDay } }      // Less than or equal to end date
//         ]
//     };

//     console.log("MongoDB Query:", query);

//     // Execute query
//     const bookings = await Booking.find(query)
//         .populate('vehicleId', 'vehicleName agencyId')
//         .populate('agencyId', 'agencyName');

//     console.log("Retrieved Bookings:", bookings);

//     return bookings;
// };


// exports.getUserRentedVehiclesService = async (customerId) => {
//     // Fetch bookings for the customer
//     const bookings = await Booking.find({ customerId }).lean();

//     if (!bookings || bookings.length === 0) {
//         throw new Error('No rented vehicles found.');
//     }

//     // Fetch vehicle details for each booking
//     const vehicleIds = bookings.map((booking) => booking.vehicleId);
//     const vehicles = await Vehicle.find({ vehicleId: { $in: vehicleIds } }).lean();

//     // Combine bookings with vehicle details
//     return bookings.map((booking) => {
//         const vehicle = vehicles.find((v) => v.vehicleId === booking.vehicleId);
//         return {
//             ...booking,
//             vehicleDetails: vehicle || null,
//         };
//     });
// };




