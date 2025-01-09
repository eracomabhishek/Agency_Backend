const mongoose = require('mongoose');
const { addPreSaveMiddleware } = require('./Counter'); // Import the helper function

const BookingSchema = new mongoose.Schema({
    bookingId: { 
        type: Number, 
        unique: true 
    }, // Unique UID for Booking
    customerId: {
        type: Number,
        required: true
    },
    vehicleId: {
        type: Number,
        required: true
    },
    agencyId: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,  
    },
    endDate: {
        type: Date,  
    },
    startHour: {
        type: String,
    },
    endHour: {
        type: String,
    },
    customerName: {
        type: String,
    },
    customerNumber:{
        type:String,
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Cancelled'],
        default: 'Pending'
    },
    bookingStatus: {
        type: String,
        enum: ['Approved', 'Pending', 'Cancelled'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
 }, 
   { timestamps: true }
);

// Apply the pre-save middleware for UID generation
addPreSaveMiddleware(BookingSchema, 'booking', 'bookingId'); // 'booking' as the counter name

module.exports = mongoose.model('Booking', BookingSchema);













// const mongoose = require('mongoose');

// // Booking Schema
// const BookingSchema = new mongoose.Schema({
//     customerId: {
//         // type: mongoose.Schema.Types.ObjectId,
//         ref: 'Customer',
//         required: true
//     },
//     vehicleId: {
//         // type: mongoose.Schema.Types.ObjectId,
//         ref: 'Vehicle',
//         required: true
//     },
//     agencyId: {
//         // type: mongoose.Schema.Types.ObjectId,
//         ref: 'Agency',
//         required: true
//     },
//     startDate: {
//         type: Date,
//         required: true
//     },
//     endDate: {
//         type: Date,
//         required: true
//     },
//     totalCost: {
//         type: Number,
//         required: true
//     },
//     paymentStatus: {
//         type: String,
//         enum: ['Pending', 'Paid', 'Cancelled'],
//         default: 'Pending'
//     },
//     bookingStatus: {
//         type: String,
//         enum: [ 'Completed', 'Confirmed', 'Cancelled'],
//         default: 'Confirmed'
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// module.exports = mongoose.model('Booking', BookingSchema);
