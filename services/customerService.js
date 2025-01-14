const bcrypt = require("bcrypt");
const Customer = require("../models/Customer");
const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");
const validationUtils = require("../utils/validator");
require("dotenv").config();

class CUSTOMERSERVICE {
  // Validation function for customer data
  async validateCustomerData(data) {
    const requiredFields = ["fullName", "email", "phoneNumber", "password"];

    // Check for missing required fields
    for (let field of requiredFields) {
      if (!data[field]) {
        return `The field ${field} is required.`;
      }
    }

    // Validate email format
    if (!validationUtils.isValidEmail(data.email)) {
      return "Invalid email format.";
    }

    // Validate phone number format
    if (!validationUtils.isValidPhoneNumber(data.phoneNumber)) {
      return "Invalid phone number format.";
    }

    // Validate password
    if (!validationUtils.isValidPassword(data.password)) {
      return "Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long.";
    }

    // Validate address if provided
    if (data.address) {
      const { street, city, state, postalCode, country } = data.address;
      const addressFields = { street, city, state, postalCode, country };
      for (const [key, value] of Object.entries(addressFields)) {
        if (!value) {
          return `Address field '${key}' is required.`;
        }
      }
    } else {
      return "Complete address is required.";
    }

    // Check for existing customer
    const existingCustomer = await Customer.findOne({
      $or: [{ email: data.email }, { phoneNumber: data.phoneNumber }],
    });

    if (existingCustomer) {
      if (existingCustomer.email === data.email) {
        return "Email already exists.";
      }
      if (existingCustomer.phoneNumber === data.phoneNumber) {
        return "Phone number already exists.";
      }
    }
  }
  // Service: Register a new customer
  async registerCustomerService(data) {
    try {
        const { fullName, email, phoneNumber, password, address } = data;
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create a new customer object
        const customer = new Customer({
          fullName,
          email,
          phoneNumber,
          password: hashedPassword,
          address,
        });
    
        // Save the customer to the database
        return await customer.save();
    } catch (error) {
        console.error(error);
        return ;
    }
   
  }

  // Validate login data
  validateLoginData(data) {
    const { email, password } = data;

    if (!email || !password) {
      return"Email and password are required.";
    }
  }

  // Service: Login a customer
  async authenticateCustomer(email, password) {
    const customer = await Customer.findOne({ email });
    if (!customer) {
       return "Email not registered";
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return "Incorrect password.";
    }

    return customer;
  }

  // Service: Update customer details
  async updateCustomerService(customerId, updatedData) {
    // Find the customer by ID and update
    const customer = await Customer.findOne({ customerId: customerId });
    if (!customer) {
      return "Customer not found.";
    }

    // Validate email if provided
    if (updatedData.email && updatedCustomer.email !== customer.email) {
      if (!isValidEmail(updatedData.email)) {
        return "Invalid email format.";
      }

      // Check if email already exists
      const existingEmail = await Customer.findOne({ email: updatedData.email });
      if (existingEmail && existingEmail._id.toString() !== customerId) {
        return "Email is already in use.";
      }
    }

   
    // Validate phone number if provided
    if (updatedData.phoneNumber && updatedData.phoneNumber !== customer.phoneNumber) {
      if (!isValidPhoneNumber(updatedData.phoneNumber)) {
       return "Invalid phone number format.";
      }
      const existingPhone = await Customer.findOne({ phoneNumber: updatedData.phoneNumber });
      if (existingPhone && existingPhone._id.toString() !== customerId) {
        return "Phone number is already in use.";
      }
    }
        // Merge the existing address with the updated address fields if address is provided
        let updatedAddress = customer.address;
        if (updatedData.address) {
            updatedAddress = {
                ...customer.address.toObject(), // Convert Mongoose subdocument to plain object
                ...updatedData.address, // Merge with updated fields
            };
        }

     const updatedCustomer = await Customer.findOneAndUpdate(
        { customerId: customerId },  // filter to find the customer by customerId
        { 
            $set: {
                fullName: updatedData.fullName,
                email: updatedData.email,
                phoneNumber: updatedData.phoneNumber,
                address: updatedAddress,  // Assuming address is passed in updatedData directly
                password: updatedData.password,
            }
        },  // fields to update
        { new: true }  // return the updated document
    );

    // If no customer is found or update failed
    if (!updatedCustomer) {
        return 'Customer update failed.';
    }

    return updatedCustomer; // Return the updated customer profile

    // Update fields if they are present in the updatedData
    // if (updatedData.fullName) customer.fullName = updatedData.fullName;
    // if (updatedData.email) customer.email = updatedData.email;
    // if (updatedData.phoneNumber) customer.phoneNumber = updatedData.phoneNumber;

    // if (updatedData.address) {
    //   customer.address = {
    //     ...customer.address.toObject(), // Convert Mongoose subdocument to plain object
    //     ...updatedData.address, // Merge with updated fields
    //   };
    // }

    // if (updatedData.password) customer.password = updatedData.password;

    // // Save the updated customer document
    // const updatedCustomer = await customer.save();

    // return updatedCustomer; // Return the updated customer profile
  }

  // Get vehicles rented by a user
  async getUserRentedVehiclesService(customerId) {
    // Fetch bookings for the customer
    const bookings = await Booking.find({ customerId }).lean();

    if (!bookings || bookings.length === 0) {
      return "No rented vehicles found.";
    }

    // Fetch vehicle details for each booking
    const vehicleIds = bookings.map((booking) => booking.vehicleId);
    const vehicles = await Vehicle.find({
      vehicleId: { $in: vehicleIds },
    }).lean();

    // Combine bookings with vehicle details
    return bookings.map((booking) => {
      const vehicle = vehicles.find((v) => v.vehicleId === booking.vehicleId);
      return {
        ...booking,
        vehicleDetails: vehicle || null,
      };
    });
  }


