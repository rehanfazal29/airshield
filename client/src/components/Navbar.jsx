import { NavLink } from "react-router-dom";
import { Wind, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { name: "Home", path: "/" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Map", path: "/map" },
  { name: "Exposure", path: "/exposure" },
  { name: "Forecast", path: "/forecast" },
  { name: "Schools", path: "/schools" },
  { name: "AI Assistant", path: "/assistant" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="navbar">
      <NavLink to="/" className="logo">
        <Wind size={28} />
        <span>AirShield</span>
      </NavLink>

      <button
        className="menu-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      <nav className={isOpen ? "nav-links open" : "nav-links"}>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === "/"}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}