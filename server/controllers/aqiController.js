const { getCurrentAQI } = require("../services/aqiService");

const getCurrentAirQuality = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const data = await getCurrentAQI(lat, lon);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getNearbyStations = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const axios = require("axios");

    const response = await axios.get(
      "https://api.openaq.org/v3/locations",
      {
        params: {
          coordinates: `${lat},${lon}`,
          radius: 25000,
          limit: 100,
        },
        headers: {
          "X-API-Key": process.env.OPENAQ_API_KEY,
        },
      }
    );

    const stations = response.data.results || [];

    const simplifiedStations = stations.map((station) => ({
      id: station.id,
      name: station.name,
      provider: station.provider?.name,
      distance: station.distance,
      coordinates: station.coordinates,
      datetimeLast: station.datetimeLast,
      isMonitor: station.isMonitor,
      isMobile: station.isMobile,
    }));

    res.json({
      success: true,
      count: simplifiedStations.length,
      stations: simplifiedStations,
    });
  } catch (error) {
    console.error(
      "OpenAQ Stations Error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch nearby stations",
    });
  }
};

module.exports = {
  getCurrentAirQuality,
  getNearbyStations,
};