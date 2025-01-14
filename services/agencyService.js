const bcrypt = require('bcrypt');
const Agency = require('../models/Agency');
const Booking = require('../models/Booking');
const validationUtils = require('../utils/validator');


class AGENCYSERVICE {

    // Service to validate agency data
    async validateAgencyData(data) {
        try {
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
        } catch (error) {
            console.error(error);
            return 'An error occurred while validating the agency data.';
        }
    }

    async createAgencyService(data) {
        try {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            data.password = hashedPassword;
            const agency = new Agency(data);
            return agency.save();
        }
        catch (error) {
            console.error(error);
            return 'An error occurred while creating the agency.';
        }

    }


    // Service to validate login data
    async validateLoginDataService(data) {
        try {
            const { contactEmail, password } = data;
            if (!contactEmail || !password) {
                return 'Email and password are required.';
            }
            return null;
        }
        catch (error) {
            console.error(error);
            return 'An error occurred while validating the login data.';
        }

    }

    // Service to authenticate the agency
    async authenticateAgencyService(data) {
        try {
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

        } catch (error) {
            console.error(error)
            return 'An error occurred while authenticating the agency.';
        }
    }

    // Service to validate and update agency profile
    async updateAgencyProfileService(agencyId, updatedData) {
        try {
            const agency = await Agency.findOne({ agencyId: agencyId });

            if (!agency) {
                return 'Agency not found.';
            }

            // validate email
            if (updatedData.contactEmail && updatedData.contactEmail !== agency.contactEmail) {
                if (!validationUtils.isValidEmail(updatedData.contactEmail)) {
                    return 'Invalid email format.';
                }
                const existingEmail = await Agency.findOne({ contactEmail: updatedData.contactEmail });
                if (existingEmail && existingEmail._id.toString() !== agencyId) {
                    return 'Email is already in use by another agency.';
                }
            }

            // Validate phone number if provided
            if (updatedData.phoneNumber && updatedData.phoneNumber !== agency.phoneNumber) {
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
            if (updatedData.businessLicenseNumber && updatedData.businessLicenseNumber !== agency.businessLicenseNumber) {
                const existingLicense = await Agency.findOne({ businessLicenseNumber: updatedData.businessLicenseNumber });
                if (existingLicense && existingLicense._id.toString() !== agencyId) {
                    return 'Business License Number is already in use.';
                }
            }

            // Validate agency name if provided and ensure it's unique
            if (updatedData.agencyName && updatedData.agencyName !== agency.agencyName) {
                const existingAgency = await Agency.findOne({ agencyName: updatedData.agencyName });
                if (existingAgency && existingAgency._id.toString() !== agencyId) {
                    return 'Agency name is already in use.';
                }
            }

            // Use findOneAndUpdate to update the agency profile in a single operation
            const updatedAgency = await Agency.findOneAndUpdate(
                { agencyId: agencyId },  // filter to find the agency
                {
                    $set: {
                        agencyName: updatedData.agencyName,
                        contactPerson: updatedData.contactPerson,
                        contactEmail: updatedData.contactEmail,
                        phoneNumber: updatedData.phoneNumber,
                        businessLicenseNumber: updatedData.businessLicenseNumber,
                        officeAddress: updatedData.officeAddress,
                        serviceLocations: updatedData.serviceLocations,
                    }
                },  // fields to update
                { new: true }  // return the updated document
            );

            if (!updatedAgency) {
                return 'Agency update failed.';
            }

            return updatedAgency; // Return the updated agency profile
        }
        catch (error) {
            console.error(error);
            return 'Error updating agency profile.';
        }

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
            const totalRented = await Booking.countDocuments({ agencyId: agencyId });
            const agency = await Agency.findOne({ agencyId: agencyId });

            return {
                totalRented,
                totalVevicle: agency.totalVehicle,
                agencyName: agency.agencyName,
                bookingCounts: counts,
            };
        } catch (error) {
            console.error('Error in getBookingCountService:', error); // Detailed error log
            return 'An error occurred while fetching booking or vehicle counts.';
        }
    }

    async getAgencyDetailsByService(agencyId) {
        try {
            const agency = await Agency.findOne({ agencyId: agencyId }).select('-password');
            if (!agency) {
                return 'Agency not found';
            }
            return agency; 
        } catch (error) {
            console.error('Error fetching agency details:', error);
            return 'An error occurred while fetching agency details';
        }
    }





}

const agencyService = new AGENCYSERVICE();
module.exports = agencyService;