   async getCustomerDetailsService(customerId) {
          try {
            const findCustomer = await Customer.findOne({ customerId }).select('-password');
            if (!findCustomer) {
              return  'user not found';
            }
            return  findCustomer;
          } catch (error) {
            console.error(error);
            return 'Server error';
          }
      }


}

const customerService = new CUSTOMERSERVICE();
module.exports = customerService;

// const bcrypt = require('bcrypt');
// const Customer = require('../models/Customer');
// require("dotenv").config();

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

// // Utility function for password validation
// const isValidPassword = (password) => {
//     const passwordRegex =  /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/        ;
//     return passwordRegex.test(password);
// };

// // Validation function for customer data
// const validateCustomerData = async (data) => {
//     const requiredFields = ['fullName', 'email', 'phoneNumber', 'password'];

//     // Check for missing required fields
//     for (let field of requiredFields) {
//         if (!data[field]) {
//             throw new Error(`The field ${field} is required.`);
//         }
//     }

//     // Validate email format
//     if (!isValidEmail(data.email)) {
//         throw new Error('Invalid email format.');
//     }

//     // Validate phone number format
//     if (!isValidPhoneNumber(data.phoneNumber)) {
//         throw new Error('Invalid phone number format.');
//     }

//     // Validate password
//     if (!isValidPassword(data.password)) {
//         throw new Error(
//             'Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long.'
//         );
//     }

//     // Validate address if provided
//     if (data.address) {
//         const { street, city, state, postalCode, country } = data.address;
//         const addressFields = { street, city, state, postalCode, country };
//         for (const [key, value] of Object.entries(addressFields)) {
//             if (!value) {
//                 throw new Error(`Address field '${key}' is required.`);
//             }
//         }
//     } else {
//         throw new Error('Complete address is required.');
//     }

//     // Check for existing customer
//     const existingCustomer = await Customer.findOne({
//         $or: [{ email: data.email }, { phoneNumber: data.phoneNumber }],
//     });

//     if (existingCustomer) {
//         if (existingCustomer.email === data.email) {
//             throw new Error('Email already exists.');
//         }
//         if (existingCustomer.phoneNumber === data.phoneNumber) {
//             throw new Error('Phone number already exists.');
//         }
//     }
// };

// // Service: Register a new customer
// exports.registerCustomerService = async (data) => {
//     const { fullName, email, phoneNumber, password, address } = data;

//     // Validate customer data
//     await validateCustomerData(data);

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new customer object
//     const customer = new Customer({
//         fullName,
//         email,
//         phoneNumber,
//         password: hashedPassword,
//         address,
//     });

//     // Save the customer to the database
//     return await customer.save();
// };

// exports.validateLoginData = (data) => {
//     const { email, password } = data;

//     if (!email || !password) {
//         throw new Error('Email and password are required.');
//     }
// };

// // Service: Login a customer
// exports.authenticateCustomer = async (email, password) => {
//     const customer = await Customer.findOne({ email });
//     if (!customer) {
//         throw new Error('Email not registered');
//     }

//     // Compare the provided password with the hashed password
//     const isMatch = await bcrypt.compare(password, customer.password);
//     if (!isMatch) {
//         throw new Error('incorrect password.');
//     }

//     return customer;
// }

// // Service: Update customer details
// exports.updateCustomerService = async (userId, updatedData) => {
//     // Find the customer by ID and update
//     const customer = await Customer.findOne({ userId });

//         if (!customer) {
//             throw new Error('customer not found.');
//         }

//         // Validate email if provided
//         if (updatedData.email) {
//             if (!isValidEmail(updatedData.email)) {
//                 throw new Error('Invalid email format....');
//             }

//             // Check if email already exists
//             const existingEmail = await Customer.findOne({ email: updatedData.email });
//             if (existingEmail && existingEmail._id.toString() !== userId) {
//                 throw new Error('Email is already in use.');
//             }
//         }

//         // Validate and handle password change logic
//         if (updatedData.oldPassword && updatedData.newPassword) {
//             const isMatch = await bcrypt.compare(updatedData.oldPassword, customer.password);
//             if (!isMatch) {
//                 throw new Error('Old password is incorrect.');
//             }

//             // Validate the new password
//             if (updatedData.newPassword.length < 6) {
//                 throw new Error('New password must be at least 6 characters long.');
//             }

//             // Hash the new password before saving it
//             const salt = await bcrypt.genSalt(10);
//             updatedData.password = await bcrypt.hash(updatedData.newPassword, salt);
//         }

//         // Validate phone number if provided
//         if (updatedData.phoneNumber) {
//             if (!isValidPhoneNumber(updatedData.phoneNumber)) {
//                 throw new Error('Invalid phone number format.');
//             }

//             // Check if phone number already exists
//             const existingPhone = await Customer.findOne({ phoneNumber: updatedData.phoneNumber });
//             if (existingPhone && existingPhone._id.toString() !== userId) {
//                 throw new Error('Phone number is already in use.');
//             }
//         }

//         // Update fields if they are present in the updatedData
//         if (updatedData.fullName) customer.fullName = updatedData.fullName;
//         if (updatedData.email) customer.email = updatedData.email;
//         if (updatedData.phoneNumber) customer.phoneNumber = updatedData.phoneNumber;
//         if (updatedData.officeAddress) customer.officeAddress = updatedData.officeAddresscustomer
//         if (updatedData.password) customer.password = updatedData.password
//         // Save the updated customer document
//         const updatedCustomer = await customer.save();

//         return updatedCustomer; // Return the updated customer profile
// }
