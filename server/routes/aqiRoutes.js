const express = require("express");

const {
  getCurrentAirQuality,
  getNearbyStations,
} = require("../controllers/aqiController");

const router = express.Router();

// Current air quality
router.get("/current", getCurrentAirQuality);

// Nearby monitoring stations
router.get("/stations", getNearbyStations);

module.exports = router;