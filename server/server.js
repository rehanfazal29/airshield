require("dotenv").config();

const express = require("express");
const cors = require("cors");

const aqiRoutes = require("./routes/aqiRoutes");

const app = express();

const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());


// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AirShield backend is running",
  });
});

app.use("/api/air", aqiRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`AirShield server running on port ${PORT}`);
});