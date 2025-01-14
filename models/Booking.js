const mongoose = require('mongoose');
const { generateUniqueId } = require('./Counter'); 

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
    // paymentStatus: {
    //     type: String,
    //     enum: ['Pending', 'Paid', 'Cancelled'],
    //     default: 'Pending'
    // },
    bookingStatus: {
        type: String,
        enum: ['Completed', 'Pending', 'Cancelled', 'Approved'],
        default: 'Pending'
    },
   
 }, 
    { 
     timestamps: true
    }
);

BookingSchema.pre('save', function(next) {
    generateUniqueId.call(this, 'bookingId', next);
  });

module.exports = mongoose.model('Booking', BookingSchema);








