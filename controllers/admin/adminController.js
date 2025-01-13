const Admin = require('../../models/Admin');
const Agency = require('../../models/Agency')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

    async getPendingAgency(req,res){
        try {
            const agencies = await Agency.find({ status: 'Pending' });
            const totalPendingCount = await Agency.countDocuments({ status: 'Pending' });
            // Check if no agencies are found
            if (agencies.length === 0) {
                return res.status(404).json({
                    message: 'No pending agencies found.',
                    totalPendingCount: 0,
                });
            }
            // Return the list of agencies and total count
            res.status(200).json({
                message: 'Pending agencies fetched successfully',
                totalPendingCount: totalPendingCount, 
                data: agencies,
            });
        } catch (error) {
            console.error('Error fetching pending agencies:', error);
            res.status(500).json({ message: 'Error fetching pending agencies' });
        }
        
    }


}


const adminController = new ADMIN();
module.exports = adminController;