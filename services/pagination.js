const Vehicle = require('../models/Vehicle');
const Agency = require('../models/Agency');

class PAGINATIONSERVICE {
    // Pagination service
    async paginateVehicles(queryParams) {
        const { page = 1, limit = 6, agencyName, vehicleName, vehicleType, availability } = queryParams;
        console.log("Fetching vehicles with pagination...");

        // Build the query object for filtering
        let query = {};

        if (agencyName) {
            // This query will search for the agencyName in the related Agency document
            query['agencyId'] = {
                $in: await Agency.find({ agencyName: { $regex: agencyName, $options: 'i' } }).select('_id'), // Case-insensitive search
            };
        }

        if (vehicleName) {
            query['vehicleName'] = { $regex: vehicleName, $options: 'i' }; // Case-insensitive search
        }

        if (vehicleType) {
            query['vehicleType'] = { $regex: vehicleType, $options: 'i' }; // Case-insensitive search
        }

        if (availability !== undefined) {
            query['availability'] = availability === 'true'; // Convert string to boolean
        }

        try {
            // Get the total count of filtered vehicles
            const totalVehicles = await Vehicle.countDocuments(query);

            // Fetch the vehicles with pagination
            const vehicles = await Vehicle.find(query)
                .skip((page - 1) * limit) // Skip vehicles based on the page number
                .limit(parseInt(limit)) // Limit the number of vehicles returned
                .populate('agencyId', 'agencyName contactEmail phoneNumber officeAddress serviceLocations'); // Populate agency details

            return {
                success: true,
                data: vehicles,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalVehicles / limit),
                    totalVehicles,
                },
            };
        } catch (error) {
            console.error("Error fetching vehicles:", error.message);
            throw new Error('Error fetching vehicles');
        }
    }

    // Options service
    async fetchOptions() {
        try {
            // Get unique agencyNames, vehicleTypes, and vehicleNames from the database
            const agencyNames = await Agency.distinct('agencyName');
            const vehicleTypes = await Vehicle.distinct('vehicleType');
            const vehicleNames = await Vehicle.distinct('vehicleName');
            const availability = await Vehicle.distinct('availability');

            return { agencyNames, vehicleTypes, vehicleNames, availability };
        } catch (error) {
            console.error("Error fetching options:", error.message);
            throw new Error('Error fetching options');
        }
    }
}

const paginationService = new PAGINATIONSERVICE();
module.exports = paginationService;






// const Vehicle = require('../models/Vehicle'); 
// const Agency = require('../models/Agency');   

// exports.pagination = async (req, res) => {
//     const { page = 1, limit = 6, agencyName, vehicleName, vehicleType, availability } = req.query;
//     console.log("Fetching vehicles with pagination...");

//     // Build the query object for filtering
//     let query = {};

//     if (agencyName) {
//         // This query will search for the agencyName in the related Agency document
//         query['agencyId'] = { $in: await Agency.find({ agencyName: { $regex: agencyName, $options: 'i' } }).select('_id') };  // Case-insensitive search
//     }

//     if (vehicleName) {
//         query['vehicleName'] = { $regex: vehicleName, $options: 'i' };  // Case-insensitive search
//     }

//     if (vehicleType) {
//         query['vehicleType'] = { $regex: vehicleType, $options: 'i' };  // Case-insensitive search
//     }

//     if (availability !== undefined) {
//         query['availability'] = availability === 'true'; // Convert string to boolean
//     }

//     try {
//         // Get the total count of filtered vehicles
//         const totalVehicles = await Vehicle.countDocuments(query);

//         const vehicles = await Vehicle.find(query)
//             .skip((page - 1) * limit)  
//             .limit(parseInt(limit))    
//             .populate('agencyId', 'agencyName contactEmail phoneNumber officeAddress serviceLocations')  

//         res.json({
//             success: true,
//             data: vehicles,
//             pagination: {
//                 currentPage: parseInt(page),
//                 totalPages: Math.ceil(totalVehicles / limit),
//                 totalVehicles,
//             },
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching vehicles', error: error.message });
//     }
// };



// exports.options = async (req, res) => {
//     try {
//         // Get unique agencyNames, vehicleTypes, and vehicleNames from the database
//         const agencyNames = await Agency.distinct('agencyName');  
//         const vehicleTypes = await Vehicle.distinct('vehicleType'); 
//         const vehicleNames = await Vehicle.distinct('vehicleName'); 
//         const availability = await Vehicle.dsitinct('availability');

//         res.json({ agencyNames, vehicleTypes, vehicleNames, availability });
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching options', error: error.message });
//     }
// };



