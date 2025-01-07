const bcrypt = require('bcrypt');
const Agency = require('../models/Agency');
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
}

const agencyService = new AGENCYSERVICE();
module.exports = agencyService;















// const bcrypt = require('bcrypt');
// const Agency = require('../models/Agency');


// // Utility function for email validation
// const isValidEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
// };
// // Utility function for phone number validation
// const isValidPhoneNumber = (phone) => {
//     const phoneRegex = /^\+\d{1,4}\s?\d{10}$/; // Adjust regex based on format requirements
//     return phoneRegex.test(phone);
// };

// const isValidPassword = (password) => {
//     const passwordRegex = /(?=.*[A-Za-z])(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
//     return passwordRegex.test(password);
// }

// // Service to validate agency data
// const validateAgencyData = async (data) => {
//     const requiredFields = [
//         'agencyName',
//         'contactPerson',
//         'contactEmail',
//         'password',
//         'phoneNumber',
//         'businessLicenseNumber',
//     ];

//     // Check for missing required fields
//     for (let field of requiredFields) {
//         if (!data[field]) {
//             throw new Error(`The field ${field} is required.`);
//         }
//     }

//     // Validate email format
//     if (!isValidEmail(data.contactEmail)) {
//         throw new Error('Invalid email format.');
//     }

//     // Validate phone number format
//     if (!isValidPhoneNumber(data.phoneNumber)) {
//         throw new Error('Invalid phone number format.');
//     }

//     // Validate password
//     if(!isValidPassword(data.password)){
//         throw new Error('Invalid password format')
//     }

//     // Validate address if provided
//     if (data.officeAddress) {
//         const { street, city, state, postalCode, country } = data.officeAddress;
//         const addressFields = { street, city, state, postalCode, country };
//         for (const [key, value] of Object.entries(addressFields)) {
//             if (!value) {
//                 throw new Error(`Address field '${key}' is required.`);
//             }
//         }
//     } else {
//         throw new Error('Complete address is required....');
//     }

//     const existingAgency = await Agency.findOne({
//         $or: [
//             { businessLicenseNumber: data.businessLicenseNumber },
//             { agencyName: data.agencyName },
//             { contactEmail: data.contactEmail },
//             { phoneNumber: data.phoneNumber },
//         ],
//     });

//     if (existingAgency) {
//         if (existingAgency.agencyName === data.agencyName) {
//             throw new Error('Agency name already exists.');
//         }
//         if (existingAgency.businessLicenseNumber === data.businessLicenseNumber) {
//             throw new Error('Business License Number already exists.');
//         }
//         if (existingAgency.contactEmail === data.contactEmail) {
//             throw new Error('Email already exists.');
//         }
//         if (existingAgency.phoneNumber === data.phoneNumber) {
//             throw new Error('Phone Number already exists.');
//         }
//     }
// };

// // Service to create a new agency
// exports.createAgencyService = async (data) => {
//     // Validate the data
//     await validateAgencyData(data);

//     // Hash the password before saving
//     const hashedPassword = await bcrypt.hash(data.password, 10);
//     data.password = hashedPassword;

//     // Save the agency to the database
//     const agency = new Agency(data);
//     return await agency.save();
// };

// // Service to validate login data
// exports.validateLoginData = (data) => {
//     const { contactEmail, password } = data;

//     if (!contactEmail || !password) {
//         throw new Error('Email and password are required.');
//     }
// };
// // Service to authenticate the agency
// exports.authenticateAgency = async (contactEmail, password) => {
//     // Find agency by email
//     const agency = await Agency.findOne({ contactEmail });

//     if (!agency) {
//         throw new Error('Invalid email.');
//     }

//     // Check if the password matches
//     const isPasswordValid = await bcrypt.compare(password, agency.password);

//     if (!isPasswordValid) {
//         throw new Error('Invalid password.');
//     }

//     return agency; 
// };


// // Service to validate and update agency profile
// exports.updateAgencyProfileService = async (agencyId, updatedData) => {
    
//     const agency = await Agency.findOne({ agencyId: agencyId });

//     if (!agency) {
//         throw new Error('Agency not found.');
//     }

//     // Validate email if provided
//     if (updatedData.contactEmail) {
//         if (!isValidEmail(updatedData.contactEmail)) {
//             throw new Error('Invalid email format.');
//         }

//         // Check if email already exists
//         const existingEmail = await Agency.findOne({ contactEmail: updatedData.contactEmail });
//         if (existingEmail && existingEmail._id.toString() !== userId) {
//             throw new Error('Email is already in use.');
//         }
//     }


//     // Validate and handle password change logic
//     if (updatedData.oldPassword && updatedData.newPassword) {
//         const isMatch = await bcrypt.compare(updatedData.oldPassword, agency.password);
//         if (!isMatch) {
//             throw new Error('Old password is incorrect.');
//         }

//         // Validate the new password
//         if (updatedData.newPassword.length < 6) {
//             throw new Error('New password must be at least 6 characters long.');
//         }

//         // Hash the new password before saving it
//         const salt = await bcrypt.genSalt(10);
//         updatedData.password = await bcrypt.hash(updatedData.newPassword, salt);
//     }

//     // Validate phone number if provided
//     if (updatedData.phoneNumber) {
//         if (!isValidPhoneNumber(updatedData.phoneNumber)) {
//             throw new Error('Invalid phone number format.');
//         }

//         // Check if phone number already exists
//         const existingPhone = await Agency.findOne({ phoneNumber: updatedData.phoneNumber });
//         if (existingPhone && existingPhone._id.toString() !== userId) {
//             throw new Error('Phone number is already in use.');
//         }
//     }

//     // Validate business license number if provided and ensure it's unique
//     if (updatedData.businessLicenseNumber) {
//         const existingLicense = await Agency.findOne({ businessLicenseNumber: updatedData.businessLicenseNumber });
//         if (existingLicense && existingLicense._id.toString() !== userId) {
//             throw new Error('Business License Number is already in use.');
//         }
//     }

//     // Validate agency name if provided and ensure it's unique
//     if (updatedData.agencyName) {
//         const existingAgency = await Agency.findOne({ agencyName: updatedData.agencyName });
//         if (existingAgency && existingAgency._id.toString() !== userId) {
//             throw new Error('Agency name is already in use.');
//         }
//     }

//     // Update fields if they are present in the updatedData
//     if (updatedData.agencyName) agency.agencyName = updatedData.agencyName;
//     if (updatedData.contactPerson) agency.contactPerson = updatedData.contactPerson;
//     if (updatedData.contactEmail) agency.contactEmail = updatedData.contactEmail;
//     if (updatedData.phoneNumber) agency.phoneNumber = updatedData.phoneNumber;
//     if (updatedData.businessLicenseNumber) agency.businessLicenseNumber = updatedData.businessLicenseNumber;
//     // Merge officeAddress fields instead of overwriting
//         if (updatedData.officeAddress) {
//             agency.officeAddress = {
//                 ...agency.officeAddress.toObject(), // Convert Mongoose subdocument to plain object
//                 ...updatedData.officeAddress, // Merge with updated fields
//             };
//         }
//     if (updatedData.serviceLocations) agency.serviceLocations = updatedData.serviceLocations;
//     if (updatedData.password) agency.password = updatedData.password;

//     // Save the updated agency document
//     const updatedAgency = await agency.save();

//     return updatedAgency; // Return the updated agency profile
// };


