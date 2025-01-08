const Vehicle = require('../models/Vehicle');
const Agency = require('../models/Agency');
const Booking = require('../models/Booking');

class VEHICLESERVICE{
    async createVehicleService(data, files, agencyId) {
       
        const { vehicleName, vehicleType, capacity, pricePerDay, pricePerHour, availability, features, description } = data;

        // Check if the agency exists
        const agency = await Agency.findOne({ agencyId });
        if (!agency) {
            throw new Error('Agency not found.');
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
            pricePerDay,
            pricePerHour,
            availability: availability ?? true,
            features: features || [],
            images: images || [],
        });

        // Save the vehicle to the database
        return await vehicle.save();
    }

    async findVehicleByIdService(vehicleId) {
        if (!vehicleId) {
            return null; // Return null for invalid vehicleId
        }
        try {
            const vehicle = await Vehicle.findOne({ vehicleId }); 
            return vehicle || null; 
        } catch (error) {
            console.error('Error in findVehicleById service:', error.message);
            return null; 
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
            console.error('Error in getAllVehicles service:', error);
            return 'Error retrieving vehicles from the database';
        }
    }

    async getRentedVehiclesService(agencyId) {
        try {
            const vehicles = await Booking.find({ agencyId }).populate('vehicleId');
            return vehicles;
        } catch (error) {
            console.error('Error in getRentedVehicles service:', error);
            throw new Error('Error retrieving rented vehicles from the database');
        }
    }

    async getVehiclesByAgencyService(agencyId) {
        const vehicles = await Vehicle.find({ agencyId });
        if (vehicles.length === 0) {
            throw new Error('No vehicles found for this agency.');
        }
        return vehicles;
    }

    // async getVehicleByRegistrationNumberService(registrationNumber) {
    //     const vehicle = await Vehicle.findOne({ registrationNumber }).populate('agencyId', 'agencyName');
    //     if (!vehicle) {
    //         throw new Error('Vehicle not found.');
    //     }
    //     return vehicle;
    // }

    async updateVehicleService(vehicleId, updates, files) {
        console.log("Received vehicleId:", vehicleId); // Log the vehicle ID to check the value
        console.log("Updates received:", updates); // Log the updates to debug

        // Find the vehicle by vehicleId
        const vehicle = await Vehicle.findOne({ vehicleId }); // Direct match for numeric vehicleId
        if (!vehicle) {
            throw new Error('Vehicle not found.');
        }

        console.log("Found vehicle:", vehicle); // Log the result of the query

        // Update the fields if provided
        if (updates.vehicleName) vehicle.vehicleName = updates.vehicleName;
        if (updates.vehicleType) vehicle.vehicleType = updates.vehicleType;
        if (updates.capacity) vehicle.capacity = updates.capacity;
        if (updates.description) vehicle.description = updates.description;
        if (updates.pricePerDay) vehicle.pricePerDay = updates.pricePerDay;
        if (updates.availability) vehicle.availability = updates.availability;
        if (updates.features) {
            vehicle.features = Array.isArray(updates.features) ? updates.features : [updates.features];
        }

        // Handle images if files are provided
        if (files && files.length > 0) {
            const images = files.map((file) => file.path);
            vehicle.images = images;
        }

        console.log("Modified vehicle before save:", vehicle); // Log the updated vehicle

        // Save the updated vehicle
        return await vehicle.save();
    }

    async deleteVehicleService(vehicleId) {
        const deletedVehicle = await Vehicle.findOneAndDelete({ vehicleId });
        if (!deletedVehicle) {
            throw new Error('Vehicle not found.');
        }
        return deletedVehicle;
    }
}

const vehicleService = new VEHICLESERVICE();
module.exports = vehicleService;

















// const Vehicle = require('../models/Vehicle');
// const Agency = require('../models/Agency');
// const Booking = require('../models/Booking');


// exports.createVehicleService = async (data, files, agencyId) => {
//     const { vehicleName, vehicleType, capacity, pricePerDay, pricePerHour, availability, features, description } = data;

//     // Validate required fields
//     const requiredFields = ['vehicleName', 'vehicleType', 'pricePerDay', 'pricePerHour', 'capacity', 'description', 'features', 'availability'];
//     for (let field of requiredFields) {
//         if (!data[field]) {
//             throw new Error(`The field ${field} is required.`);
//         }
//     }

//     // Check if images were uploaded
//     if (!files || files.length === 0) {
//         throw new Error('At least one image is required.');
//     }

//     // Extract the file paths from files
//     const images = files.map((file) => file.path);

//     // Check if the agency exists
//     const agency = await Agency.findOne({ agencyId:agencyId });
//     if (!agency) {
//         throw new Error('Agency not found.');
//     }

