const crypto = require('crypto');

// Generate a random 6-digit OTP
function generateOtp() {
    return crypto.randomInt(100000, 999999).toString(); // Returns OTP as a string
}

module.exports = { generateOtp };
