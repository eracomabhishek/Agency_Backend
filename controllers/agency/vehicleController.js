const vehicleService = require("../../services/vehicleService");
const Vehicle = require("../../models/Vehicle");
const jwt = require("jsonwebtoken");

class VEHICLE {
    // Method to create a new vehicle
    async createVehicle(req, res) {
        try {
            const agencyId = req.user.agencyId;
            const {
                vehicleName,
                vehicleType,
                capacity,
                pricePerDay,
                pricePerHour,
                availability,
                features,
                description,
                exceedCharges,
            } = req.body;

            // Validate required fields
            const requiredFields = [
                "vehicleName",
                "vehicleType",
                "pricePerDay",
                "pricePerHour",
                "capacity",
                "description",
                "features",
                "availability",
                "exceedCharges",
            ];
            for (let field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(400).json({ message: `Please enter ${field}` });
                }
            }

            // Check if images were uploaded
            const files = req.files;
            if (!files || files.length === 0) {
                return res
                    .status(400)
                    .json({ message: "At least one image is required." });
            }

            const savedVehicle = await vehicleService.createVehicleService(
                req.body,
                req.files,
                agencyId
            );
            if (typeof savedVehicle === "string") {
                return res.status(400).json({ message: savedVehicle });
            }

            res.status(201).json({
                message: "Vehicle created successfully",
                data: savedVehicle,
            });
        } catch (error) {
            console.error(error);
            res
                .status(500)
                .json({ message: "An error occurred while adding vehicle." });
        }
    }

    // Method to get all vehicles
    async getVehicles(req, res) {
        try {
            const vehicles = await vehicleService.getAllVehiclesService();
            if (!vehicles || vehicles.length === 0) {
                return res.status(404).json({ message: "No vehicles found" });
            }
            res.status(200).json({
                message: "Vehicles retrieved successfully",
                data: vehicles,
            });
        } catch (error) {
            console.error("Error fetching vehicles:", error);
            res.status(500).json({
                message: error.message,
            });
        }
    }

    // Method to get rented vehicles by agencyId
    async getRentedVehicles(req, res) {
        try {
            const agencyId = req.params.agencyId;
            const vehicles = await vehicleService.getRentedVehiclesService(agencyId);
            if (!vehicles || vehicles.length === 0) {
                return res.status(404).json({ message: "No Rented Vehicle" });
            }
            res.status(200).json({
                message: "Vehicles retrieved successfully",
                data: vehicles,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error while fetching rented vehicles" });
        }
    }

    // Method to get vehicle by ID
    async getVehicleById(req, res) {
        const { vehicleId } = req.params;

        if (!vehicleId) {
            return res.status(400).json({ message: "Vehicle ID is required." });
        }

        try {
            // Call the service to find the vehicle by ID
            const vehicle = await vehicleService.findVehicleByIdService(vehicleId);

            if (!vehicle) {
                return res.status(404).json({ message: "Vehicle not found." });
            }

            res.status(200).json({
                message: "Vehicle retrieved successfully.",
                data: vehicle,
            });
        } catch (error) {
            console.error(error);
            res
                .status(500)
                .json({ message: "An error occurred while retrieving the vehicle." });
        }
    }

    // Method to get vehicles by agency ID
    async getVehiclesByAgency(req, res) {
        try {
            const agencyId = req.params.agencyId;
            const vehicles = await vehicleService.getVehiclesByAgencyService(
                agencyId
            );
            if (typeof vehicles === "string") {
                return res.status(404).json({ message: vehicles });
            }
            res
                .status(200)
                .json({ message: "Vehicles retrieved successfully", data: vehicles });
        } catch (error) {
            console.error(error);
            res
                .status(500)
                .json({
                    message: "An error occurred while retrieving the vehicle by agency",
                });
        }
    }

    // Method to get a single vehicle by registration number
    // async getVehicleByRegistrationNumber(req, res) {
    //     try {
    //         const vehicle = await vehicleService.getVehicleByRegistrationNumberService(req.params.registrationNumber);
    //         res.status(200).json({ message: 'Vehicle retrieved successfully', data: vehicle });
    //     } catch (error) {
    //         res.status(500).json({ message: error.message });
    //     }
    // }

    // Method to update vehicle
    async updateVehicle(req, res) {
        try {
            const vehicleId = req.params.vehicleId;
            const vehicle = await Vehicle.findOne({ vehicleId }); // Direct match for numeric vehicleId
            if (!vehicle) {
                return res.status(400).json({ message: "Vehicle not found." });
            }
            const updatedVehicle = await vehicleService.updateVehicleService(
                vehicleId,
                req.body,
                req.files
            );
            if (typeof updatedVehicle === "string") {
                return res.status(404).json({ message: updatedVehicle });
            }

            res
                .status(200)
                .json({
                    message: "Vehicle updated successfully",
                    data: updatedVehicle,
                });
        } catch (error) {
            console.error("Error updating vehicle:", error);
            res
                .status(500)
                .json({ message: "An error occurred while updating the vehicle." });
        }
    }

    // Method to delete a vehicle
    async deleteVehicle(req, res) {
        try {
            const deletedVehicle = await vehicleService.deleteVehicleService(
                req.params.vehicleId
            );
            if (typeof deletedVehicle === "string") {
                return res.status(404).json({ message: deletedVehicle });
            }
            res
                .status(200)
                .json({
                    message: "Vehicle deleted successfully",
                    data: deletedVehicle,
                });
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: error.message });
        }
    }

    async getTotalVehicles(req, res) {
        try {
            const agencyId = req.user.agencyId;
            const totalVehicleCount = await vehicleService.getTotalVehicleService(
                agencyId
            );
            if (typeof totalVehicleCount === "string") {
                return res.status(400).json({ message: totalVehicleCount });
            }
            if (totalVehicleCount === 0) {
                return res
                    .status(200)
                    .json({
                        message: "No vehicles found for this agency.",
                        totalVehicle: totalVehicleCount,
                    });
            }
            // If vehicles are found, return the count
            res
                .status(200)
                .json({
                    message: "Total vehicle count retrieved successfully.",
                    totalVehicle: totalVehicleCount,
                });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to retrieve vehicle count" });
        }
    }

    async vehicleBookingPeriod(req, res) {
        try {
            const vehicleId = req.params.vehicleId;
            if (!vehicleId) {
                return res.status(400).json({ message: "Vehicle ID is required." });
            }

            // Call the service to get the booking period
            const bookingPeriod = await vehicleService.vehicleBookingPeriodService(
                vehicleId
            );
            if (typeof bookingPeriod === "string") {
                return res.status(400).json({ message: bookingPeriod });
            }
            // Respond with the booking period if found
            res
                .status(200)
                .json({
                    message: "Vehicle booking period retrieved successfully.",
                    bookingPeriod: bookingPeriod,
                });
        } catch (error) {
            console.error(error);
            res
                .status(500)
                .json({
                    message:
                        "An error occurred while retrieving the booking period vehicle.",
                });
        }
    }
}

