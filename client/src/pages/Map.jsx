import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Marker,
  useMap,
} from "react-leaflet";

import { useEffect, useState } from "react";
import L from "leaflet";

import {
  MapPin,
  Flame,
  School,
  Wind,
  LocateFixed,
} from "lucide-react";


const pollutionZones = [
  {
    id: 1,
    name: "Monitoring Zone A",
    lat: 28.6139,
    lng: 77.209,
    aqi: 85,
    pm25: 42,
  },
  {
    id: 2,
    name: "Monitoring Zone B",
    lat: 28.628,
    lng: 77.215,
    aqi: 145,
    pm25: 78,
  },
  {
    id: 3,
    name: "Monitoring Zone C",
    lat: 28.595,
    lng: 77.225,
    aqi: 210,
    pm25: 126,
  },
];


const fireHotspots = [
  {
    id: 1,
    name: "Illustrative Fire Hotspot",
    lat: 28.65,
    lng: 77.28,
  },
];


const schools = [
  {
    id: 1,
    name: "Illustrative School",
    lat: 28.62,
    lng: 77.19,
  },
];


const fireIcon = new L.DivIcon({
  className: "custom-map-marker",
  html: `
    <div class="fire-marker">
      🔥
    </div>
  `,
  iconSize: [35, 35],
  iconAnchor: [17, 17],
});


const schoolIcon = new L.DivIcon({
  className: "custom-map-marker",
  html: `
    <div class="school-marker">
      🏫
    </div>
  `,
  iconSize: [35, 35],
  iconAnchor: [17, 17],
});


function getAQIColor(aqi) {
  if (aqi <= 50) return "#16805c";
  if (aqi <= 100) return "#d59b19";
  if (aqi <= 150) return "#c56b00";
  if (aqi <= 200) return "#c44d32";
  if (aqi <= 300) return "#9b3f7a";

  return "#7a2633";
}


function getAQILevel(aqi) {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";

  return "Hazardous";
}


/* Moves map to user's location */

function RecenterMap({ location }) {

  const map = useMap();

  useEffect(() => {

    if (location) {

      map.flyTo(
        [location.lat, location.lng],
        13,
        {
          duration: 1.2,
        }
      );

    }

  }, [location, map]);

  return null;
}


