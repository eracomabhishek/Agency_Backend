const mongoose = require("mongoose");
const { generateUniqueId } = require('./Counter'); 

const BillingSchema = new mongoose.Schema({
    billingId:{
        type:Number,
        unique:true,
    },
    customerName: {
        type: String,
        required: true,
    },
    agencyName: {
        type: String,
        required: true,
    },
    vehicleName: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    totalhours: {
        type: Number
    },
    endHour:{
        type:String
    },
    startHour:{
        type:String
    },
    totaldays:{
        type:Number,
        default:null,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    pricingMethod: {
        type: String,
        enum: ["pricePerDay", "pricePerHour"],
    },
    exceedCharges:{
        type: Number,
        default: 0,
    },
    
},
  { 
    timestamps: true  
  }
);


BillingSchema.pre('save', function(next) {
    generateUniqueId.call(this, 'billingId', next);
  });

module.exports = mongoose.model("Billing", BillingSchema);
