const express = require("express");
const cors = require("cors");

const volunteerRoutes = require("./routes/volunteer.routes");

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/volunteer", volunteerRoutes);

module.exports = app;