import { Link } from "react-router-dom";
import {
  ArrowRight,
  Wind,
  Activity,
  Map,
  School,
} from "lucide-react";

const features = [
  {
    icon: Wind,
    title: "Air Quality",
    description:
      "Understand AQI and key pollution indicators in your area.",
  },
  {
    icon: Activity,
    title: "Exposure",
    description:
      "Estimate how your activity and time outdoors affect exposure.",
  },
  {
    icon: Map,
    title: "Pollution Map",
    description:
      "Explore pollution conditions and environmental hotspots.",
  },
  {
    icon: School,
    title: "School Safety",
    description:
      "Help schools make safer decisions on polluted days.",
  },
];

export default function Home() {
  return (
    <main className="home">

      {/* HERO */}

      <section className="hero">

        <div className="hero-content">

          <div className="hero-badge">
            <span></span>
            SMART AIR QUALITY INTELLIGENCE
          </div>

          <h1>
            Know your air.
            <br />
            <span>Protect your health.</span>
          </h1>

          <p className="hero-description">
            AirShield transforms air quality data into
            understandable insights, exposure estimates
            and practical safety recommendations.
          </p>

          <div className="hero-actions">

            <Link to="/dashboard" className="primary-btn">
              Explore Dashboard
              <ArrowRight size={18} />
            </Link>

            <Link to="/exposure" className="secondary-btn">
              Check Exposure
            </Link>

          </div>

          <p className="hero-note">
            From AQI → Exposure → Action
          </p>

        </div>

        {/* AQI CARD */}

        <div className="hero-card-wrapper">

          <div className="hero-card">

            <div className="hero-card-header">

              <div>
                <p className="card-label">
                  CURRENT AIR QUALITY
                </p>

                <p className="card-location">
                  Your Location
                </p>
              </div>

              <Wind size={28} />

            </div>

            <div className="aqi-display">

              <div>
                <span className="aqi-value">85</span>
                <span className="aqi-unit">AQI</span>
              </div>

              <span className="aqi-status">
                Moderate
              </span>

            </div>

            <div className="aqi-bar">
              <div className="aqi-progress"></div>
            </div>

            <div className="hero-card-footer">

              <div>
                <span>PM2.5</span>
                <strong>—</strong>
              </div>

              <div>
                <span>PM10</span>
                <strong>—</strong>
              </div>

              <div>
                <span>Updated</span>
                <strong>Demo</strong>
              </div>

            </div>

            <div className="demo-label">
              DEMO DATA
            </div>

          </div>

        </div>

      </section>

      {/* WHY AIRSHIELD */}

      <section className="features-section">

        <div className="section-heading">

          <span className="section-label">
            WHY AIRSHIELD
          </span>

          <h2>
            AQI is only the beginning.
          </h2>

          <p>
            AirShield helps turn environmental data
            into decisions you can actually use.
          </p>

        </div>

        <div className="features-grid">

          {features.map((feature) => {

            const Icon = feature.icon;

            return (
              <div
                className="feature-card"
                key={feature.title}
              >

                <div className="feature-icon">
                  <Icon size={24} />
                </div>

                <h3>{feature.title}</h3>

                <p>
                  {feature.description}
                </p>

              </div>
            );

          })}

        </div>

      </section>

      {/* CTA */}

      <section className="home-cta">

        <div>

          <span className="section-label">
            AIRSHIELD
          </span>

          <h2>
            Don't just check the AQI.
            <br />
            Understand what it means.
          </h2>

        </div>

        <Link to="/dashboard" className="primary-btn">
          Open Dashboard
          <ArrowRight size={18} />
        </Link>

      </section>

    </main>
  );
}