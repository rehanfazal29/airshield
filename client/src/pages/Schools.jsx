import { useMemo, useState } from "react";
import {
  School as SchoolIcon,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Clock3,
  Wind,
} from "lucide-react";


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


const sampleSchools = [
  {
    id: 1,
    name: "Illustrative School A",
    area: "Central Delhi",
    students: 850,
  },
  {
    id: 2,
    name: "Illustrative School B",
    area: "South Delhi",
    students: 620,
  },
  {
    id: 3,
    name: "Illustrative School C",
    area: "East Delhi",
    students: 740,
  },
];


function getSchoolRisk(aqi) {

  if (aqi < 100) {

    return {
      label: "NORMAL",
      className: "school-normal",
      description:
        "Outdoor activities can continue under normal conditions.",
    };

  }


  if (aqi < 200) {

    return {
      label: "CAUTION",
      className: "school-caution",
      description:
        "Consider reducing prolonged or high-intensity outdoor activities.",
    };

  }


  if (aqi < 300) {

    return {
      label: "HIGH RISK",
      className: "school-high",
      description:
        "Reduce outdoor activities and consider indoor alternatives.",
    };

  }


  return {
    label: "VERY HIGH RISK",
    className: "school-very-high",
    description:
      "Avoid outdoor activities when possible.",
  };

}


function getOutdoorStatus(aqi) {

  if (aqi < 100) {
    return "Outdoor activities allowed";
  }

  if (aqi < 200) {
    return "Outdoor activities with caution";
  }

  if (aqi < 300) {
    return "Outdoor activities should be reduced";
  }

  return "Avoid outdoor activities";

}


export default function Schools() {

  const [selectedSchool, setSelectedSchool] =
    useState(sampleSchools[0].id);


  const selectedSchoolData = sampleSchools.find(
    (school) => school.id === selectedSchool
  );


  const currentAQI = forecastData[0].aqi;


  const peakForecast = useMemo(() => {

    return forecastData.reduce(
      (highest, current) =>
        current.aqi > highest.aqi
          ? current
          : highest,
      forecastData[0]
    );

  }, []);


  const currentRisk = getSchoolRisk(currentAQI);

  const peakRisk = getSchoolRisk(peakForecast.aqi);


  return (

    <main className="schools-page">


      {/* HEADER */}

      <section className="schools-header">

        <div>

          <span className="dashboard-label">
            AIRSHIELD SCHOOL SAFETY
          </span>

          <h1>
            School Safety
          </h1>

          <p>
            Turn air-quality conditions and forecast trends
            into practical school activity guidance.
          </p>

        </div>


        <div className="schools-demo-badge">
          DEMO DATA
        </div>

      </section>


      {/* SCHOOL SELECTOR */}

      <section className="school-selector-card">

        <div className="school-selector-heading">

          <div className="school-icon">
            <SchoolIcon size={21} />
          </div>

          <div>

            <h2>
              School Monitoring
            </h2>

            <p>
              Select a school to view its environmental safety status.
            </p>

          </div>

        </div>


        <div className="school-selector-list">

          {sampleSchools.map((school) => (

            <button
              key={school.id}
              className={
                selectedSchool === school.id
                  ? "school-select-option active"
                  : "school-select-option"
              }
              onClick={() =>
                setSelectedSchool(school.id)
              }
            >

              <div>

                <strong>
                  {school.name}
                </strong>

                <span>
                  {school.area}
                </span>

              </div>

              <small>
                {school.students} students
              </small>

            </button>

          ))}

        </div>

      </section>


      {/* CURRENT STATUS */}

      <section className="school-status-grid">


        <div className="school-status-card">

          <div className="school-status-header">

            <div>

              <span>
                CURRENT AIR QUALITY
              </span>

              <h2>
                AQI {currentAQI}
              </h2>

            </div>

            <div className="school-status-aqi">
              <Wind size={22} />
            </div>

          </div>


          <div
            className={`school-risk-badge ${currentRisk.className}`}
          >

            {currentRisk.label}

          </div>


          <p className="school-status-description">
            {currentRisk.description}
          </p>

        </div>


        <div className="school-status-card">

          <div className="school-status-header">

            <div>

              <span>
                OUTDOOR ACTIVITY
              </span>

              <h2>
                {getOutdoorStatus(currentAQI)}
              </h2>

            </div>

            <div className="school-status-aqi">
              <Activity size={22} />
            </div>

          </div>


          <p className="school-status-description">

            Guidance is based on the prototype AQI
            thresholds configured for AirShield.

          </p>


          <div className="school-action-row">

            <ShieldCheck size={17} />

            <span>
              Monitor conditions before outdoor sessions.
            </span>

          </div>

        </div>


        <div className="school-status-card">

          <div className="school-status-header">

            <div>

              <span>
                FORECAST PEAK
              </span>

              <h2>
                {peakForecast.time} · AQI {peakForecast.aqi}
              </h2>

            </div>

            <div className="school-status-aqi warning">
              <AlertTriangle size={22} />
            </div>

          </div>


          <div
            className={`school-risk-badge ${peakRisk.className}`}
          >

            {peakRisk.label}

          </div>


          <p className="school-status-description">

            The displayed forecast reaches its highest
            AQI at {peakForecast.time}.

          </p>

        </div>

      </section>


      {/* SAFETY PLAN */}

      <section className="school-plan-card">

        <div className="school-plan-header">

          <div>

            <h2>
              Recommended School Plan
            </h2>

            <p>
              Suggested actions based on the current
              prototype conditions.
            </p>

          </div>

          <Clock3 size={21} />

        </div>


        <div className="school-plan-grid">


          <div className="school-plan-item">

            <div className="plan-number">
              01
            </div>

            <div>

              <strong>
                Check conditions
              </strong>

              <p>
                Review current AQI before scheduling
                outdoor activities.
              </p>

            </div>

          </div>


          <div className="school-plan-item">

            <div className="plan-number">
              02
            </div>

            <div>

              <strong>
                Watch forecast peaks
              </strong>

              <p>
                Consider moving outdoor sessions away
                from higher-risk forecast periods.
              </p>

            </div>

          </div>


          <div className="school-plan-item">

            <div className="plan-number">
              03
            </div>

            <div>

              <strong>
                Prefer indoor alternatives
              </strong>

              <p>
                When AQI is elevated, consider indoor
                activities where practical.
              </p>

            </div>

          </div>


        </div>

      </section>


      {/* SELECTED SCHOOL */}

      <section className="selected-school-card">

        <div className="selected-school-icon">
          <SchoolIcon size={22} />
        </div>

        <div>

          <span>
            SELECTED SCHOOL
          </span>

          <h2>
            {selectedSchoolData.name}
          </h2>

          <p>
            {selectedSchoolData.area} ·{" "}
            {selectedSchoolData.students} students
          </p>

        </div>

        <div className="selected-school-status">

          <span>
            CURRENT STATUS
          </span>

          <strong>
            {currentRisk.label}
          </strong>

        </div>

      </section>


      {/* DISCLAIMER */}

      <div className="schools-disclaimer">

        <AlertTriangle size={16} />

        <p>
          School safety guidance shown here is based on
          illustrative AQI thresholds and demo forecast data.
          It is intended as an environmental decision-support
          prototype, not medical or institutional policy advice.
        </p>

      </div>


    </main>

  );

}