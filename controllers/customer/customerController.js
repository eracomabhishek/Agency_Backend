const customerService = require('../../services/customerService');
const bookingService = require('../../services/bookingService')
const jwt = require('jsonwebtoken');

// Class-based controller
class CUSTOMER {
    // Method to register a new customer
    async registerCustomer(req, res) {
        try {
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
            customerService.validateLoginData({ email, password });

            const customer = await customerService.authenticateCustomer(email, password);

            const payload = {
                customerId: customer.customerId,
                role: "user"
            }
            // Generate JWT token
            const token = jwt.sign(
                payload, 
                process.env.JWT_SECRET,
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

