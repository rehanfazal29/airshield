const axios = require("axios");

const getCurrentAQI = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      `https://api.waqi.info/feed/geo:${latitude};${longitude}/`,
      {
        params: {
          token: process.env.WAQI_API_TOKEN,
        },
      }
    );

    const data = response.data;

    if (data.status !== "ok") {
      throw new Error("WAQI API returned an invalid response");
    }

    return {
      source: "WAQI / CPCB / DPCC",
      aqi: data.data.aqi,

      station: {
        name: data.data.city?.name || "Unknown",
        latitude: data.data.city?.geo?.[0] || null,
        longitude: data.data.city?.geo?.[1] || null,
      },

      dominantPollutant: data.data.dominentpol || null,

      pollutants: {
        pm25: data.data.iaqi?.pm25?.v ?? null,
        pm10: data.data.iaqi?.pm10?.v ?? null,
        no2: data.data.iaqi?.no2?.v ?? null,
        so2: data.data.iaqi?.so2?.v ?? null,
        co: data.data.iaqi?.co?.v ?? null,
        o3: data.data.iaqi?.o3?.v ?? null,
      },

      weather: {
        temperature: data.data.iaqi?.t?.v ?? null,
        humidity: data.data.iaqi?.h?.v ?? null,
        pressure: data.data.iaqi?.p?.v ?? null,
        windSpeed: data.data.iaqi?.w?.v ?? null,
        windDirection: data.data.iaqi?.wd?.v ?? null,
      },

      timestamp: data.data.time?.iso || null,
    };
  } catch (error) {
    console.error(
      "WAQI API Error:",
      error.response?.data || error.message
    );

    throw new Error("Failed to fetch current air quality");
  }
};

module.exports = {
  getCurrentAQI,
};