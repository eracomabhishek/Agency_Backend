const express = require("express");
const app = express();
require('./config/connection');
require('./models/Admin');
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path")

// const dbConnect = require("./config/connection");
// dbConnect();

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const userRoutes = require("./routes/userRoutes");
app.use("/api", userRoutes);

const agencyRoutes = require("./routes/agencyRoutes");
app.use("/api", agencyRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api", adminRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
