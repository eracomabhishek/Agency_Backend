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












// const mongoose = require('mongoose');

// const CounterSchema = new mongoose.Schema({
//     _id: { type: String, required: true }, // Name of the counter (e.g., 'agency')
//     seq: { type: Number, default: 0 }, // Current sequence value
// });

// const Counter = mongoose.model('Counter', CounterSchema);

// const AgencySchema = new mongoose.Schema({
//     agencyName: { type: String, required: true, trim: true, unique: true },
//     contactPerson: { type: String, required: true, trim: true },
//     contactEmail: { type: String, required: true, unique: true },
//     phoneNumber: { type: String, required: true, unique: true },
//     businessLicenseNumber: { type: String, required: true, unique: true },
//     officeAddress: {
//         street: String,
//         city: String,
//         state: String,
//         postalCode: String,
//         country: String,
//     },
//     serviceLocations: [String],
//     status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
//     password: { type: String, required: true },
//     registeredAt: { type: Date, default: Date.now },
//     uid: { type: Number, unique: true }, // Sequential unique identifier
// });

// // Pre-save middleware to generate the uid
// AgencySchema.pre('save', async function (next) {
//     if (this.isNew) {
//         try {
//             const counter = await Counter.findByIdAndUpdate(
//                 { _id: 'agency' }, // Use 'agency' as the counter name
//                 { $inc: { seq: 1 } }, // Increment sequence
//                 { new: true, upsert: true } // Create counter if it doesn't exist
//             );
//             this.uid = counter.seq; // Assign the updated sequence to `uid`
//         } catch (error) {
//             return next(error);
//         }
//     }
//     next();
// });

// module.exports = mongoose.model('Agency', AgencySchema);
