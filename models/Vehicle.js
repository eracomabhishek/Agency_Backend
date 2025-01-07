const mongoose = require('mongoose');
const { addPreSaveMiddleware } = require('./Counter'); // Import the helper function

const generateRegistrationNumber = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let registrationNumber = "";
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    registrationNumber += characters[randomIndex];
  }
  return registrationNumber;
};

const VehicleSchema = new mongoose.Schema({
  vehicleId: { 
    type: Number, 
    unique: true 
  }, // Unique UID for Vehicle
  agencyId: { 
    type: Number, 
    required: true 
  },
  agencyName:{
    type:String,
  },
  vehicleName: { 
    type: String, 
    required: true 
  }, 
  vehicleNumber: {
    type: String,
    default: "0",
  },
  vehicleType: {
    type: String,
  },
  agencyName: { 
    type: String, 
  },
  capacity: {
    type: String,
  },
  description: {
    type: String,
  },
  registrationNumber: {
    type: String,
    default: generateRegistrationNumber,
  },
  pricePerDay: { 
    type: Number, 
  },
  pricePerHour: { 
    type: Number, 
  },
  availability: { 
    type: Boolean, 
    default: true 
  },
  features: [String],
  images: [String],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
},
  { timestamps: true }
);

// Apply the pre-save middleware for UID generation
addPreSaveMiddleware(VehicleSchema, 'vehicle', 'vehicleId'); // 'vehicle' as the counter name

module.exports = mongoose.model("Vehicle", VehicleSchema);










// const mongoose = require("mongoose");

// // Utility function to generate a registration number
// const generateRegistrationNumber = () => {
//   const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Allowed characters (uppercase and numbers)
//   let registrationNumber = "";

//   for (let i = 0; i < 10; i++) {
//     const randomIndex = Math.floor(Math.random() * characters.length);
//     registrationNumber += characters[randomIndex];
//   }

//   return registrationNumber;
// };

// const VehicleSchema = new mongoose.Schema({
//   agencyUid: {  // Use agencyUid instead of agencyId
//     type: String,
//     required: true,  // Ensure every vehicle has the agency's unique UID
//   },
//   vehicleName: { 
//     type: String, 
//     required: true
//   }, 
//   vehicleNumber: {
//     type: String,
//     default:"0",
//   },
//   vehicleType: {
//     type: String,
//     // required: true,
//   },
//   agencyName: { 
//     type: String, 
//    // required: true // Make it required if always needed 
//   },
//   capacity:{
//     type: String,
//     // required:true,
//   },
//   description:{
//     type:String,
//     // required:true,
//   },
//   registrationNumber: {
//     type: String,
//     // required: true,
//     // unique: true,
//     default: generateRegistrationNumber, // Use the custom function for generating the registration number
//   },
//   pricePerDay: { type: Number, required: true },
//   availability: { type: Boolean, default: true },
//   features: [String], // e.g., ['AC', 'GPS', 'Automatic']
//   images: [String], // Array of image URLs
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Vehicle", VehicleSchema);