export default function Map() {

  const [userLocation, setUserLocation] = useState(null);

  const [locationStatus, setLocationStatus] =
    useState("detecting");

  const [showFires, setShowFires] = useState(true);

  const [showSchools, setShowSchools] = useState(true);

  const [aqiFilter, setAqiFilter] = useState("all");


  useEffect(() => {

    if (!navigator.geolocation) {

      setLocationStatus("unsupported");

      return;
    }


    navigator.geolocation.getCurrentPosition(

      (position) => {

        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        setLocationStatus("success");

      },

      () => {

        setLocationStatus("denied");

      },

      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }

    );

  }, []);


  const mapCenter = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [28.6139, 77.209];


  const filteredZones = pollutionZones.filter((zone) => {

    if (aqiFilter === "good") {
      return zone.aqi <= 50;
    }

    if (aqiFilter === "moderate") {
      return zone.aqi > 50 && zone.aqi <= 100;
    }

    if (aqiFilter === "high") {
      return zone.aqi > 100;
    }

    return true;

  });


  return (

    <main className="map-page">


      {/* HEADER */}

      <section className="map-header">

        <div>

          <span className="dashboard-label">
            AIRSHIELD ENVIRONMENT
          </span>

          <h1>Pollution Map</h1>

          <p>
            Explore air quality, potential fire activity
            and nearby environmental points.
          </p>

        </div>


        <div className="map-status">

          <Wind size={18} />

          <span>
            Illustrative data
          </span>

        </div>

      </section>


      {/* MAP CONTROLS */}

      <section className="map-controls">

        <div className="control-group">

          <span className="control-label">
            AQI
          </span>

          <button
            className={aqiFilter === "all" ? "active" : ""}
            onClick={() => setAqiFilter("all")}
          >
            All
          </button>

          <button
            className={aqiFilter === "good" ? "active" : ""}
            onClick={() => setAqiFilter("good")}
          >
            Good
          </button>

          <button
            className={aqiFilter === "moderate" ? "active" : ""}
            onClick={() => setAqiFilter("moderate")}
          >
            Moderate
          </button>

          <button
            className={aqiFilter === "high" ? "active" : ""}
            onClick={() => setAqiFilter("high")}
          >
            High
          </button>

        </div>


        <div className="control-group">

          <span className="control-label">
            Layers
          </span>

          <button
            className={showFires ? "active" : ""}
            onClick={() => setShowFires(!showFires)}
          >
            🔥 Fire
          </button>

          <button
            className={showSchools ? "active" : ""}
            onClick={() => setShowSchools(!showSchools)}
          >
            🏫 Schools
          </button>

        </div>


        <button
          className="location-button"
          onClick={() => {

            if (userLocation) {

              document
                .querySelector(".airshield-map")
                ?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });

            }

          }}
          disabled={!userLocation}
        >

          <LocateFixed size={16} />

          {userLocation
            ? "My Location"
            : "Location unavailable"}

        </button>

      </section>


      {/* MAP */}

      <section className="map-card">

        <MapContainer
          center={mapCenter}
          zoom={11}
          scrollWheelZoom={true}
          className="airshield-map"
        >

          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />


          <RecenterMap location={userLocation} />


          {/* AQI ZONES */}

          {filteredZones.map((zone) => (

            <CircleMarker
              key={zone.id}
              center={[zone.lat, zone.lng]}
              radius={22}
              pathOptions={{
                color: getAQIColor(zone.aqi),
                fillColor: getAQIColor(zone.aqi),
                fillOpacity: 0.25,
                weight: 2,
              }}
            >

              <Popup>

                <div className="map-popup">

                  <strong>
                    {zone.name}
                  </strong>

                  <span>
                    AQI: {zone.aqi}
                  </span>

                  <small>
                    {getAQILevel(zone.aqi)}
                  </small>

                  <small>
                    PM2.5: {zone.pm25} µg/m³
                  </small>

                  <div
                    style={{
                    marginTop: "6px",
                    padding: "5px 8px",
                    borderRadius: "6px",
                    background: `${getAQIColor(zone.aqi)}15`,
                    color: getAQIColor(zone.aqi),
                    fontSize: "10px",
                    fontWeight: "700",
                    }}
                 >
                    Prototype risk indicator
                  </div>

                </div>

              </Popup>

            </CircleMarker>

          ))}


          {/* FIRE HOTSPOTS */}

          {showFires &&
            fireHotspots.map((fire) => (

              <Marker
                key={fire.id}
                position={[fire.lat, fire.lng]}
                icon={fireIcon}
              >

                <Popup>

                  <div className="map-popup">

                    <strong>
                      {fire.name}
                    </strong>

                    <small>
                      Potential regional influence
                    </small>

                  </div>

                </Popup>

              </Marker>

            ))}


          {/* SCHOOLS */}

          {showSchools &&
            schools.map((school) => (

              <Marker
                key={school.id}
                position={[school.lat, school.lng]}
                icon={schoolIcon}
              >

                <Popup>

                  <div className="map-popup">

                    <strong>
                      {school.name}
                    </strong>

                    <small>
                      School safety point
                    </small>

                  </div>

                </Popup>

              </Marker>

            ))}


          {/* USER LOCATION */}

          {userLocation && (

            <CircleMarker
              center={[
                userLocation.lat,
                userLocation.lng,
              ]}
              radius={9}
              pathOptions={{
                color: "#087f65",
                fillColor: "#087f65",
                fillOpacity: 0.9,
                weight: 3,
              }}
            >

              <Popup>

                <div className="map-popup">

                  <strong>
                    Your Location
                  </strong>

                  <small>
                    Browser-detected location
                  </small>

                </div>

              </Popup>

            </CircleMarker>

          )}

        </MapContainer>


        {/* LEGEND */}

        <div className="map-legend">

          <div className="legend-title">
            MAP LEGEND
          </div>


          <div className="legend-item">

            <span
              className="legend-dot"
              style={{ background: "#16805c" }}
            />

            Good AQI

          </div>


          <div className="legend-item">

            <span
              className="legend-dot"
              style={{ background: "#d59b19" }}
            />

            Moderate AQI

          </div>


          <div className="legend-item">

            <span
              className="legend-dot"
              style={{ background: "#c44d32" }}
            />

            High AQI

          </div>


          <div className="legend-item">
            <span>🔥</span>
            Fire hotspot
          </div>


          <div className="legend-item">
            <span>🏫</span>
            School
          </div>


          <div className="legend-item">

            <span className="legend-user" />

            You

          </div>

        </div>

      </section>


      {/* INFO CARDS */}

      <section className="map-info-grid">

        <div className="map-info-card">

          <MapPin size={22} />

          <div>

            <h3>
              Your Location
            </h3>

            <p>

              {locationStatus === "success"
                ? "Your browser location is available."
                : "Location is not currently available."}

            </p>

          </div>

        </div>


        <div className="map-info-card">

          <Flame size={22} />

          <div>

            <h3>
              Fire Activity
            </h3>

            <p>
              Fire markers are illustrative until
              real hotspot data is connected.
            </p>

          </div>

        </div>


        <div className="map-info-card">

          <School size={22} />

          <div>

            <h3>
              Schools
            </h3>

            <p>
              School safety locations can be added
              to the map.
            </p>

          </div>

        </div>

      </section>


      <p className="map-disclaimer">
        Map markers and pollution values shown here are
        illustrative demo data and are not live measurements.
      </p>

    </main>

  );
}