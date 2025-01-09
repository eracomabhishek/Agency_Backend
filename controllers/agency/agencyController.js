const agencyService = require('../../services/agencyService');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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
                process.env.JWT_SECRET,
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
            res.status(400).json({ message: error.message });
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



