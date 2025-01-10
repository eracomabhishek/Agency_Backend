const mongoose = require('mongoose');
const { generateUniqueId } = require('./Counter'); 

const CustomerSchema = new mongoose.Schema({
    customerId: { 
        type: Number, 
        unique: true 
    }, // Unique ID for Customer
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: String, // OTP will be a string
        required: false
    },
    otpExpires: {
        type: Date, // Expiration time for OTP
        required: false
    },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String },
        country: { type: String }
    },
    bookingHistory: [{ 
       type: Number, 
       ref: 'Booking' 
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
},
   { timestamps: true }
);



// Apply the pre-save middleware to generate a unique customerId
CustomerSchema.pre('save', function(next) {
    generateUniqueId.call(this, 'customerId', next);
});

module.exports = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);





