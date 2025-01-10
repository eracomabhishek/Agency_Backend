const mongoose = require('mongoose'); 
const { generateUniqueId } = require('./Counter'); 

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
  exceedCharges:{
    type: Number,
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


 

VehicleSchema.pre('save', function (next) {
  const field = 'vehicleId'; // The field to generate a unique ID for
  generateUniqueId.call(this, field, next);
});


module.exports = mongoose.model("Vehicle", VehicleSchema);
