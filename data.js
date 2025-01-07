const agencies = [
    {
        agencyName: "Alpha Travels",
        vehicles: [
            { 
                vehicleName: "Sedan X100", 
                vehicleType: "Car", 
                capacity: 4, 
                imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
                description: "A sleek and stylish sedan perfect for city travel with premium comfort and space.",
                pricePerDay: 100, // Example price in USD
                availability: "Available" // Example availability status
            },
            { 
                vehicleName: "Voyager V2", 
                vehicleType: "Van", 
                capacity: 8, 
                imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
                description: "A spacious van designed for family trips or group travel with ample room and comfort.",
                pricePerDay: 150,
                availability: "Not Available"
            },
            { 
                vehicleName: "Express Limo", 
                vehicleType: "Limo", 
                capacity: 6, 
                imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
                description: "A luxurious limousine offering the ultimate in comfort and style for special occasions.",
                pricePerDay: 300,
                availability: "Available"
            },
            { 
                vehicleName: "Eco Cruiser", 
                vehicleType: "SUV", 
                capacity: 5, 
                imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
                description: "An eco-friendly SUV built for smooth rides and environmentally conscious journeys.",
                pricePerDay: 120,
                availability: "Available"
            },
            { 
                vehicleName: "MiniBus Alpha", 
                vehicleType: "Bus", 
                capacity: 20, 
                imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
                description: "A reliable mini-bus for group travels, offering great comfort and seating capacity.",
                pricePerDay: 250,
                availability: "Not Available"
            },
        ],
    },
    {
        agencyName: "Beta Rides",
        vehicles: [
            { 
                vehicleName: "Speedster Z", 
                vehicleType: "Bike", 
                capacity: 2, 
                imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
                description: "A high-performance bike built for speed and agility, ideal for city rides.",
                pricePerDay: 60,
                availability: "Available"
            },
            { 
                vehicleName: "Metro Bus 500", 
                vehicleType: "Bus", 
                capacity: 50, 
                imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
                description: "A spacious and efficient bus designed for city transit, perfect for large groups.",
                pricePerDay: 350,
                availability: "Available"
            },
            { 
                vehicleName: "Alpha Electric", 
                vehicleType: "Car", 
                capacity: 4, 
                imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
                description: "An eco-friendly electric car offering a smooth and sustainable driving experience.",
                pricePerDay: 120,
                availability: "Available"
            },
            { 
                vehicleName: "Offroad Pro", 
                vehicleType: "SUV", 
                capacity: 7, 
                imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
                description: "A rugged off-road SUV built to handle tough terrain and provide maximum comfort.",
                pricePerDay: 180,
                availability: "Not Available"
            },
            { 
                vehicleName: "MiniBus Alpha", 
                vehicleType: "Bus", 
                capacity: 25, 
                imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
                description: "A mid-sized bus offering a balance between seating capacity and maneuverability.",
                pricePerDay: 220,
                availability: "Available"
            },
        ],
    },
    {
        agencyName: "Gamma Transport",
        vehicles: [
            { 
                vehicleName: "EcoCar 300", 
                vehicleType: "Car", 
                capacity: 4, 
                imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
                description: "An eco-friendly car with advanced fuel efficiency features for green driving.",
                pricePerDay: 110,
                availability: "Available"
            },
            { 
                vehicleName: "EcoVan 400", 
                vehicleType: "Van", 
                capacity: 10, 
                imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
                description: "A spacious and eco-conscious van designed for both families and businesses.",
                pricePerDay: 170,
                availability: "Not Available"
            },
            { 
                vehicleName: "Gamma Speed", 
                vehicleType: "Bike", 
                capacity: 2, 
                imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
                description: "A fast and sleek bike made for the thrill-seekers who crave speed and adventure.",
                pricePerDay: 50,
                availability: "Available"
            },
            { 
                vehicleName: "Gamma Explorer", 
                vehicleType: "SUV", 
                capacity: 5, 
                imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
                description: "A well-rounded SUV offering both performance and luxury for long journeys.",
                pricePerDay: 150,
                availability: "Available"
            },
            { 
                vehicleName: "CityRunner Bus", 
                vehicleType: "Bus", 
                capacity: 30, 
                imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
                description: "A city bus designed for efficient and comfortable public transport.",
                pricePerDay: 300,
                availability: "Not Available"
            },
        ],
    },
    {
        agencyName: "Delta Logistics",
        vehicles: [
            { 
                vehicleName: "Cargo King", 
                vehicleType: "Truck", 
                capacity: 20, 
                imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
                description: "A heavy-duty truck designed for transporting large cargo efficiently.",
                pricePerDay: 400,
                availability: "Available"
            },
            { 
                vehicleName: "MiniMover", 
                vehicleType: "Van", 
                capacity: 6, 
                imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
                description: "A compact van ideal for moving small to medium-sized goods in urban areas.",
                pricePerDay: 90,
                availability: "Not Available"
            },
            { 
                vehicleName: "City Bus A1", 
                vehicleType: "Bus", 
                capacity: 40, 
                imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
                description: "A reliable city bus for daily commuting with a high passenger capacity.",
                pricePerDay: 350,
                availability: "Available"
            },
            { 
                vehicleName: "Express Heavy", 
                vehicleType: "Truck", 
                capacity: 25, 
                imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
                description: "A powerful truck built to carry heavy loads for long distances.",
                pricePerDay: 500,
                availability: "Available"
            },
            { 
                vehicleName: "Delta Cruiser", 
                vehicleType: "Car", 
                capacity: 4, 
                imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
                description: "A cruiser car designed for both comfort and performance, making city drives a breeze.",
                pricePerDay: 110,
                availability: "Not Available"
            },
        ],
    },
    // Continue similarly for the other agencies...
];

