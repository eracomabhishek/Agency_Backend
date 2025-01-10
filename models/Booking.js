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
        enum: ['Completed', 'Pending', 'Cancelled', 'Approved'],
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








