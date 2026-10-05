import { useMemo, useState } from "react";
import {
  TrendingUp,
  Clock3,
  ShieldCheck,
  AlertTriangle,
  Activity,
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


const forecastData = [
  {
    time: "Now",
    aqi: 85,
  },
  {
    time: "1 PM",
    aqi: 91,
  },
  {
    time: "2 PM",
    aqi: 96,
  },
  {
    time: "3 PM",
    aqi: 102,
  },
  {
    time: "4 PM",
    aqi: 98,
  },
  {
    time: "5 PM",
    aqi: 89,
  },
  {
    time: "6 PM",
    aqi: 82,
  },
];


function getAQILevel(aqi) {

  if (aqi <= 50) return "Good";

  if (aqi <= 100) return "Moderate";

  if (aqi <= 150) {
    return "Unhealthy for Sensitive Groups";
  }

  if (aqi <= 200) return "Unhealthy";

  if (aqi <= 300) return "Very Unhealthy";

  return "Hazardous";
}


function getAQIClass(aqi) {

  if (aqi <= 50) return "forecast-good";

  if (aqi <= 100) return "forecast-moderate";

  if (aqi <= 150) return "forecast-sensitive";

  if (aqi <= 200) return "forecast-unhealthy";

  if (aqi <= 300) return "forecast-very-unhealthy";

  return "forecast-hazardous";
}


function getRecommendation(aqi) {

  if (aqi <= 50) {
    return "Conditions are relatively favorable for outdoor activity.";
  }

  if (aqi <= 100) {
    return "Outdoor activity is generally reasonable, but monitor the trend.";
  }

  if (aqi <= 150) {
    return "Consider reducing prolonged or high-intensity outdoor activity.";
  }

  if (aqi <= 200) {
    return "Limit outdoor exposure and consider indoor alternatives.";
  }

  return "Avoid prolonged outdoor exposure when possible.";
}


export default function Forecast() {

  const [selectedTime, setSelectedTime] = useState("Now");


  const selectedForecast = useMemo(() => {

    return (
      forecastData.find(
        (item) => item.time === selectedTime
      ) || forecastData[0]
    );

  }, [selectedTime]);


  const peakForecast = useMemo(() => {

    return forecastData.reduce(
      (highest, current) =>
        current.aqi > highest.aqi
          ? current
          : highest,
      forecastData[0]
    );

  }, []);


  const saferWindow = useMemo(() => {

    const lowerRisk = forecastData.filter(
      (item) => item.aqi < 100
    );

    if (lowerRisk.length === 0) {
      return "No lower-risk window in this forecast.";
    }

    return lowerRisk
      .map((item) => item.time)
      .join(" • ");

  }, []);


  const trend = useMemo(() => {

    const first = forecastData[0].aqi;
    const last = forecastData[forecastData.length - 1].aqi;

    if (last > first) {
      return "Worsening";
    }

    if (last < first) {
      return "Improving";
    }

    return "Stable";

  }, []);


  return (

    <main className="forecast-page">


      {/* HEADER */}

      <section className="forecast-header">

        <div>

          <span className="dashboard-label">
            AIRSHIELD INTELLIGENCE
          </span>

          <h1>
            Forecast Intelligence
          </h1>

          <p>
            Look ahead at expected air-quality changes
            and identify periods that may be more suitable
            for outdoor activity.
          </p>

        </div>


        <div className="forecast-demo-badge">
          DEMO FORECAST
        </div>

      </section>


      {/* SUMMARY CARDS */}

      <section className="forecast-summary-grid">


        <div className="forecast-summary-card">

          <div className="forecast-summary-icon">
            <TrendingUp size={20} />
          </div>

          <div>

            <span>
              TREND
            </span>

            <strong>
              {trend}
            </strong>

            <p>
              Based on the displayed forecast period.
            </p>

          </div>

        </div>


        <div className="forecast-summary-card">

          <div className="forecast-summary-icon warning">
            <AlertTriangle size={20} />
          </div>

          <div>

            <span>
              PEAK RISK
            </span>

            <strong>
              {peakForecast.time} · AQI {peakForecast.aqi}
            </strong>

            <p>
              {getAQILevel(peakForecast.aqi)}
            </p>

          </div>

        </div>


        <div className="forecast-summary-card">

          <div className="forecast-summary-icon">
            <ShieldCheck size={20} />
          </div>

          <div>

            <span>
              LOWER-RISK PERIODS
            </span>

            <strong>
              {saferWindow}
            </strong>

            <p>
              AQI below 100 in this prototype forecast.
            </p>

          </div>

        </div>

      </section>


      {/* CHART */}

      <section className="forecast-chart-card">

        <div className="forecast-section-header">

          <div>

            <h2>
              AQI Forecast
            </h2>

            <p>
              Expected air-quality trend over the next
              several hours.
            </p>

          </div>

          <div className="forecast-chart-badge">
            NEXT 6 HOURS
          </div>

        </div>


        <div className="forecast-chart">

          <ResponsiveContainer
            width="100%"
            height={360}
          >

            <AreaChart
              data={forecastData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >

              <defs>

                <linearGradient
                  id="forecastGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >

                  <stop
                    offset="0%"
                    stopColor="#087f65"
                    stopOpacity={0.28}
                  />

                  <stop
                    offset="100%"
                    stopColor="#087f65"
                    stopOpacity={0.02}
                  />

                </linearGradient>

              </defs>


              <CartesianGrid
                stroke="#e8efec"
                strokeDasharray="4 4"
              />


              <XAxis
                dataKey="time"
                tick={{
                  fill: "#718189",
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
              />


              <YAxis
                domain={[0, 150]}
                tick={{
                  fill: "#718189",
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
              />


              <Tooltip
                contentStyle={{
                  border: "1px solid #dfeae6",
                  borderRadius: "10px",
                  background: "#ffffff",
                  boxShadow:
                    "0 8px 25px rgba(25,65,55,0.10)",
                }}
                formatter={(value) => [
                  `AQI ${value}`,
                  "Air Quality",
                ]}
              />


              <Area
                type="monotone"
                dataKey="aqi"
                stroke="#087f65"
                strokeWidth={3}
                fill="url(#forecastGradient)"
                dot={{
                  r: 4,
                  fill: "#087f65",
                  strokeWidth: 2,
                  stroke: "#ffffff",
                }}
                activeDot={{
                  r: 6,
                }}
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

      </section>


      {/* HOURLY FORECAST */}

      <section className="hourly-forecast-section">

        <div className="forecast-section-header">

          <div>

            <h2>
              Hourly Outlook
            </h2>

            <p>
              Select a time to inspect the expected conditions.
            </p>

          </div>

        </div>


        <div className="hourly-forecast-grid">

          {forecastData.map((item) => (

            <button
              key={item.time}
              className={
                selectedTime === item.time
                  ? "hourly-card active"
                  : "hourly-card"
              }
              onClick={() =>
                setSelectedTime(item.time)
              }
            >

              <span>
                {item.time}
              </span>

              <strong>
                {item.aqi}
              </strong>

              <small>
                {getAQILevel(item.aqi)}
              </small>

            </button>

          ))}

        </div>

      </section>


      {/* SELECTED OUTLOOK */}

      <section className="selected-forecast-card">

        <div className="selected-forecast-main">

          <div className="selected-icon">
            <Activity size={22} />
          </div>

          <div>

            <span>
              SELECTED OUTLOOK · {selectedForecast.time}
            </span>

            <h2>
              AQI {selectedForecast.aqi}
            </h2>

            <p>
              {getAQILevel(selectedForecast.aqi)}
            </p>

          </div>

        </div>


        <div className="selected-recommendation">

          <div className="recommendation-label">
            RECOMMENDED ACTION
          </div>

          <p>
            {getRecommendation(selectedForecast.aqi)}
          </p>

        </div>

      </section>


      {/* DISCLAIMER */}

      <div className="forecast-disclaimer">

        <Clock3 size={16} />

        <p>
          Forecast values shown here are illustrative
          demo data. Live forecast predictions will be
          connected to external environmental data sources
          in a later integration step.
        </p>

      </div>


    </main>

  );
}