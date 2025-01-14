
const Booking = require("../models/Booking"); // Booking Schema
const Vehicle = require("../models/Vehicle"); // Vehicle Schema
const Customer = require("../models/Customer"); // Customer Schema
const Billing = require("../models/Billing"); // Billing Schema





class BILLINGSERVICE {
    async billing(req, res) {
        try {
            const { customerId } = req.body;

            // Validate Input
            if (!customerId) {
                return res.status(400).json({ error: "Invalid input data" });
            }

            // Fetch Customer
            const customer = await Customer.findOne({ customerId });
            if (!customer) return res.status(404).json({ error: "Customer not found" });

            // Extract bookingIds from Customer
            const bookingIds = [...new Set(customer.bookingHistory)]; // Remove duplicate IDs if any
            if (!bookingIds || bookingIds.length === 0) {
                return res.status(404).json({ error: "No associated booking found for this customer" });
            }

            // Initialize totalAmount and billing entries array
            let totalAmount = 0;
            const billingEntries = [];

            // Iterate over bookingIds
            for (const bookingId of bookingIds) {
                console.log(`Processing Booking ID: ${bookingId}`); // Debug log

                // Fetch Booking
                const booking = await Booking.findOne({ bookingId: bookingId });
                if (!booking) {
                    console.log(`Booking not found for ID: ${bookingId}`);
                    continue; // Skip this booking and proceed with the next
                }

                // Fetch Vehicle Details
                const vehicle = await Vehicle.findOne({ vehicleId: booking.vehicleId });
                if (!vehicle) {
                    console.log(`Vehicle not found for vehicleId: ${booking.vehicleId}`);
                    continue; // Skip this booking and proceed with the next
                }

                // Initialize variables for billing calculation
                let bookingAmount = 0;
                let startDate = null;
                let endDate = null;
                let hours = null;
                let days = null;
                let pricingMethod = "";
                let rate = 0; // Variable to store the hourly or daily rate

                // Function to format hours into AM/PM
                const formatHourToAmPm = (hour) => {
                    const hourInt = parseInt(hour, 10);
                    const period = hourInt >= 12 ? "PM" : "AM";
                    const formattedHour = hourInt % 12 || 12;
                    return `${formattedHour} ${period}`;
                };

                // Check if the booking is for days or hours and calculate the billing
                if (booking.startDate && booking.endDate) {
                    // Pricing Method is Days
                    pricingMethod = "Days";
                    rate = vehicle.pricePerDay;
                    startDate = new Date(booking.startDate);
                    endDate = new Date(booking.endDate);

                    // Calculate the number of days
                    days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
                    bookingAmount = days * rate;
                } else if (booking.startHour && booking.endHour) {
                    // Pricing Method is Hours
                    pricingMethod = "Hours";
                    rate = vehicle.pricePerHour;

                    // Format startHour and endHour into AM/PM format
                    const formattedStartHour = formatHourToAmPm(booking.startHour);
                    const formattedEndHour = formatHourToAmPm(booking.endHour);

                    hours = parseInt(booking.endHour) - parseInt(booking.startHour); // Calculate hours
                    bookingAmount = hours * rate;

                    // Add formatted start and end hours to booking details
                    booking.startHourFormatted = formattedStartHour;
                    booking.endHourFormatted = formattedEndHour;
                } else {
                    console.log(`Invalid booking duration data for Booking ID: ${bookingId}`);
                    continue; // Skip this booking and proceed with the next
                }

                // Add the booking amount to the total
                totalAmount += bookingAmount;

                // Check if a billing entry for this booking already exists
                const existingBilling = await Billing.findOne({
                    customerName: customer.fullName || "Unknown Customer",
                    vehicleName: vehicle.vehicleName || "Unknown Vehicle",
                    startDate: startDate,
                    endDate: endDate,
                    pricingMethod,
                });

                if (existingBilling) {
                    console.log(`Billing already exists for Booking ID: ${bookingId}`);
                    continue; // Skip creating duplicate billing
                }

                // Create a Billing entry for this booking
                const newBilling = new Billing({
                    customerName: customer.fullName || "Unknown Customer", // Use fallback
                    agencyName: vehicle.agencyName || "Unknown Agency",
                    vehicleName: vehicle.vehicleName || "Unknown Vehicle", // Use fallback
                    startDate: startDate || null,
                    endDate: endDate || null,
                    startHour: booking.startHourFormatted || null, // AM/PM formatted start hour
                    endHour: booking.endHourFormatted || null, // AM/PM formatted end hour
                    hours: hours || null,
                    days: days || null, // Save the number of days
                    rate: rate, // Add the rate (pricePerHour or pricePerDay)
                    totalAmount: bookingAmount,
                    pricingMethod,
                });

                // Save the billing entry
                console.log(`Creating Billing for Booking ID: ${bookingId}`); // Debug log
                await newBilling.save();

                // Add the billing entry to the list
                billingEntries.push(newBilling);
            }

            // Return the total billing details and the list of billing entries
            return res.status(201).json({
                message: "Billing created successfully for all bookings",
                totalAmount,
                customerName: customer.fullName || "Unknown Customer",
                billingEntries, // Include the list of individual billing entries
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

const billingService = new BILLINGSERVICE();
module.exports = billingService;












// class BILLINGSERVICE {
//     async billing(req, res) {
//         try {
//             const { customerId } = req.body;

//             // Validate Input
//             if (!customerId) {
//                 return res.status(400).json({ error: "Invalid input data" });
//             }

//             // Fetch Customer
//             const customer = await Customer.findOne({ customerId });
//             if (!customer) return res.status(404).json({ error: "Customer not found" });

//             // Extract bookingIds from Customer
//             const bookingIds = customer.bookingHistory;
//             if (!bookingIds || bookingIds.length === 0) {
//                 return res.status(404).json({ error: "No associated booking found for this customer" });
//             }

//             // Initialize totalAmount and billing entries array
//             let totalAmount = 0;
//             const billingEntries = [];

//             // Iterate over bookingIds
//             for (const bookingId of bookingIds) {
//                 // Fetch Booking
//                 const booking = await Booking.findOne({ bookingId: bookingId });
//                 if (!booking) return res.status(404).json({ error: `Booking not found for ID: ${bookingId}` });

//                 // Fetch Vehicle Details
//                 const vehicle = await Vehicle.findOne({ vehicleId: booking.vehicleId });
//                 if (!vehicle) {
//                     console.log(`Vehicle not found for vehicleId: ${booking.vehicleId}`);
//                     return res.status(404).json({ error: "Vehicle not found" });
//                 }

//                 // Initialize variables for billing calculation
//                 let bookingAmount = 0;
//                 let startDate = null;
//                 let endDate = null;
//                 let hours = null;
//                 let days = null;
//                 let pricingMethod = "";
//                 let rate = 0; // Variable to store the hourly or daily rate

//                 // Check if the booking is for days or hours and calculate the billing
//                 if (booking.startDate && booking.endDate) {
//                     // Pricing Method is Days
//                     pricingMethod = "Days";
//                     rate = vehicle.pricePerDay;
//                     startDate = new Date(booking.startDate);
//                     endDate = new Date(booking.endDate);

//                     // Calculate the number of days
//                     days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
//                     bookingAmount = days * rate;
//                 } else if (booking.Hours) {
//                     // Pricing Method is Hours
//                     pricingMethod = "Hours";
//                     rate = vehicle.pricePerHour;
//                     hours = booking.Hours;
//                     bookingAmount = hours * rate;
//                 } else {
//                     return res.status(400).json({ error: "Invalid booking duration data" });
//                 }

//                 // Add the booking amount to the total
//                 totalAmount += bookingAmount;

//                 // Create a Billing entry for this booking
//                 const newBilling = new Billing({
//                     customerName: customer.fullName || "Unknown Customer", // Use fallback
//                     agencyName: vehicle.agencyName || "Unknown Agency",
//                     vehicleName: vehicle.vehicleName || "Unknown Vehicle", // Use fallback
//                     startDate: startDate || null,
//                     endDate: endDate || null,
//                     hours: hours || null,
//                     days: days || null, // Save the number of days
//                     rate: rate, // Add the rate (pricePerHour or pricePerDay)
//                     totalAmount: bookingAmount,
//                     pricingMethod,
//                 });

//                 // Save the billing entry
//                 await newBilling.save();

//                 // Add the billing entry to the list
//                 billingEntries.push(newBilling);
//             }

//             // Return the total billing details and the list of billing entries
//             return res.status(201).json({
//                 message: "Billing created successfully for all bookings",
//                 totalAmount,
//                 customerName: customer.fullName || "Unknown Customer",
//                 billingEntries, // Include the list of individual billing entries
//             });
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ error: "Internal Server Error" });
//         }
//     }
// }

// const billingService = new BILLINGSERVICE();
// module.exports = billingService;










// class BILLINGSERVICE {
//     async billing(req, res) {
//         try {
//             const { customerId } = req.body;

//             // Validate Input
//             if (!customerId) {
//                 return res.status(400).json({ error: "Invalid input data" });
//             }

//             // Fetch Customer
//             const customer = await Customer.findOne({ customerId });
//             if (!customer) return res.status(404).json({ error: "Customer not found" });

//             // Extract bookingIds from Customer
//             const bookingIds = customer.bookingHistory; // Using bookingHistory for multiple bookings
//             if (!bookingIds || bookingIds.length === 0) {
//                 return res.status(404).json({ error: "No associated booking found for this customer" });
//             }

//             // Initialize totalAmount and billing entries array
//             let totalAmount = 0;
//             const billingEntries = [];

//             // Iterate over bookingIds
//             for (const bookingId of bookingIds) {
//                 // Fetch Booking
//                 const booking = await Booking.findOne({ bookingId: bookingId });
//                 if (!booking) return res.status(404).json({ error: `Booking not found for ID: ${bookingId}` });

//                 // Fetch Vehicle Details
//                 const vehicle = await Vehicle.findOne({ vehicleId: booking.vehicleId });
//                 console.log("Vehicle Data:", vehicle);

//                 if (!vehicle) {
//                     console.log(`Vehicle not found for vehicleId: ${booking.vehicleId}`);
//                     return res.status(404).json({ error: "Vehicle not found" });
//                 }

//                 // Initialize variables for billing calculation
//                 let bookingAmount = 0;
//                 let startDate = null;
//                 let endDate = null;
//                 let Hours = null;
//                 let pricingMethod = "";

//                 // Check if the booking is for days or hours and calculate the billing
//                 if (booking.startDate && booking.endDate) {
//                     // Pricing Method is Days
//                     pricingMethod = "Days";
//                     startDate = new Date(booking.startDate);
//                     endDate = new Date(booking.endDate);

//                     // Calculate the number of days
//                     const durationInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
//                     bookingAmount = durationInDays * vehicle.pricePerDay;
//                 } else if (booking.Hours) {
//                     // Pricing Method is Hours (fetching from booking.hours)
//                     pricingMethod = "Hours";
//                     Hours = booking.Hours;
//                     // Calculate the amount for hours
//                     bookingAmount = Hours * vehicle.pricePerHour;
//                 } else {
//                     return res.status(400).json({ error: "Invalid booking duration data" });
//                 }

//                 // Add the booking amount to the total
//                 totalAmount += bookingAmount;
//                 console.log("Vehicle Data :", vehicle.agencyName);

//                 // Create a Billing entry for this booking
//                 const newBilling = new Billing({
//                     customerName: customer.fullName || "Unknown Customer", // Use fallback
//                     agencyName: vehicle.agencyName || "Unknown Agency", 
//                     vehicleName: vehicle.vehicleName || "Unknown Vehicle", // Use fallback
//                     startDate: startDate || null,
//                     endDate: endDate || null,
//                     hours: Hours || null,
//                     totalAmount: bookingAmount,
//                     pricingMethod,
//                 });

//                 // Save the billing entry
//                 await newBilling.save();

//                 // Add the billing entry to the list
//                 billingEntries.push(newBilling);
//             }

//             // Return the total billing details and the list of billing entries
//             return res.status(201).json({
//                 message: "Billing created successfully for all bookings",
//                 totalAmount,
//                 customerName: customer.fullName || "Unknown Customer",
//                 billingEntries, // Include the list of individual billing entries
//             });
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ error: "Internal Server Error" });
//         }
//     }
// }

// const billingService = new BILLINGSERVICE();
// module.exports = billingService;