// Export an instance of the VehicleController
const vehicleController = new VEHICLE();
module.exports = vehicleController;

// const vehicleService = require('../../services/vehicleService');
// const jwt = require('jsonwebtoken');

// exports.createVehicle = async (req, res) => {
//     try {
//         const agencyId = req.user.agencyId; // Get the agencyId from the authenticated user (JWT token)

//         const savedVehicle = await vehicleService.createVehicleService(req.body, req.files, agencyId);

//         res.status(201).json({
//             message: 'Vehicle created successfully',
//             data: savedVehicle
//         });
//     } catch (error) {
//         // console.error('Error in createVehicle controller:', error);
//         res.status(400).json({ message: error.message });
//     }
// };

// // Get all vehicles
// exports.getVehicles = async (req, res) => {
//     try {
//         const vehicles = await vehicleService.getAllVehiclesService();
//         if (!vehicles || vehicles.length === 0) {
//             return res.status(404).json({ message: 'No vehicles found' });
//         }
//         res.status(200).json({
//             message: 'Vehicles retrieved successfully',
//             data: vehicles
//         });
//     } catch (error) {
//         console.error('Error fetching vehicles:', error);
//         res.status(500).json({
//             message: error.message
//         });
//     }
// };

// exports.getRentedVehicles = async (req, res) => {
//     try {
//         const agencyId = req.params.agencyId;
//         console.log("agency id",agencyId)
//         const vehicles = await vehicleService.getRentedVehicleService(agencyId);
//         if (!vehicles || vehicles.length === 0) {
//             return res.status(404).json({ message: 'No vehicles found' });
//         }
//         res.status(200).json({
//             message: 'Vehicles retrieved successfully',
//             data: vehicles
//         });
//     } catch (error) {
//         console.error('Error fetching Rented vehicles:', error);
//         res.status(500).json({
//             message: error.message
//         });
//     }
// };

// exports.getVehicleById = async (req, res) => {
//     const { vehicleId } = req.params;
//     console.log("Requested Vehicle ID:", vehicleId);

//     if (!vehicleId) {
//         return res.status(400).json({
//             message: 'Vehicle ID is required.',
//             data: null
//         });
//     }

//     try {
//         // Call the service function to find the vehicle by ID with agency details
//         const vehicle = await vehicleService.findVehicleByIdService(vehicleId);

//         if (!vehicle) {
//             return res.status(404).json({
//                 message: 'Vehicle not found.',
//                 data: null
//             });
//         }

//         res.status(200).json({
//             message: 'Vehicle retrieved successfully.',
//             data: vehicle
//         });
//     } catch (error) {
//         console.error('Error in getVehicleById controller:', error);
//         res.status(500).json({
//             message: error.message || 'An error occurred while retrieving the vehicle.',
//             data: null
//         });
//     }
// };

// // Get vehicles by agency ID
// exports.getVehiclesByAgency = async (req, res) => {
//     try {
//         const vehicles = await vehicleService.getVehiclesByAgencyService(req.params.agencyUid);
//         res.status(200).json({ message: 'Vehicles retrieved successfully', data: vehicles });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Get a single vehicle by registration number
// exports.getVehicleByRegistrationNumber = async (req, res) => {
//     try {
//         const vehicle = await vehicleService.getVehicleByRegistrationNumberService(req.params.registrationNumber);
//         res.status(200).json({ message: 'Vehicle retrieved successfully', data: vehicle });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Update vehicle
// exports.updateVehicle = async (req, res) => {
//     try {
//         console.log('Request body:', req.body); // To check the body content
//         console.log('Request files:', req.files); // To check the body files

//         const updatedVehicle = await vehicleService.updateVehicleService(req.params.registrationNumber, req.body, req.files);

//         res.status(200).json({
//             message: 'Vehicle updated successfully',
//             data: updatedVehicle,
//         });
//     } catch (error) {
//         console.error('Error updating vehicle:', error);
//         res.status(500).json({
//             message: 'Error updating vehicle',
//             error: error.message,
//         });
//     }
// };

// // Delete a vehicle
// exports.deleteVehicle = async (req, res) => {
//     try {
//         const deletedVehicle = await vehicleService.deleteVehicleService(req.params.vehicleId);
//         res.status(200).json({ message: 'Vehicle deleted successfully', data: deletedVehicle });
//     } catch (error) {
//         res.status(400).json({ message: 'Error deleting vehicle', error: error.message });
//     }
// };
