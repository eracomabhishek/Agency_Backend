const Vehicle = require('../../models/Vehicle');
const Customer = require("../../models/Customer");
const Admin = require("../../models/Admin");
const Agency = require("../../models/Agency");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const agencyService = require("../../services/agencyService");
const agencyController = require("../agency/agencyController");
const vehicleService = require("../../services/vehicleService");
const customerService = require("../../services/customerService")

class ADMIN {
    async adminLogin(req, res) {
        try {
            const { email, password } = req.body;
            // Validate request body
            if (!email || !password) {
                return res
                    .status(400)
                    .json({ message: "Email and password are required." });
            }
            // Find the user by email
            const user = await Admin.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "email not found." });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: "Invalid password." });
            }

            const payload = {
                user: user.adminid,
                role: "admin",
            };
            // Generate a JWT token
            const token = jwt.sign(payload, process.env.JWT_KEY);

            // Respond with the token and user info
            res.status(200).json({
                message: "Login successful.",
                token,
                user: {
                    id: user._id,
                    adminid: user.adminid,
                    email: user.email,
                    role: user.role,
                },
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error." });
        }
    }

    async getStatusByAgency(req, res) {
        try {
            const status = req.query.status;
            if (!status) {
                return res.status(400).json({
                    message: "Status query parameter is required.",
                });
            }
        
            const validStatuses = ["Pending", "Approved", "Rejected", "All"];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    message:
                        'Invalid status. Please provide Pending, Approved, Rejected, or All.',
                });
            }
        console.log("aaaaaaa")
            // Define a filter condition based on the status
            const filter = status === "All" ? {} : { status: status };
        
            // Fetch agencies based on the filter
            const agencies = await Agency.find(filter);
            const totalCount = await Agency.countDocuments(filter);
        
            // Check if no agencies are found
            if (agencies.length === 0) {
                return res.status(404).json({
                    message: `No ${status === "All" ? "" : status} agencies found.`,
                    totalCount: 0,
                });
            }
        
            // Return the filtered list of agencies and total count
            res.status(200).json({
                message: `${status === "All" ? "All" : status} agencies fetched successfully`,
                totalCount: totalCount,
                data: agencies,
            });
        } catch (error) {
            console.error("Error fetching agencies:", error);
            res.status(500).json({ message: "Error fetching agencies" });
        }
        
    }

    async getVehicleWithAgencyId(req, res) {
        try {
            const agencyId = req.params.agencyId;
            if (!agencyId) {
                return res.status(400).json({ message: "agencyId required " });
            }
            const agencydata = await vehicleService.getVehiclesByAgencyService(
                agencyId
            );
            if (typeof agencydata === "string") {
                return res.status(200).json({ message: agencydata });
            }

            return res.status(200).json({
                message: "agency data fetched successfully",
                data: agencydata,
            });
        } catch (error) {
            console.error("Error fetching agencies:", error);
            res.status(500).json({ message: "Error fetching agencies" });
        }
    }

    async updateAgencyStatus(req, res) {
        try {
            const { agencyId, status } = req.body;
            if (!agencyId || !status) {
                return res
                    .status(400)
                    .json({ message: "Agency ID and status are required." });
            }
            const validStatuses = ["Approved", "Rejected"];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    message:
                        'Invalid status. Please provide either "Rejected" or "Approved".',
                });
            }
            const updatedAgency = await Agency.findOneAndUpdate(
                { agencyId },
                { status },
                { new: true } // Returns the updated document
            );
            if (!updatedAgency) {
                return res.status(404).json({ message: "Agency not found." });
            }
            return res.status(200).json({
                message: `Agency status successfully updated to ${status}.`,
                agency: updatedAgency,
            });
        } catch (error) {
            console.error("Error in updateAgencyStatus:", error);
            return res.status(500).json({ message: "Internal server error." });
        }
    }

    async getAllUser(req, res) {
        try {
            const customer = await Customer.find().select('-password');
            if (!customer || customer.length === 0) {
                return res.status(404).json({ message: "No users found." });
            }
            return res.status(200).json({
                message: "Customer data fetched successfully",
                data: customer,
            });
        } catch (error) {
            console.error("Error in getAllUser:", error);
            return res.status(500).json({ message: "Internal server error." });
        }
    }

    async getUserDetails(req, res) {
        try {
            const customerId = req.params.customerId;
            if (!customerId) {
                return res.status(400).json({ message: "Customer ID is required." });
            }
            const findCustomer = await customerService.getCustomerDetailsService(customerId);
            if (typeof findCustomer === 'string') {
                return res.status(404).json({ message: findCustomer });
            }

            return res.status(200).json({
                message: 'Details fetched successfully',
                data: findCustomer,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to fetch agency details' });
        }
    }

    async getCounts(req, res) {
        try {

            const agencyCount = await Agency.countDocuments();
            const vehicleCount = await Vehicle.countDocuments();
            const userCount = await Customer.countDocuments();

            return res.status(200).json({
                message: 'Counts fetched successfully.',
                data: {
                    agencies: agencyCount,
                    vehicles: vehicleCount,
                    users: userCount
                }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'An error occurred while fetching counts.' });
        }
    }

    async deleteUser(req, res) {
        try {
            const customerId = req.params.customerId;
            if (!customerId) {
                return res.status(400).json({ message: "Customer ID is required." });
            }
            const findCustomer = await Customer.findOneAndDelete({ customerId: customerId });
            if (!findCustomer || findCustomer.length === 0) {
                return res.status(400).json({ message: "Customer not found." });
            }
            return res.status(200).json({ message: 'user deleted successfully' });

        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: 'Internal server error while delete user'})
        }
    }

    async deleteAgency(req, res) {
        try {
            const agencyId = req.params.agencyId;
            if (!agencyId) {
                return res.status(400).json({ message: "Agency ID is required." });
            }
            const findAgency = await Agency.findOneAndDelete({ agencyId: agencyId });
            if (!findAgency || findAgency.length === 0) {
                return res.status(400).json({ message: "Agency not found." });
            }
            return res.status(200).json({ message: 'Agency deleted successfully' });

        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: 'Internal server error while delete Agency'})
        }
    }

}

const adminController = new ADMIN();
module.exports = adminController;
