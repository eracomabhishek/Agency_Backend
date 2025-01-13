const mongoose = require('mongoose');


const AdminLoginSchema = new mongoose.Schema({
    id:{
        type:Number,
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    role: {
        type: String,
    }
});

// Export the AdminLogin model
module.exports = mongoose.model('Admin', AdminLoginSchema);
