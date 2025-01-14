const Booking = require("../models/Booking"); // Booking Schema
const Vehicle = require("../models/Vehicle"); // Vehicle Schema
const Customer = require("../models/Customer"); // Customer Schema
const Billing = require("../models/Billing"); // Billing Schema

class BILLINGSERVICE {
    async billing(req, res) {
        try {
            const { customerId } = req.body;

            if (!customerId) {
                return res.status(400).json({ error: "Customer ID is required" });
            }

            const customer = await Customer.findOne({ customerId });
            if (!customer) {
                return res.status(404).json({ error: "Customer not found" });
            }

            const bookingIds = [...new Set(customer.bookingHistory)];
            if (!bookingIds || bookingIds.length === 0) {
                return res.status(404).json({ error: "No bookings found for this customer" });
            }

            let totalAmount = 0;
            const billingEntries = [];

            for (const bookingId of bookingIds) {
                const booking = await Booking.findOne({ bookingId });
                if (!booking) continue;

                const vehicle = await Vehicle.findOne({ vehicleId: booking.vehicleId });
                if (!vehicle) continue;

                let totalHours = 0;
                let totalDays = 0;
                let remainingHours = 0;
                let bookingAmount = 0;

                const formatHourToAmPm = (time) => {
                    const [hour, minute] = time.split(':').map(Number);
                    const period = hour >= 12 ? "PM" : "AM";
                    const formattedHour = hour % 12 || 12;
                    return `${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`;
                };

                const startHourFormatted = formatHourToAmPm(booking.startHour);
                const endHourFormatted = formatHourToAmPm(booking.endHour);

                if (booking.startDate && booking.endDate) {
                    const startDate = new Date(booking.startDate);
                    const endDate = new Date(booking.endDate);

                    totalHours = Math.ceil((endDate - startDate) / (1000 * 60 * 60)) +
                        (parseInt(booking.endHour) - parseInt(booking.startHour));

                    totalDays = Math.floor(totalHours / 24);
                    remainingHours = totalHours % 24;

                    if (totalDays > 0) {
                        bookingAmount += totalDays * vehicle.pricePerDay;
                    }

                    if (remainingHours > 0) {
                        bookingAmount += remainingHours * vehicle.pricePerHour;
                    }

                    const existingBilling = await Billing.findOne({
                        customerName: customer.fullName,
                        vehicleName: vehicle.vehicleName,
                        startDate,
                        endDate,
                        pricingMethod: totalDays > 0 ? "pricePerDay" : "pricePerHour",
                    });

                    if (existingBilling) continue;

                    const newBilling = new Billing({
                        customerName: customer.fullName,
                        agencyName: vehicle.agencyName,
                        vehicleName: vehicle.vehicleName,
                        startDate,
                        endDate,
                        startHour: startHourFormatted,
                        endHour: endHourFormatted,
                        totalHours,
                        totalDays,
                        totalAmount: bookingAmount,
                        pricingMethod: totalDays > 0 ? "pricePerDay" : "pricePerHour",
                    });

                    await newBilling.save();
                    billingEntries.push(newBilling);
                    totalAmount += bookingAmount;
                }
            }

            return res.status(201).json({
                message: "Billing created successfully",
                totalAmount,
                billingEntries,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

const billingService = new BILLINGSERVICE();
module.exports = billingService;




