const mongoose = require("mongoose");
const { addPreSaveMiddleware } = require('./Counter');

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
        type: Date, // Optional: Booking start date
        default: null,
    },
    endDate: {
        type: Date, // Optional: Booking end date
        default: null,
    },
    hours: {
        type: Number, // Optional: Billing duration in hours
        default: null,
    },
    days:{
        type:Number,
        default:null,
    },
    rate:{
        type:Number,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    pricingMethod: {
        type: String,
        enum: ["Days", "Hours"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
},
  { timestamps: true }
);

addPreSaveMiddleware(BillingSchema, 'Billing', 'billingId');

module.exports = mongoose.model("Billing", BillingSchema);
