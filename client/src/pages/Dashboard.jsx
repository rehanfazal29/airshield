import { useEffect, useState } from "react";

import {
  Wind,
  Droplets,
  Thermometer,
  Activity,
  Car,
  Flame,
  Cloud,
  ShieldAlert,
  Compass,
  Gauge,
  MapPin,
  LocateFixed,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const fallbackMetrics = [
  {
    title: "Air Quality",
    value: 85,
    unit: "AQI",
    icon: Wind,
  },
  {
    title: "PM2.5",
    value: 42,
    unit: "µg/m³",
    icon: Wind,
    status: "Elevated",
  },
  {
    title: "Temperature",
    value: 28,
    unit: "°C",
    icon: Thermometer,
    status: "Normal",
  },
  {
    title: "Exposure Index",
    value: 32,
    unit: "/ 100",
    icon: Activity,
    status: "Moderate",
  },
];

const sources = [
  {
    name: "Traffic",
    description: "Vehicle emissions",
    icon: Car,
  },
  {
    name: "Fire Activity",
    description: "Regional hotspot activity",
    icon: Flame,
  },
  {
    name: "Weather",
    description: "Current dispersion conditions",
    icon: Cloud,
  },
];

const fallbackForecast = [
  { time: "Now", aqi: 85 },
  { time: "1 PM", aqi: 91 },
  { time: "2 PM", aqi: 96 },
  { time: "3 PM", aqi: 102 },
  { time: "4 PM", aqi: 98 },
  { time: "5 PM", aqi: 89 },
];

function getAQIStatus(aqi) {
  if (aqi <= 50) {
    return {
      label: "Good",
      className: "aqi-good",
    };
  }

  if (aqi <= 100) {
    return {
      label: "Moderate",
      className: "aqi-moderate",
    };
  }

  if (aqi <= 150) {
    return {
      label: "Unhealthy for Sensitive Groups",
      className: "aqi-sensitive",
    };
  }

  if (aqi <= 200) {
    return {
      label: "Unhealthy",
      className: "aqi-unhealthy",
    };
  }

  if (aqi <= 300) {
    return {
      label: "Very Unhealthy",
      className: "aqi-very-unhealthy",
    };
  }

  return {
    label: "Hazardous",
    className: "aqi-hazardous",
  };
}

export default function Dashboard() {
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("detecting");

  const [airData, setAirData] = useState(null);
  const [airLoading, setAirLoading] = useState(false);
  const [airError, setAirError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("unsupported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setLocation({
          latitude,
          longitude,
        });

        setLocationStatus("success");

        setAirLoading(true);
        setAirError(null);

        fetch(
          `http://localhost:5000/api/air/current?lat=${latitude}&lon=${longitude}`
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to fetch air quality data");
            }

            return response.json();
          })
          .then((result) => {
            if (!result.success) {
              throw new Error(
                result.message || "Air quality data unavailable"
              );
            }

            setAirData(result.data);
          })
          .catch((error) => {
            console.error("Air quality fetch error:", error);
            setAirError("Live air-quality data unavailable");
          })
          .finally(() => {
            setAirLoading(false);
          });
      },
      () => {
        setLocationStatus("denied");
        setAirError("Location access is required for local live data.");
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  const currentAQI = airData?.aqi ?? fallbackMetrics[0].value;

  const currentPM25 =
    airData?.pollutants?.pm25 ?? fallbackMetrics[1].value;

  const currentTemperature =
    airData?.weather?.temperature ?? fallbackMetrics[2].value;

  const aqiStatus = getAQIStatus(currentAQI);

  const isLiveData = Boolean(airData);

  const metrics = [
    {
      title: "Air Quality",
      value: currentAQI,
      unit: "AQI",
      icon: Wind,
    },
    {
      title: "PM2.5",
      value: currentPM25,
      unit: "µg/m³",
      icon: Wind,
      status: currentPM25 > 35 ? "Elevated" : "Normal",
    },
    {
      title: "Temperature",
      value: currentTemperature,
      unit: "°C",
      icon: Thermometer,
      status: "Live",
    },
    {
      title: "Exposure Index",
      value: 32,
      unit: "/ 100",
      icon: Activity,
      status: "Prototype",
    },
  ];

  const forecast = fallbackForecast;

  const humidity = airData?.weather?.humidity;
  const pressure = airData?.weather?.pressure;
  const windSpeed = airData?.weather?.windSpeed;
  const windDirection = airData?.weather?.windDirection;

  const getWindDirection = (degrees) => {
    if (degrees === null || degrees === undefined) {
      return "—";
    }

    const directions = [
      "N",
      "NE",
      "E",
      "SE",
      "S",
      "SW",
      "W",
      "NW",
    ];

    const index = Math.round(degrees / 45) % 8;

    return directions[index];
  };

  const getSafetyMessage = () => {
    if (currentAQI <= 50) {
      return {
        title: "Low Risk",
        description:
          "Air quality is currently good. Normal outdoor activities are generally reasonable.",
      };
    }

    if (currentAQI <= 100) {
      return {
        title: "Moderate Risk",
        description:
          "Outdoor activities are possible, but consider reducing prolonged exposure.",
      };
    }

    if (currentAQI <= 150) {
      return {
        title: "Elevated Risk",
        description:
          "Consider reducing prolonged or high-intensity outdoor activity.",
      };
    }

    if (currentAQI <= 200) {
      return {
        title: "High Risk",
        description:
          "Consider limiting prolonged outdoor exposure and intense outdoor activity.",
      };
    }

    if (currentAQI <= 300) {
      return {
        title: "Very High Risk",
        description:
          "Avoid prolonged outdoor exposure where possible and consider safer indoor alternatives.",
      };
    }

    return {
      title: "Very High Risk",
      description:
        "Avoid outdoor exposure where possible and follow appropriate local health guidance.",
    };
  };

  const safety = getSafetyMessage();

  return (
    <main className="dashboard">
      {/* HEADER */}

      <section className="dashboard-heading">
        <div>
          <span className="dashboard-label">
            AIRSHIELD INTELLIGENCE
          </span>

          <h1>Air Quality Dashboard</h1>

          <p>
            Understand your current environment and make safer decisions.
          </p>
        </div>

        {/* LOCATION */}

        <div className="dashboard-location">
          <span>LOCATION</span>

          {locationStatus === "detecting" && (
            <div className="location-status">
              <LocateFixed size={15} />
              <strong>Detecting...</strong>
            </div>
          )}

          {locationStatus === "success" && (
            <div className="location-status success">
              <MapPin size={15} />
              <strong>Location detected</strong>
            </div>
          )}

          {locationStatus === "denied" && (
            <div className="location-status denied">
              <MapPin size={15} />
              <strong>Location unavailable</strong>
            </div>
          )}

          {locationStatus === "unsupported" && (
            <div className="location-status denied">
              <MapPin size={15} />
              <strong>Not supported</strong>
            </div>
          )}
        </div>
      </section>

      {/* LOCATION INFO */}

      {locationStatus === "success" && location && (
        <div className="coordinates-card">
          <MapPin size={16} />

          <span>
            Location ready for local AQI and weather data
          </span>

          <small>
            {location.latitude.toFixed(4)},{" "}
            {location.longitude.toFixed(4)}
          </small>
        </div>
      )}

      {locationStatus === "denied" && (
        <div className="location-warning">
          <MapPin size={16} />

          <span>
            Location access was denied. You can still use AirShield,
            but local data will require a location.
          </span>
        </div>
      )}

      {/* DATA STATUS */}

      <div className="demo-badge">
        {airLoading
          ? "LOADING LIVE DATA..."
          : isLiveData
          ? "LIVE DATA"
          : "DEMO DATA"}
      </div>

      {airError && !airData && (
        <div className="location-warning">
          <span>{airError}</span>
        </div>
      )}

      {/* METRICS */}

      <section className="metrics-grid">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              className="metric-card"
              key={metric.title}
            >
              <div className="metric-top">
                <span>{metric.title}</span>

                <div className="metric-icon">
                  <Icon size={21} />
                </div>
              </div>

              <div className="metric-value">
                {metric.value}
                <small>{metric.unit}</small>
              </div>

              {metric.title === "Air Quality" ? (
                <span
                  className={`metric-status ${aqiStatus.className}`}
                >
                  {aqiStatus.label}
                </span>
              ) : (
                <span className="metric-status">
                  {metric.status}
                </span>
              )}
            </article>
          );
        })}
      </section>

      {/* MAIN GRID */}

      <section className="dashboard-main-grid">
        {/* AQI FORECAST */}

        <div className="dashboard-panel forecast-panel">
          <div className="panel-header">
            <div>
              <span className="panel-label">
                AIR QUALITY TREND
              </span>

              <h2>Next 6 Hours</h2>
            </div>

            <span className="panel-info">
              Illustrative
            </span>
          </div>

          <div className="real-chart">
            <ResponsiveContainer
              width="100%"
              height={260}
            >
              <AreaChart
                data={forecast}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="aqiGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#087f65"
                      stopOpacity={0.25}
                    />

                    <stop
                      offset="100%"
                      stopColor="#087f65"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e8efec"
                />

                <XAxis
                  dataKey="time"
                  tick={{
                    fontSize: 11,
                    fill: "#7a8b92",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  domain={[70, 110]}
                  tick={{
                    fontSize: 11,
                    fill: "#7a8b92",
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={35}
                />

                <Tooltip
                  contentStyle={{
                    border: "1px solid #dce9e4",
                    borderRadius: "10px",
                    background: "#ffffff",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="aqi"
                  stroke="#087f65"
                  strokeWidth={3}
                  fill="url(#aqiGradient)"
                  dot={{
                    r: 4,
                    fill: "#087f65",
                    stroke: "#ffffff",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <p className="chart-note">
            Forecast data is currently illustrative. Live forecast
            integration will be connected separately.
          </p>
        </div>

        {/* SAFETY */}

        <div className="dashboard-panel safety-panel">
          <div className="panel-header">
            <div>
              <span className="panel-label">
                SAFETY STATUS
              </span>

              <h2>What should I do?</h2>
            </div>

            <ShieldAlert size={25} />
          </div>

          <div className="safety-status">
            <strong>{safety.title}</strong>

            <p>{safety.description}</p>
          </div>

          <ul className="recommendations">
            <li>
              Consider shorter outdoor sessions.
            </li>

            <li>
              Avoid intense outdoor exercise if pollution increases.
            </li>

            <li>
              Check the forecast before planning prolonged outdoor
              activities.
            </li>
          </ul>
        </div>
      </section>

      {/* BOTTOM GRID */}

      <section className="dashboard-bottom-grid">
        {/* POTENTIAL FACTORS */}

        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <span className="panel-label">
                ENVIRONMENT
              </span>

              <h2>Potential Factors</h2>
            </div>
          </div>

          <div className="sources-list">
            {sources.map((source) => {
              const Icon = source.icon;

              return (
                <div
                  className="source-item"
                  key={source.name}
                >
                  <div className="source-icon">
                    <Icon size={19} />
                  </div>

                  <div>
                    <strong>{source.name}</strong>

                    <p>{source.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="data-disclaimer">
            These are potential contributing factors, not confirmed
            source attribution.
          </p>
        </div>

        {/* WEATHER */}

        <div className="dashboard-panel weather-panel">
          <div className="panel-header">
            <div>
              <span className="panel-label">
                WEATHER
              </span>

              <h2>Current Conditions</h2>
            </div>

            <Cloud size={25} />
          </div>

          <div className="weather-main">
            <div className="temperature">
              {currentTemperature}°
              <span>C</span>
            </div>

            <div className="weather-summary">
              <strong>
                {isLiveData ? "Live conditions" : "Partly Cloudy"}
              </strong>

              <p>
                {isLiveData
                  ? `Temperature from ${airData.station.name}`
                  : "Feels like 29°C"}
              </p>

              <span className="weather-condition">
                {isLiveData
                  ? "Current environmental data"
                  : "Illustrative conditions"}
              </span>
            </div>
          </div>

          <div className="weather-details">
            <div>
              <Droplets size={18} />
              <span>Humidity</span>
              <strong>
                {humidity !== null && humidity !== undefined
                  ? `${humidity}%`
                  : "64%"}
              </strong>
            </div>

            <div>
              <Wind size={18} />
              <span>Wind Speed</span>
              <strong>
                {windSpeed !== null && windSpeed !== undefined
                  ? `${windSpeed} m/s`
                  : "12 km/h"}
              </strong>
            </div>

            <div>
              <Compass size={18} />
              <span>Wind Direction</span>
              <strong>
                {getWindDirection(windDirection)}
              </strong>
            </div>

            <div>
              <Gauge size={18} />
              <span>Air Pressure</span>
              <strong>
                {pressure !== null && pressure !== undefined
                  ? `${pressure} hPa`
                  : "1012 hPa"}
              </strong>
            </div>
          </div>

          <div className="dispersion-box">
            <div className="dispersion-header">
              <span>AIR DISPERSION</span>

              <strong>Prototype</strong>
            </div>

            <div className="dispersion-bar">
              <div className="dispersion-progress"></div>
            </div>

            <p>
              Dispersion assessment will be calculated using live
              weather and forecast data.
            </p>
          </div>
        </div>
      </section>

      {/* DATA SOURCE */}

      {airData && (
        <p className="data-disclaimer">
          Live air-quality data: {airData.source}. Station:{" "}
          {airData.station.name}. Last update:{" "}
          {airData.timestamp
            ? new Date(airData.timestamp).toLocaleString()
            : "Unavailable"}
          .
        </p>
      )}
    </main>
  );
}