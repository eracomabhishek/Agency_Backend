const customerService = require('../../services/customerService');
const Customer = require('../../models/Customer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sendOtpEmail } = require('../../services/emailService');
const { generateOtp } = require('../../utils/generateOtp');


// Class-based controller
class CUSTOMER {
    // Method to register a new customer
    async registerCustomer(req, res) {
        try {            
            const validationError = await customerService.validateCustomerData(req.body);
            if (validationError) {
                return res.status(400).json({ message: validationError });
            }
            const customer = await customerService.registerCustomerService(req.body);
            res.status(201).json({ success: true, data: customer });
        } catch (error) {           
            res.status(400).json({ message: error.message });
        }
    }

    // Method to login a customer
    async loginCustomer(req, res) {
        try {
            const { email, password } = req.body;

            // Validate the input data
            const validateCustomer = customerService.validateLoginData({ email, password });
            if (validateCustomer) {
                return res.status(400).json({ message: validateCustomer });
                }

            const customer = await customerService.authenticateCustomer(email, password);

            const payload = {
                customerId: customer.customerId,
                role: "user"
            }
            // Generate JWT token
            const token = jwt.sign(
                payload, 
                process.env.JWT_KEY,
            );

            console.log("payload", payload)

            // Respond with the token
            res.status(200).json({
                message: 'Login successful',
                token,
            });
        } catch (error) {
            console.error('Login error:', error.message);
            res.status(401).json({ message: error.message });
        }
    }

    // Method to update customer details
    async updateCustomer(req, res) {
        try {
            const customerId = req.user.customerId; 
            // Pass the user ID and updated data to the service layer
            const updatedCustomer = await customerService.updateCustomerService(customerId, req.body);

            // Respond with the updated agency profile
            res.status(200).json({
                message: 'Profile updated successfully',
                updatedCustomer,
            });
        } catch (error) {
            console.error('Profile update error:', error.message);
            res.status(400).json({ message: error.message });
        }
    }
    
    async customerRentVehicle(req,res) {
        try {
            const { customerId } = req.user; // Extract customerId from the authenticated user (JWT)
    
            // Fetch rented vehicles for the user
            const rentedVehicles = await customerService.getUserRentedVehiclesService(customerId);
    
            res.status(200).json({
                message: 'Rented vehicles retrieved successfully',
                data: rentedVehicles,
            });
        } catch (error) {
            console.error('Error fetching rented vehicles:', error);
            res.status(500).json({
                message: error.message,
            });
        }
    }

    async getCustomerDetails(req, res) {
        try {
          const customerId  = req.params.customerId;
          if(!customerId){
            return res.status(400).json({ message: 'customer id required'})
          }
          const findCustomer = await customerService.getCustomerDetailsService(customerId);
          if (typeof findCustomer === 'string') {
            return res.status(404).json({ message: findCustomer});
          }
          return res.status(200).json({ message: 'Details fetched successfully',
             data: findCustomer, 
            });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Failed to fetch customer details' });
        }
    }

// ------------------------------------------------------------------------------------


// API to handle forgot password (send OTP)
async  forgotPassword(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        const user = await Customer.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email not registered' });
        }
        // Generate an OTP and expiration time
        const otp = generateOtp();
        const otpExpires = Date.now() + 15 * 60 * 1000; 

        // Save the OTP and expiration time in the user's record
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        // Send the OTP to the user's email
        await sendOtpEmail(email, otp);

        return res.status(200).json({ message: 'OTP sent successfully to your email' });
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        return res.status(500).json({ message: 'Error sending OTP', error: error.message });
    }
}

// API to handle reset password (verify OTP and reset password)
 async resetPassword(req, res) {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'Email, OTP, and new password are required' });
        }
        // Find the user by email
        const user = await Customer.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email not registered' });
        }
        // Check if OTP is valid and hasn't expired
        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // Update password and clear OTP
        user.password = hashedPassword;
        user.otp = null;  // Clear the OTP
        user.otpExpires = null;  // Clear OTP expiration time
        await user.save();

        return res.status(200).json({ message: 'Password successfully reset' });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        return res.status(500).json({ message: 'Error resetting password', error: error.message });
    }
}

}

// Export an instance of the CustomerController
const customerController = new CUSTOMER();
module.exports = customerController;












// const customerService = require('../../services/customerService');
// const jwt = require('jsonwebtoken');

// // Controller: Register a new customer
// exports.registerCustomer = async (req, res) => {
//     try {
//         const customer = await customerService.registerCustomerService(req.body);
//         res.status(201).json({ success: true, data: customer });
//     } catch (error) {
//         res.status(400).json({ success: false, message: error.message });
//     }
// }

// // Controller: Login a customer
// exports.loginCustomer = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Validate the input data
//         customerService.validateLoginData({ email, password });

//         const customer = await customerService.authenticateCustomer(email, password);

//         const payload = {
//             customerId: customer.customerId,
//             role: "user"
//         }
//         // Generate JWT token
//         const token = jwt.sign(
//             payload, 
//             process.env.JWT_SECRET,
//             { expiresIn: '1h' } 
//         );

//         // console.log("payload", payload)

//         // Respond with the token
//         res.status(200).json({
//             message: 'Login successful',
//             token,
//         });
//     } catch (error) {
//         console.error('Login error:', error.message);
//         res.status(401).json({ message: error.message });
//     }
// }

// // Controller: Update customer details
// exports.updateCustomer = async (req, res) => {

//      try {
//             const userId = req.user.customerId; 
//             console.log(userId)
    
//             // Pass the user ID and updated data to the service layer
//             const updatedCustomer = await customerService.updateCustomerService(userId, req.body);
    
//             // Respond with the updated agency profile
//             res.status(200).json({
//                 message: 'Profile updated successfully',
//                 updatedCustomer,
//             });
//         } catch (error) {
//             console.error('Profile update error:', error.message);
//             res.status(400).json({ message: error.message });
//         }
// }

