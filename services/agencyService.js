const bcrypt = require('bcrypt');
const Agency = require('../models/Agency');
const Booking = require('../models/Booking');
const validationUtils = require('../utils/validator');


class AGENCYSERVICE {
   
    // Service to validate agency data
    async validateAgencyData(data) {
        const requiredFields = [
            'agencyName',
            'contactPerson',
            'contactEmail',
            'password',
            'phoneNumber',
            'businessLicenseNumber',
        ];

        for (const field of requiredFields) {
            if (!data[field]) {
                return `The ${field} is required.`;
            }
        }

        if (!validationUtils.isValidEmail(data.contactEmail)) {
            return 'Invalid email format.';
        }

        if (!validationUtils.isValidPhoneNumber(data.phoneNumber)) {
            return 'Invalid phone number format.';
        }

        if (!validationUtils.isValidPassword(data.password)) {
            return 'Invalid password format.';
        }

        if (data.officeAddress) {
            const { street, city, state, postalCode, country } = data.officeAddress;
            for (const [key, value] of Object.entries({ street, city, state, postalCode, country })) {
                if (!value) {
                    return `Address ${key} is required.`;
                }
            }
        } else {
            return 'Complete address is required.';
        }

        const existingAgency = await Agency.findOne({
            $or: [
                { businessLicenseNumber: data.businessLicenseNumber },
                { agencyName: data.agencyName },
                { contactEmail: data.contactEmail },
                { phoneNumber: data.phoneNumber },
            ],
        });

        if (existingAgency) {
            if (existingAgency.agencyName === data.agencyName) {
                return 'Agency name already exists.';
            }
            if (existingAgency.businessLicenseNumber === data.businessLicenseNumber) {
                return 'Business License Number already exists.';
            }
            if (existingAgency.contactEmail === data.contactEmail) {
                return 'Email already exists.';
            }
            if (existingAgency.phoneNumber === data.phoneNumber) {
                return 'Phone Number already exists.';
            }
        }

        return null;
    }

    async createAgencyService(data) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;

        const agency = new Agency(data);
        return agency.save();
    }
      

    // Service to validate login data
    async validateLoginDataService(data) {
        const { contactEmail, password } = data;

        if (!contactEmail || !password) {
            return 'Email and password are required.'; // Return a string error message
        }

        return null; // Return null if no validation error
    }

    // Service to authenticate the agency
    async authenticateAgencyService(data) {
        const { contactEmail, password } = data;
        // Find agency by email
        const agency = await Agency.findOne({ contactEmail });

        if (!agency) {
            return 'Email not Registered';
        }

        // Check if the password matches
        const isPasswordValid = await bcrypt.compare(password, agency.password);

        if (!isPasswordValid) {
            return 'Invalid password.';
        }

        return agency; 
    }

    // Service to validate and update agency profile
    async updateAgencyProfileService(agencyId, updatedData) {
        const agency = await Agency.findOne({ agencyId: agencyId });

        if (!agency) {
            return 'Agency not found.';
        }

        // Validate email if provided
        if (updatedData.contactEmail) {
            if (!validationUtils.isValidEmail(updatedData.contactEmail)) {
                return 'Invalid email format.';
            }

            // Check if email already exists
            const existingEmail = await Agency.findOne({ contactEmail: updatedData.contactEmail });
            if (existingEmail && existingEmail._id.toString() !== agencyId) {
                return 'Email is already in use.';
            }
        }

        // Validate and handle password change logic
        if (updatedData.oldPassword && updatedData.newPassword) {
            if(!validationUtils.isValidPassword(updatedData.newPassword)){
                return 'Invalid password format.';
            }
            const isMatch = await bcrypt.compare(updatedData.oldPassword, agency.password);
            if (!isMatch) {
                return 'Old password is incorrect.';
            }

            // Validate the new password
            if (updatedData.newPassword.length < 6) {
                return 'New password must be at least 6 characters long.';
            }

            // Hash the new password before saving it
            const salt = await bcrypt.genSalt(10);
            updatedData.password = await bcrypt.hash(updatedData.newPassword, salt);
        }

        // Validate phone number if provided
        if (updatedData.phoneNumber) {
            if (!validationUtils.isValidPhoneNumber(updatedData.phoneNumber)) {
                return 'Invalid phone number format.';
            }

            // Check if phone number already exists
            const existingPhone = await Agency.findOne({ phoneNumber: updatedData.phoneNumber });
            if (existingPhone && existingPhone._id.toString() !== agencyId) {
                return 'Phone number is already in use.';
            }
        }

        // Validate business license number if provided and ensure it's unique
        if (updatedData.businessLicenseNumber) {
            const existingLicense = await Agency.findOne({ businessLicenseNumber: updatedData.businessLicenseNumber });
            if (existingLicense && existingLicense._id.toString() !== agencyId) {
                return 'Business License Number is already in use.';
            }
        }

        // Validate agency name if provided and ensure it's unique
        if (updatedData.agencyName) {
            const existingAgency = await Agency.findOne({ agencyName: updatedData.agencyName });
            if (existingAgency && existingAgency._id.toString() !== agencyId) {
                return 'Agency name is already in use.';
            }
        }

        // Update fields if they are present in the updatedData
        if (updatedData.agencyName) agency.agencyName = updatedData.agencyName;
        if (updatedData.contactPerson) agency.contactPerson = updatedData.contactPerson;
        if (updatedData.contactEmail) agency.contactEmail = updatedData.contactEmail;
        if (updatedData.phoneNumber) agency.phoneNumber = updatedData.phoneNumber;
        if (updatedData.businessLicenseNumber) agency.businessLicenseNumber = updatedData.businessLicenseNumber;
        
        if (updatedData.officeAddress) {
            agency.officeAddress = {
                ...agency.officeAddress.toObject(), // Convert Mongoose subdocument to plain object
                ...updatedData.officeAddress, // Merge with updated fields
            };
        }

        if (updatedData.serviceLocations) agency.serviceLocations = updatedData.serviceLocations;
        if (updatedData.password) agency.password = updatedData.password;

        // Save the updated agency document
        const updatedAgency = await agency.save();

        return updatedAgency; // Return the updated agency profile
    }

    
    // Service function
    async getBookingCountService(agencyId) {
    try {
        const bookingCounts = await Booking.aggregate([
            { $match: { agencyId: agencyId } }, // Match bookings for the given agencyId
            {
                $group: {
                    _id: "$bookingStatus",
                    count: { $sum: 1 }
                }
            }
        ]);
        const counts = {
            pending: 0,
            confirmed: 0,
            cancelled: 0,
            approved: 0
        };
        // Populate counts object
        bookingCounts.forEach(item => {
            counts[item._id.toLowerCase()] = item.count;
        });
        const totalVehicles = await Booking.countDocuments({ agencyId: agencyId });
        const agency = await Agency.findOne({ agencyId: agencyId });
        
        return {
            totalVehicles,
            agencyName: agency.agencyName,
            bookingCounts: counts,
        };
    } catch (error) {
        console.error('Error in getBookingCountService:', error); // Detailed error log
        throw new Error('An error occurred while fetching booking or vehicle counts.');
    }
}



