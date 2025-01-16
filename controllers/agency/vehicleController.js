const vehicleService = require("../../services/vehicleService");
const Vehicle = require("../../models/Vehicle");
const jwt = require("jsonwebtoken");

class VEHICLE {
    // Method to create a new vehicle
    async createVehicle(req, res) {
        try {
            const agencyId = req.user.agencyId;
            const { vehicleName, vehicleType, capacity, pricePerDay, pricePerHour, availability, features, description, exceedCharges } = req.body;
            // Validate required fields
            const requiredFields = [ "vehicleName", "vehicleType", "pricePerDay", "pricePerHour", "capacity", "description", "features", "availability", "exceedCharges" ];
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

            const savedVehicle = await vehicleService.createVehicleService( req.body, req.files, agencyId );
            if (typeof savedVehicle === "string") {
                return res.status(400).json({ message: savedVehicle });
            }

           return res.status(201).json({
                message: "Vehicle created successfully",
                data: savedVehicle,
            });
        } catch (error) {
            console.error(error);
            return res
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
            return res.status(200).json({
                message: "Vehicles retrieved successfully",
                data: vehicles,
            });
        } catch (error) {
            console.error("Error fetching vehicles:", error);
            return res.status(500).json({
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
            return res.status(200).json({
                message: "Vehicles retrieved successfully",
                data: vehicles,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error while fetching rented vehicles" });
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

            if (typeof vehicle === 'string') {
                return res.status(404).json({ message: vehicle });
            }

            return res.status(200).json({
                message: "Vehicle retrieved successfully.",
                data: vehicle,
            });
        } catch (error) {
            console.error(error);
           return res
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
            return res
                .status(200)
                .json({ message: "Vehicles retrieved successfully", data: vehicles });
        } catch (error) {
            console.error(error);
            return res
                .status(500)
                .json({
                    message: "An error occurred while retrieving the vehicle by agency",
                });
        }
    }

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

            return res
                .status(200)
                .json({
                    message: "Vehicle updated successfully",
                    data: updatedVehicle,
                });
        } catch (error) {
            console.error("Error updating vehicle:", error);
            return res
                .status(500)
                .json({ message: "An error occurred while updating the vehicle." });
        }
    }

    // Method to delete a vehicle
    async deleteVehicle(req, res) {
        try {
            const deletedVehicle = await vehicleService.deleteVehicleService( req.params.vehicleId );
            if (typeof deletedVehicle === "string") {
                return res.status(404).json({ message: deletedVehicle });
            }
           return res.status(200).json({ message: "Vehicle deleted successfully",
                    data: deletedVehicle,
                });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: 'Server error Vehicle not delete' });
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
            return res
                .status(200)
                .json({
                    message: "Total vehicle count retrieved successfully.",
                    totalVehicle: totalVehicleCount,
                });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Failed to retrieve vehicle count" });
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
            return res.status(200).json({ message: "Vehicle booking period retrieved successfully.",
                bookingPeriod: bookingPeriod,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An error occurred while retrieving the booking period vehicle." });
        }
    }
}

const vehicleController = new VEHICLE();
module.exports = vehicleController;

