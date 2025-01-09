const mongoose = require('mongoose');
const { addPreSaveMiddleware } = require('./Counter'); // Import the helper function

const AgencySchema = new mongoose.Schema({
    agencyId: { type: Number, unique: true }, // Sequential unique identifier
    agencyName: { type: String, required: true, trim: true, unique: true },
    contactPerson: { type: String, required: true, trim: true },
    contactEmail: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    businessLicenseNumber: { type: String, required: true, unique: true },
    officeAddress: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
    },
    serviceLocations: [String],
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    password: { type: String, required: true },
    registeredAt: { type: Date, default: Date.now },
},
  { timestamps: true }
);

// Apply the pre-save middleware for UID generation
addPreSaveMiddleware(AgencySchema, 'agency', 'agencyId'); // 'agency' as the counter name

module.exports = mongoose.model('Agency', AgencySchema);










