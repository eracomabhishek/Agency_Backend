const Vehicle = require('../models/Vehicle');
const Agency = require('../models/Agency');
const Booking = require('../models/Booking');

class VEHICLESERVICE {
    async createVehicleService(data, files, agencyId) {
        try {
            const { vehicleName, vehicleType, capacity, pricePerDay, pricePerHour, availability, features, description, exceedCharges } = data;

            // Check if the agency exists
            const agency = await Agency.findOne({ agencyId });
            if (!agency) {
                return 'Agency not found.';
            }

            // Extract the file paths from files
            const images = files.map((file) => file.path);

            // Create a new vehicle and include the agencyId and agencyName
            const vehicle = new Vehicle({
                agencyId,
                agencyName: agency.agencyName,
                vehicleName,
                vehicleType,
                capacity,
                description,
                exceedCharges,
                pricePerDay,
                pricePerHour,
                availability: availability ?? true,
                features: features || [],
                images: images || [],
            });

            // Save the vehicle to the database
            const savedVehicle = await vehicle.save();

            // Increment the totalVehicle count in the Agency schema
            agency.totalVehicle = agency.totalVehicle + 1;
            await agency.save();

            return savedVehicle;
        } catch (error) {
            console.error(error);
            return 'Error creating vehicle service.';
        }

    }


    async findVehicleByIdService(vehicleId) {
        try {
            if (!vehicleId) {
                return null; // Return null for invalid vehicleId
            }
            const vehicle = await Vehicle.findOne({ vehicleId });
            if (!vehicle) {
                return 'Vehicle does not exist.';
            }
            return vehicle;
        } catch (error) {
            console.error(error);
            return 'Internaal server error';
        }
    }


    async getAllVehiclesService() {
        try {
            // Fetch all vehicles
            const vehicles = await Vehicle.find();
            // For each vehicle, fetch the agency details based on agencyId
            const vehiclesWithAgencyDetails = await Promise.all(
                vehicles.map(async (vehicle) => {
                    const agency = await Agency.findOne({ agencyId: vehicle.agencyId });
                    return {
                        ...vehicle.toObject(),
                        agencyName: agency ? agency.agencyName : 'Unknown Agency', // Adding agencyName manually
                    };
                })
            );

            return vehiclesWithAgencyDetails;
        } catch (error) {
            console.error(error);
            return 'Error retrieving vehicles from the database';
        }
    }

    async getRentedVehiclesService(agencyId) {
        try {
            const vehicles = await Booking.find({ agencyId }).populate('vehicleId');
            return vehicles;
        } catch (error) {
            console.error('Error in get Rented Vehicles service:', error);
            return 'Error retrieving rented vehicles from the database';
        }
    }

    async getVehiclesByAgencyService(agencyId) {
        try{
            const vehicles = await Vehicle.find({ agencyId });
            if (vehicles.length === 0) {
                return 'No vehicles found for this agency.';
            }
            return vehicles;
        }
        catch(error){
            console.error('Error in get Vehicles By Agency service:', error);
            return 'Error retrieving vehicles from the database';
        }
    }


    async updateVehicleService(vehicleId, updates, files) {
        try {
            // Prepare the update object
            const updateData = {};
    
            if (updates.vehicleName) updateData.vehicleName = updates.vehicleName;
            if (updates.vehicleType) updateData.vehicleType = updates.vehicleType;
            if (updates.capacity) updateData.capacity = updates.capacity;
            if (updates.description) updateData.description = updates.description;
            if (updates.pricePerDay) updateData.pricePerDay = updates.pricePerDay;
            if (updates.availability) updateData.availability = updates.availability;
            if (updates.features) {
                updateData.features = Array.isArray(updates.features) ? updates.features : [updates.features];
            }
    
            // Handle images if files are provided
            if (files && files.length > 0) {
                updateData.images = files.map((file) => file.path);
            }
    
            // Find and update the vehicle
            const updatedVehicle = await Vehicle.findOneAndUpdate(
                { vehicleId }, // Direct match for numeric vehicleId
                { $set: updateData },
                { new: true } // Return the updated document
            );
    
            if (!updatedVehicle) {
                return 'Vehicle not found.';
            }
            return updatedVehicle;
        } catch (error) {
            console.error('Error updating vehicle:', error);
            return 'Failed to update vehicle service.';
        }
    }
    

    async  deleteVehicleService(vehicleId) {
        try {
            console.log("vehicle id", vehicleId)
            const deletedVehicle = await Vehicle.findOneAndDelete({ vehicleId });
            if (!deletedVehicle) {
                return { status: false , message:'Vehicle not found.'};
            }
            const updatedAgency = await Agency.findByIdAndUpdate(
                deletedVehicle.agencyId, 
                { $inc: { totalVehicle: -1 } }, 
                { new: true } 
            );
            if (!updatedAgency) {
                return { status: false, message:'Failed to update agency vehicle count.'};
            }

            return { status:true , message: 'Delete vehicle successfully' , data: deletedVehicle };
        } catch (error) {
            console.error(error);
            return { status: false, message:'Failed to delete vehicle service.'};
        }
        
    }

    async getTotalVehicleService(agencyId) {
        try {
            const vehicleCount = await Vehicle.countDocuments({ agencyId });
            if(!vehicleCount)
            return 'No vehicles found for the given agency. ';
        } catch (error) {
            console.error(error);
            return 'Error updating vehicle count service' // Return error message if any
        }
    }

    async vehicleBookingPeriodService(vehicleId) {
        try {
            // Find all bookings for the given vehicleId
            const bookings = await Booking.find({ vehicleId });
    
            // Check if no bookings are found
            if (!bookings || bookings.length === 0) {
                return 'No bookings found for the given vehicle.';
            }
    
            // Extract startDate and endDate for each booking
            const bookingPeriods = bookings.map((booking) => ({
                startDate: booking.startDate,
                endDate: booking.endDate,
            }));
    
            return bookingPeriods; // Return the array of booking periods
        } catch (error) {
            console.error('Error fetching booking periods:', error);
            return 'Error fetching booking periods';
        }
    }
    


}

const vehicleService = new VEHICLESERVICE();
module.exports = vehicleService;

