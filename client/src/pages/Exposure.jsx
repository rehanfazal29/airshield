import { useMemo, useState } from "react";
import {
  Activity,
  Clock3,
  Gauge,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";


const activities = {
  sitting: {
    label: "Sitting",
    factor: 1,
  },

  walking: {
    label: "Walking",
    factor: 1.3,
  },

  cycling: {
    label: "Cycling",
    factor: 1.8,
  },

  running: {
    label: "Running",
    factor: 2.2,
  },

  outdoor_work: {
    label: "Outdoor Work",
    factor: 2.5,
  },
};


function getAQIRisk(aqi) {
  if (aqi <= 50) return 10;
  if (aqi <= 100) return 20;
  if (aqi <= 150) return 40;
  if (aqi <= 200) return 55;
  if (aqi <= 300) return 75;

  return 95;
}


function getExposureLevel(score) {
  if (score <= 30) {
    return {
      label: "LOW EXPOSURE",
      className: "exposure-low",
      description: "Exposure is relatively low.",
    };
  }

  if (score <= 60) {
    return {
      label: "MODERATE EXPOSURE",
      className: "exposure-moderate",
      description: "Consider limiting prolonged outdoor exposure.",
    };
  }

  if (score <= 80) {
    return {
      label: "HIGH EXPOSURE",
      className: "exposure-high",
      description: "Reduce prolonged outdoor activity when possible.",
    };
  }

  return {
    label: "VERY HIGH EXPOSURE",
    className: "exposure-very-high",
    description: "Avoid prolonged outdoor exposure when possible.",
  };
}


function getRecommendation(score, activity) {

  if (score <= 30) {
    return "Outdoor activity is relatively lower-risk based on this prototype index.";
  }

  if (score <= 60) {
    return `Consider reducing the duration of ${activity.toLowerCase()} if air quality worsens.`;
  }

  if (score <= 80) {
    return `Reduce prolonged ${activity.toLowerCase()} and consider a lower-intensity or indoor alternative.`;
  }

  return `Avoid prolonged ${activity.toLowerCase()} when possible and consider an indoor alternative.`;
}


export default function Exposure() {

  const [aqi, setAqi] = useState(145);

  const [activity, setActivity] = useState("walking");

  const [duration, setDuration] = useState(45);


  const exposure = useMemo(() => {

    const aqiRisk = getAQIRisk(Number(aqi));

    const activityFactor = activities[activity].factor;

    /*
      Prototype exposure calculation.

      Duration increases exposure gradually.
      The result is capped at 100.
    */

    const durationFactor =
      1 + Math.min(Number(duration), 180) / 180;

    const score = Math.min(
      100,
      Math.round(
        aqiRisk *
        activityFactor *
        durationFactor
        / 2
      )
    );

    const level = getExposureLevel(score);

    return {
      score,
      level,
      recommendation: getRecommendation(
        score,
        activities[activity].label
      ),
    };

  }, [aqi, activity, duration]);


  return (

    <main className="exposure-page">


      {/* HEADER */}

      <section className="exposure-header">

        <div>

          <span className="dashboard-label">
            AIRSHIELD INTELLIGENCE
          </span>

          <h1>
            Exposure Intelligence
          </h1>

          <p>
            Understand how air quality, activity and
            duration can combine to influence your
            environmental exposure.
          </p>

        </div>


        <div className="exposure-demo-badge">
          PROTOTYPE INDEX
        </div>

      </section>


      {/* MAIN GRID */}

      <section className="exposure-main-grid">


        {/* INPUT CARD */}

        <div className="exposure-input-card">

          <div className="section-heading">

            <div className="section-icon">
              <Activity size={19} />
            </div>

            <div>

              <h2>
                Your Activity
              </h2>

              <p>
                Adjust the conditions to estimate exposure.
              </p>

            </div>

          </div>


          {/* AQI */}

          <div className="exposure-field">

            <label>
              Current AQI
            </label>

            <div className="aqi-input-row">

              <input
                type="range"
                min="0"
                max="500"
                value={aqi}
                onChange={(e) =>
                  setAqi(Number(e.target.value))
                }
              />

              <span className="aqi-value">
                {aqi}
              </span>

            </div>

            <small>
              Drag to simulate different air-quality conditions.
            </small>

          </div>


          {/* ACTIVITY */}

          <div className="exposure-field">

            <label>
              Activity
            </label>

            <select
              value={activity}
              onChange={(e) =>
                setActivity(e.target.value)
              }
            >

              {Object.entries(activities).map(
                ([key, value]) => (

                  <option
                    key={key}
                    value={key}
                  >
                    {value.label}
                  </option>

                )
              )}

            </select>

          </div>


          {/* DURATION */}

          <div className="exposure-field">

            <label>
              Duration
            </label>

            <div className="duration-input">

              <Clock3 size={17} />

              <input
                type="number"
                min="1"
                max="180"
                value={duration}
                onChange={(e) =>
                  setDuration(
                    Math.max(
                      1,
                      Math.min(
                        180,
                        Number(e.target.value) || 1
                      )
                    )
                  )
                }
              />

              <span>
                minutes
              </span>

            </div>

          </div>


          {/* CURRENT INPUT SUMMARY */}

          <div className="exposure-summary">

            <div>

              <span>
                AIR QUALITY
              </span>

              <strong>
                AQI {aqi}
              </strong>

            </div>


            <div>

              <span>
                ACTIVITY
              </span>

              <strong>
                {activities[activity].label}
              </strong>

            </div>


            <div>

              <span>
                DURATION
              </span>

              <strong>
                {duration} min
              </strong>

            </div>

          </div>

        </div>


        {/* RESULT CARD */}

        <div className="exposure-result-card">

          <div className="result-top">

            <div>

              <span className="result-label">
                EXPOSURE INDEX
              </span>

              <h2>
                {exposure.score}
                <span>
                  /100
                </span>
              </h2>

            </div>

            <div className="result-icon">
              <Gauge size={27} />
            </div>

          </div>


          <div className="exposure-meter">

            <div
              className="exposure-meter-fill"
              style={{
                width: `${exposure.score}%`,
              }}
            />

          </div>


          <div
            className={`exposure-level ${exposure.level.className}`}
          >

            <div className="level-icon">

              {exposure.score > 60
                ? <AlertTriangle size={18} />
                : <ShieldCheck size={18} />
              }

            </div>

            <div>

              <strong>
                {exposure.level.label}
              </strong>

              <p>
                {exposure.level.description}
              </p>

            </div>

          </div>


          {/* ACTION */}

          <div className="exposure-action">

            <span>
              RECOMMENDED ACTION
            </span>

            <p>
              {exposure.recommendation}
            </p>

          </div>


          {/* FORMULA */}

          <div className="exposure-formula">

            <span>
              HOW IT WORKS
            </span>

            <p>
              AirShield combines an AQI risk factor,
              activity intensity and exposure duration
              into a prototype 0–100 decision-support index.
            </p>

          </div>

        </div>

      </section>


      {/* ACTIVITY FACTORS */}

      <section className="activity-section">

        <div className="section-heading">

          <div className="section-icon">
            <Activity size={19} />
          </div>

          <div>

            <h2>
              Activity Intensity
            </h2>

            <p>
              Different activities can involve different
              levels of physical exertion.
            </p>

          </div>

        </div>


        <div className="activity-grid">

          {Object.entries(activities).map(
            ([key, value]) => (

              <button
                key={key}
                className={
                  activity === key
                    ? "activity-option active"
                    : "activity-option"
                }
                onClick={() => setActivity(key)}
              >

                <strong>
                  {value.label}
                </strong>

                <span>
                  Factor {value.factor}×
                </span>

              </button>

            )
          )}

        </div>

      </section>


      {/* DISCLAIMER */}

      <div className="exposure-disclaimer">

        <AlertTriangle size={16} />

        <p>
          The Exposure Index is an AirShield prototype
          decision-support metric. It is not a medically
          validated measurement and should not be used
          for diagnosis or treatment decisions.
        </p>

      </div>

    </main>

  );
}