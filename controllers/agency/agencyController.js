require('dotenv').config();
const agencyService = require('../../services/agencyService');
const Agency = require('../../models/Agency')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sendOtpEmail } = require('../../services/emailService');
const { generateOtp } = require('../../utils/generateOtp');



class AGENCY {
    // Method to create a new agency
    async createAgency(req, res) {
        try {
            const data = req.body;

            const validationError = await agencyService.validateAgencyData(data);
            if (validationError) {
                return res.status(400).json({ message: validationError });
            }

            const savedAgency = await agencyService.createAgencyService(data);
            return res.status(201).json({
                message: 'Agency created successfully',
                data: savedAgency,
            });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    }

    // Method for agency login
    async loginAgency(req, res) {
        try {
            const { contactEmail, password } = req.body;

            // Use the service to validate login data
            const validationError = await agencyService.validateLoginDataService({ contactEmail, password });
            if (validationError) {
                return res.status(400).json({ message: validationError });
            }
            const agency = await agencyService.authenticateAgencyService({ contactEmail, password });

            // Check if authentication failed
            if (typeof agency === 'string') {
                return res.status(400).json({ message: agency }); // If it's an error message (e.g., 'Invalid email.'), return the error
            }

            const payload = {
                agencyId: agency.agencyId,
                role: "agency",
            }

            // Generate JWT token
            const token = jwt.sign(
                payload, 
                process.env.JWT_KEY,
            );

            // Respond with the token
            res.status(200).json({
                message: 'Login successful',
                token,
            });
        } catch (error) {
            console.error('Login error:', error.message);
            res.status(400).json({ message: error.message });
        }
    }

    // Method to update agency profile
    async updateAgencyProfile(req, res) {
        try {
            const agencyId = req.user.agencyId; 
    
            // Pass the user ID and updated data to the service layer
            const updatedAgency = await agencyService.updateAgencyProfileService(agencyId, req.body);

            if (updatedAgency) {
                return res.status(400).json({ message: updatedAgency });
            }

            // Respond with the updated agency profile
            res.status(200).json({
                message: 'Profile updated successfully',
                updatedAgency,
            });
        } catch (error) {
            console.error('Profile update error:', error.message);
            res.status(500).json({ message: error.message });
        }
    }

    async getAgencyDetails(req, res) {
        try {
          const agencyId = req.user.agencyId;
          // Find the agency by ID, excluding the password field
          const findAgency = await Agency.find({ agencyId: agencyId }).select('-password');
      
          if (!findAgency) {
            return res.status(404).json({ message: 'Agency not found' });
          }
      
          res.status(200).json({ data: findAgency });
        } catch (error) {
          console.error('Error fetching agency details:', error.message);
          res.status(500).json({ message: 'Failed to fetch agency details', error: error.message });
        }
   }

   async getBookingCount(req, res) {
    try {
        const agencyId = req.user.agencyId;
        console.log(`Fetching counts for agencyId: ${agencyId}`); // Debug log

        const result = await agencyService.getBookingCountService(agencyId);
        if (!result) {
            return res.status(400).json({ message: result });
        }
        // Return the result to the frontend
        return res.status(200).json({
            message: 'Counts retrieved successfully',
            data: result
        });
    } catch (error) {
        console.error('Error in getBookingCount:', error); // Detailed error log
        res.status(500).json({
            message: 'Failed to fetch booking or vehicle counts',
            error: error.message
        });
    }
  }

    //   async getBookingConfirmed(req, res) {
    //     try {
    //         const agencyId = req.user.agencyId;
    //         const result = await agencyService.getBookingConfirmedService(agencyId);
    //         if (typeof result === 'string') {
    //             return res.status(400).json({ message: result }); 
    //         }
    //         return res.status(200).json({ pendingBookings: result });
    //     } catch (error) {
    //         console.error('Error fetching booking details:', error.message);
    //         res.status(500).json({ message: 'Failed to fetch booking details', error: error.message });
    //     }
    //  }
    //   async getBookingCancelled(req, res) {
    //     try {
    //         const agencyId = req.user.agencyId;
    //         const result = await agencyService.getBookingCancelledService(agencyId);
    //         if (typeof result === 'string') {
    //             return res.status(400).json({ message: result }); 
    //         }
    //         return res.status(200).json({ pendingBookings: result });
    //     } catch (error) {
    //         console.error('Error fetching booking details:', error.message);
    //         res.status(500).json({ message: 'Failed to fetch booking details', error: error.message });
    //     }
    //  }
      

    async  forgotPassword(req, res) {
        try {
            const { contactEmail } = req.body;
    
            if (!contactEmail) {
                return res.status(400).json({ message: 'Email is required' });
            }
            const user = await Agency.findOne({ contactEmail });
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
            await sendOtpEmail(contactEmail, otp);
    
            return res.status(200).json({ message: 'OTP sent successfully to your email' });
        } catch (error) {
            console.error('Error in forgotPassword:', error);
            return res.status(500).json({ message: 'Error sending OTP', error: error.message });
        }
    }
    
    // API to handle reset password (verify OTP and reset password)
     async resetPassword(req, res) {
        try {
            const { contactEmail, otp, newPassword } = req.body;
            if (!contactEmail || !otp || !newPassword) {
                return res.status(400).json({ message: 'Email, OTP, and new password are required' });
            }
            // Find the user by email
            const user = await Agency.findOne({ contactEmail });
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
            user.otp = null;  
            user.otpExpires = null;  
            await user.save();
    
            return res.status(200).json({ message: ' Reset Password successfully reset' });
        } catch (error) {
            console.error('Error in resetPassword:', error);
            return res.status(500).json({ message: 'Error resetting password', error: error.message });
        }
    }
      
}

// Export an instance of the AgencyController
const agencyController = new AGENCY();
module.exports = agencyController;










// const agencyService = require('../../services/agencyService');
// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// // Create a new agency with service layer logic
// exports.createAgency = async (req, res) => {
//     try {
//         const savedAgency = await agencyService.createAgencyService(req.body);
//         res.status(201).json({ message: 'Agency created successfully', data: savedAgency });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// // Controller for agency login
// exports.loginAgency = async (req, res) => {
//     try {
//         const { contactEmail, password } = req.body;

//         // Validate the input data
//         agencyService.validateLoginData({ contactEmail, password });

//         const agency = await agencyService.authenticateAgency(contactEmail, password);

//         const payload = {
//             agencyId: agency._agencyId,
//             role: "agency",
//         }

//         // Generate JWT token
//         const token = jwt.sign(
//             payload, 
//             process.env.JWT_SECRET,
//             { expiresIn: '1h' } 
//         );

//         // Respond with the token
//         res.status(200).json({
//             message: 'Login successful',
//             token,
//         });
//     } catch (error) {
//         console.error('Login error:', error.message);
//         res.status(400).json({ message: error.message });
//     }
// };
//         // logou 
// exports.logoutAgency = async (req, res) => {
//     try {
//         // Extract the token from headers
//         const token = req.headers.authorization; // Bearer <token>

//         if (!token) {
//             throw new Error('Authorization token is missing.');
//         }

//         // Call the logout logic
//         agencyService.logoutAgencyService(token);

//         res.status(200).json({ message: 'Logout successful' });
//     } catch (error) {
//         console.error('Logout error:', error.message);
//         res.status(400).json({ message: error.message });
//     }
// };


// // Controller to update agency profile
// exports.updateAgencyProfile = async (req, res) => {
//     try {
//         const agencyId = req.user.agencyId; 
    
//         // Pass the user ID and updated data to the service layer
//         const updatedAgency = await agencyService.updateAgencyProfileService(agencyId, req.body);

//         // Respond with the updated agency profile
//         res.status(200).json({
//             message: 'Profile updated successfully',
//             updatedAgency,
//         });
//     } catch (error) {
//         console.error('Profile update error:', error.message);
//         res.status(400).json({ message: error.message });
//     }
// };