module.exports = agencies;










// const agencies = [
//     {
//         agencyName: "Alpha Travels",
//         vehicles: [
//             { vehicleName: "Sedan X100", vehicleType: "Car", capacity: 4, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "Voyager V2", vehicleType: "Van", capacity: 8, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "Express Limo", vehicleType: "Limo", capacity: 6, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "Eco Cruiser", vehicleType: "SUV", capacity: 5, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "MiniBus Alpha", vehicleType: "Bus", capacity: 20, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//         ],
//     },
//     {
//         agencyName: "Beta Rides",
//         vehicles: [
//             { vehicleName: "Speedster Z", vehicleType: "Bike", capacity: 2, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "Metro Bus 500", vehicleType: "Bus", capacity: 50, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "Alpha Electric", vehicleType: "Car", capacity: 4, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "Offroad Pro", vehicleType: "SUV", capacity: 7, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "MiniBus Alpha", vehicleType: "Bus", capacity: 25, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//         ],
//     },
//     {
//         agencyName: "Gamma Transport",
//         vehicles: [
//             { vehicleName: "EcoCar 300", vehicleType: "Car", capacity: 4, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "EcoVan 400", vehicleType: "Van", capacity: 10, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "Gamma Speed", vehicleType: "Bike", capacity: 2, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "Gamma Explorer", vehicleType: "SUV", capacity: 5, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "CityRunner Bus", vehicleType: "Bus", capacity: 30, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//         ],
//     },
//     {
//         agencyName: "Delta Logistics",
//         vehicles: [
//             { vehicleName: "Cargo King", vehicleType: "Truck", capacity: 20, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "MiniMover", vehicleType: "Van", capacity: 6, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "City Bus A1", vehicleType: "Bus", capacity: 40, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "Express Heavy", vehicleType: "Truck", capacity: 25, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "Delta Cruiser", vehicleType: "Car", capacity: 4, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//         ],
//     },
//     {
//         agencyName: "Epsilon Rentals",
//         vehicles: [
//             { vehicleName: "Luxury Sedan XL", vehicleType: "Car", capacity: 4, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "Traveler Mini", vehicleType: "Van", capacity: 7, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "Epsilon Bike", vehicleType: "Bike", capacity: 2, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "Mountain Pro", vehicleType: "SUV", capacity: 5, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "City Liner", vehicleType: "Bus", capacity: 25, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//         ],
//     },
//     {
//         agencyName: "Zeta Drive",
//         vehicles: [
//             { vehicleName: "Urban Shuttle", vehicleType: "Bus", capacity: 30, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "Coupe C2", vehicleType: "Car", capacity: 2, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "Luxury Z", vehicleType: "Limo", capacity: 6, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "Zeta Transporter", vehicleType: "Van", capacity: 10, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "Zeta Haul Pro", vehicleType: "Truck", capacity: 18, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//         ],
//     },
//     {
//         agencyName: "Omega Wheels",
//         vehicles: [
//             { vehicleName: "Roadster 2021", vehicleType: "Bike", capacity: 2, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "Family Cruiser", vehicleType: "Van", capacity: 5, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "Omega Deluxe", vehicleType: "Car", capacity: 4, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "SpeedX Omega", vehicleType: "Bike", capacity: 2, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "Omega Bus Plus", vehicleType: "Bus", capacity: 40, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//         ],
//     },
//     {
//         agencyName: "Theta Rentals",
//         vehicles: [
//             { vehicleName: "Theta Sedan", vehicleType: "Car", capacity: 4, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "Theta Hauler", vehicleType: "Truck", capacity: 15, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "City Cruiser Theta", vehicleType: "Bus", capacity: 20, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "Explorer Theta", vehicleType: "SUV", capacity: 7, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "Theta Bike X", vehicleType: "Bike", capacity: 2, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//         ],
//     },
//     {
//         agencyName: "Lambda Logistics",
//         vehicles: [
//             { vehicleName: "Lambda Truck 100", vehicleType: "Truck", capacity: 25, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "Luxury Lambda", vehicleType: "Car", capacity: 4, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "Family Van Lambda", vehicleType: "Van", capacity: 8, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "Lambda Express", vehicleType: "Bus", capacity: 35, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "Offroad Lambda", vehicleType: "SUV", capacity: 5, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//         ],
//     },
//     {
//         agencyName: "Sigma Transports",
//         vehicles: [
//             { vehicleName: "Sigma Sedan", vehicleType: "Car", capacity: 4, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "Sigma Pro Van", vehicleType: "Van", capacity: 10, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "Sigma Bus Plus", vehicleType: "Bus", capacity: 45, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "Sigma Heavy Duty", vehicleType: "Truck", capacity: 30, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//             { vehicleName: "Sigma Trail", vehicleType: "Bike", capacity: 2, imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg" },
//         ],
//     },
// ];