// //     const agency = await Agency.findOne({ agencyId: agencyId });  // Use findOne instead of find
// // if (!agency) {
// //     throw new Error('Agency not found.');
// // }

//     // Create a new vehicle and include the agencyId and agencyName
//     const vehicle = new Vehicle({
//         agencyId, 
//         agencyName: agency.agencyName, 
//         vehicleName,
//         vehicleType,
//         capacity,
//         description,
//         pricePerDay,
//         pricePerHour,
//         availability: availability ?? true, 
//         features: features || [], 
//         images: images || [], 
//     });

//     // Save the vehicle to the database
//     return await vehicle.save();
// };



// // get vehicle by ID
// exports.findVehicleByIdService = async (vehicleId) => {
//     if (!vehicleId) {
//         throw new Error('Vehicle ID is required.');
//     }
//     try {
//         const vehicle = await Vehicle.findOne({ vehicleId: vehicleId });

//         if (!vehicle) {
//             throw new Error('Vehicle not found.');
//         }
//         return vehicle; // Return the vehicle document
//     } catch (error) {
//         console.error('Error in findVehicleById service:', error.message);
//         throw error;
//     }
// };



// // Get all vehicles
// exports.getAllVehiclesService = async () => {
//     try {
//         // Fetch all vehicles
//         const vehicles = await Vehicle.find();
//         // For each vehicle, fetch the agency details based on agencyId
//         const vehiclesWithAgencyDetails = await Promise.all(
//             vehicles.map(async (vehicle) => {
//                 const agency = await Agency.findOne({ agencyId: vehicle.agencyId });
//                 return {
//                     ...vehicle.toObject(),
//                     agencyName: agency ? agency.agencyName : 'Unknown Agency', // Adding agencyName manually
//                 };
//             })
//         );

//         return vehiclesWithAgencyDetails;
//     } catch (error) {
//         console.error('Error in getAllVehiclesService:', error);
//         throw new Error('Error retrieving vehicles from the database');
//     }
// };

// exports.getRentedVehicleService = async (agencyId) => {
//     try {
//         const vehicles = await Booking.find({ agencyId: agencyId }).populate('vehicleId'); 
//         if(!vehicles){
//             throw new Error('Not rented Vehicle')
//         }
//         return vehicles;
//     } catch (error) {
//         console.error('Error in getAllVehicles service:', error);
//         throw new Error('Error retrieving Rented vehicles from the database');
//     }
// };

// // Get vehicles by agency ID
// exports.getVehiclesByAgencyService = async (agencyId) => {
//     const vehicles = await Vehicle.find({ agencyId:agencyId });
//     if (vehicles.length === 0) {
//         throw new Error('No vehicles found for this agency.');
//     }
//     return vehicles;
// };

// // Get vehicle by registration number
// // exports.getVehicleByRegistrationNumberService = async (registrationNumber) => {
// //     const vehicle = await Vehicle.findOne({ registrationNumber }).populate('agencyId', 'agencyName');
// //     if (!vehicle) {
// //         throw new Error('Vehicle not found.');
// //     }
// //     return vehicle;
// // };

// // Update vehicle details
// exports.updateVehicleService = async (vehicleId, updates, files) => {
//     console.log("Received vehicleId:", vehicleId); // Log the vehicle ID to check the value
//     console.log("Updates received:", updates); // Log the updates to debug

//     // Find the vehicle by vehicleId
//     const vehicle = await Vehicle.findOne({ vehicleId }); // Direct match for numeric vehicleId
//     if (!vehicle) {
//         throw new Error('Vehicle not found.');
//     }

//     console.log("Found vehicle:", vehicle); // Log the result of the query

//     // Update the fields if provided
//     if (updates.vehicleName) vehicle.vehicleName = updates.vehicleName;
//     if (updates.vehicleType) vehicle.vehicleType = updates.vehicleType;
//     if (updates.capacity) vehicle.capacity = updates.capacity;
//     if (updates.description) vehicle.description = updates.description;
//     if (updates.pricePerDay) vehicle.pricePerDay = updates.pricePerDay;
//     if (updates.availability ) vehicle.availability = updates.availability;
//     if (updates.features) {
//         vehicle.features = Array.isArray(updates.features) ? updates.features : [updates.features];
//     }

//     // Handle images if files are provided
//     if (files && files.length > 0) {
//         const images = files.map((file) => file.path);
//         vehicle.images = images;
//     }

//     console.log("Modified vehicle before save:", vehicle); // Log the updated vehicle

//     // Save the updated vehicle
//     return await vehicle.save();
// };



// // Delete a vehicle
// exports.deleteVehicleService = async (vehicleId) => {
//     const deletedVehicle = await Vehicle.findOneAndDelete({ vehicleId });
//     if (!deletedVehicle) {
//         throw new Error('Vehicle not found.');
//     }
//     return deletedVehicle;
// };