// Controller function
// async getBookingPending(req, res) {
//     try {
//         const agencyId = req.user.agencyId; // Extract agencyId from the authenticated user
//         const { bookingId } = req.params; // Extract bookingId from request parameters

//         // Validate bookingId presence
//         if (!bookingId) {
//             return res.status(400).json({ message: 'Booking ID is required' });
//         }

//         // Call the service to get pending bookings
//         const result = await agencyService.getBookingPendingService(bookingId, agencyId);

//         // Check the result and send appropriate response
//         if (typeof result === 'string') {
//             return res.status(400).json({ message: result }); // Error message from service
//         }

//         // Send pending bookings to the frontend
//         return res.status(200).json({ pendingBookings: result });
//     } catch (error) {
//         console.error('Error fetching booking details:', error.message);
//         res.status(500).json({ message: 'Failed to fetch booking details', error: error.message });
//     }
// }


    // async getBookingConfirmedService(agencyId) {
    //     try {
    //         const confirmedBookings = await Booking.find({ agencyId: agencyId, bookingStatus: 'Confirmed' });
    //         if (!confirmedBookings || confirmedBookings.length === 0) {
    //             return 'No Confirmed bookings found for the given agency.';
    //         }
    //         return confirmedBookings;
    //     } catch (error) {
    //         console.error('Error fetching Confirmed bookings:', error.message);
    //         throw new Error('An error occurred while fetching Confirmed bookings.');
    //     }
    // }

    // async getBookingCancelledService(agencyId) {
    //     try {
    //         const cancelledBookings = await Booking.find({ agencyId: agencyId, bookingStatus: 'Cancelled' });
    //         if (!cancelledBookings || cancelledBookings.length === 0) {
    //             return 'No Cancelled bookings found for the given agency.';
    //         }
    //         return cancelledBookings;
    //     } catch (error) {
    //         console.error('Error fetching Cancelled bookings:', error.message);
    //         throw new Error('An error occurred while fetching Cancelled bookings.');
    //     }
    // }


}

const agencyService = new AGENCYSERVICE();
module.exports = agencyService;










