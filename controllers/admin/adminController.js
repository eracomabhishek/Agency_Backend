const Admin = require('../../models/Admin');
const Agency = require('../../models/Agency')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const agencyService = require('../../services/agencyService');
const agencyController = require('../agency/agencyController');
const vehicleService = require('../../services/vehicleService');

class ADMIN {

    async adminLogin(req, res) {
        try {
            const { email, password } = req.body;
            // Validate request body
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required.' });
            }
            // Find the user by email
            const user = await Admin.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'email not found.' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Invalid password.' });
            }

            const payload = {
                user: user.adminid,
                role: "admin",
            }
            // Generate a JWT token
            const token = jwt.sign(
                payload,
                process.env.JWT_KEY,
            );

            // Respond with the token and user info
            res.status(200).json({
                message: 'Login successful.',
                token,
                user: {
                    id: user._id,
                    adminid: user.adminid,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error.' });
        }



    }

    async getStatusByAgency(req,res){
        try {
            const status = req.query.status;
            if (!status) {
                return res.status(400).json({
                    message: 'Status query parameter is required.',
                });
            }
            
            const validStatuses = ['Pending', 'Approved', 'Rejected'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    message: 'Invalid status. Please provide either "Pending" or "Approved".',
                });
            }
            
        
            const agencies = await Agency.find({ status: status });
            const totalCount = await Agency.countDocuments({ status: status });
        
            // Check if no agencies are found for the provided status
            if (agencies.length === 0) {
                return res.status(404).json({
                    message: `No ${status} agencies found.`,
                    totalCount: 0,
                });
            }
            // Return the filtered list of agencies and total count
            res.status(200).json({
                message: `${status} agencies fetched successfully`,
                totalCount: totalCount,
                data: agencies,
            });
        } catch (error) {
            console.error('Error fetching agencies:', error);
            res.status(500).json({ message: 'Error fetching agencies' });
        }
        
        
    }

    async getVehicleWithAgencyId(req,res){
        try {
            const agencyId = req.params.agencyId;
            if (!agencyId) {
                return res.status(400).json({ message: 'agencyId required ' });
            }
           const agencydata= await vehicleService.getVehiclesByAgencyService(agencyId)
            if (typeof agencydata === 'string') {
                return res.status(200).json({ message: agencydata });
            }
            
         return res.status(200).json({ message: 'agency data fetched successfully',
            data: agencydata,
         })
          
        } catch (error) {
            console.error('Error fetching agencies:', error);
            res.status(500).json({ message: 'Error fetching agencies' });
        }
        
        
    }

    async updateAgencyStatus(req, res) {
        try {
            const { agencyId, status } = req.body;
            if (!agencyId || !status) {
                return res.status(400).json({ message: 'Agency ID and status are required.' });
            }
    
            const validStatuses = ['Approved', 'Rejected'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    message: 'Invalid status. Please provide either "Rejected" or "Approved".',
                });
            }
    
            // Find and update the agency's status
            const updatedAgency = await Agency.findOneAndUpdate(
                { agencyId },
                { status },
                { new: true } // Returns the updated document
            );
    
            if (!updatedAgency) {
                return res.status(404).json({ message: 'Agency not found.' });
            }
    
            // Respond with the updated agency
            return res.status(200).json({
                message: `Agency status successfully updated to ${status}.`,
                agency: updatedAgency,
            });
    
        } catch (error) {
            console.error('Error in updateAgencyStatus:', error);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    }
    


}


const adminController = new ADMIN();
module.exports = adminController;