// module.exports = agencies;


// const agencies = [
//     {
//         agencyName: "Alpha Travels",
//         vehicles: [
//             { 
//                 vehicleName: "Sedan X100", 
//                 vehicleType: "Car", 
//                 capacity: 4, 
//                 imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
//                 description: "A sleek and stylish sedan perfect for city travel with premium comfort and space."
//             },
//             { 
//                 vehicleName: "Voyager V2", 
//                 vehicleType: "Van", 
//                 capacity: 8, 
//                 imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
//                 description: "A spacious van designed for family trips or group travel with ample room and comfort."
//             },
//             { 
//                 vehicleName: "Express Limo", 
//                 vehicleType: "Limo", 
//                 capacity: 6, 
//                 imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
//                 description: "A luxurious limousine offering the ultimate in comfort and style for special occasions."
//             },
//             { 
//                 vehicleName: "Eco Cruiser", 
//                 vehicleType: "SUV", 
//                 capacity: 5, 
//                 imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
//                 description: "An eco-friendly SUV built for smooth rides and environmentally conscious journeys."
//             },
//             { 
//                 vehicleName: "MiniBus Alpha", 
//                 vehicleType: "Bus", 
//                 capacity: 20, 
//                 imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
//                 description: "A reliable mini-bus for group travels, offering great comfort and seating capacity."
//             },
//         ],
//     },
//     {
//         agencyName: "Beta Rides",
//         vehicles: [
//             { 
//                 vehicleName: "Speedster Z", 
//                 vehicleType: "Bike", 
//                 capacity: 2, 
//                 imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
//                 description: "A high-performance bike built for speed and agility, ideal for city rides."
//             },
//             { 
//                 vehicleName: "Metro Bus 500", 
//                 vehicleType: "Bus", 
//                 capacity: 50, 
//                 imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
//                 description: "A spacious and efficient bus designed for city transit, perfect for large groups."
//             },
//             { 
//                 vehicleName: "Alpha Electric", 
//                 vehicleType: "Car", 
//                 capacity: 4, 
//                 imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
//                 description: "An eco-friendly electric car offering a smooth and sustainable driving experience."
//             },
//             { 
//                 vehicleName: "Offroad Pro", 
//                 vehicleType: "SUV", 
//                 capacity: 7, 
//                 imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
//                 description: "A rugged off-road SUV built to handle tough terrain and provide maximum comfort."
//             },
//             { 
//                 vehicleName: "MiniBus Alpha", 
//                 vehicleType: "Bus", 
//                 capacity: 25, 
//                 imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
//                 description: "A mid-sized bus offering a balance between seating capacity and maneuverability."
//             },
//         ],
//     },
//     {
//         agencyName: "Gamma Transport",
//         vehicles: [
//             { 
//                 vehicleName: "EcoCar 300", 
//                 vehicleType: "Car", 
//                 capacity: 4, 
//                 imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
//                 description: "An eco-friendly car with advanced fuel efficiency features for green driving."
//             },
//             { 
//                 vehicleName: "EcoVan 400", 
//                 vehicleType: "Van", 
//                 capacity: 10, 
//                 imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
//                 description: "A spacious and eco-conscious van designed for both families and businesses."
//             },
//             { 
//                 vehicleName: "Gamma Speed", 
//                 vehicleType: "Bike", 
//                 capacity: 2, 
//                 imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
//                 description: "A fast and sleek bike made for the thrill-seekers who crave speed and adventure."
//             },
//             { 
//                 vehicleName: "Gamma Explorer", 
//                 vehicleType: "SUV", 
//                 capacity: 5, 
//                 imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
//                 description: "A well-rounded SUV offering both performance and luxury for long journeys."
//             },
//             { 
//                 vehicleName: "CityRunner Bus", 
//                 vehicleType: "Bus", 
//                 capacity: 30, 
//                 imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
//                 description: "A city bus designed for efficient and comfortable public transport."
//             },
//         ],
//     },
//     {
//         agencyName: "Delta Logistics",
//         vehicles: [
//             { 
//                 vehicleName: "Cargo King", 
//                 vehicleType: "Truck", 
//                 capacity: 20, 
//                 imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
//                 description: "A heavy-duty truck designed for transporting large cargo efficiently."
//             },
//             { 
//                 vehicleName: "MiniMover", 
//                 vehicleType: "Van", 
//                 capacity: 6, 
//                 imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
//                 description: "A compact van ideal for moving small to medium-sized goods in urban areas."
//             },
//             { 
//                 vehicleName: "City Bus A1", 
//                 vehicleType: "Bus", 
//                 capacity: 40, 
//                 imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
//                 description: "A reliable city bus for daily commuting with a high passenger capacity."
//             },
//             { 
//                 vehicleName: "Express Heavy", 
//                 vehicleType: "Truck", 
//                 capacity: 25, 
//                 imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
//                 description: "A powerful truck built to carry heavy loads for long distances."
//             },
//             { 
//                 vehicleName: "Delta Cruiser", 
//                 vehicleType: "Car", 
//                 capacity: 4, 
//                 imageUrl: "https://i.pinimg.com/474x/53/9b/8f/539b8f89433e3bd8957dbcef73a29c72.jpg",
//                 description: "A cruiser car designed for both comfort and performance, making city drives a breeze."
//             },
//         ],
//     },
//     // Continue similarly for the other agencies...
// ];

// module.exports = agencies;
