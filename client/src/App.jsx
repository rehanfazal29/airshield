import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Map from "./pages/Map";
import Exposure from "./pages/Exposure";
import Forecast from "./pages/Forecast";
import Schools from "./pages/Schools";
import Assistant from "./pages/Assistant";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/map" element={<Map />} />
        <Route path="/exposure" element={<Exposure />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/schools" element={<Schools />} />
        <Route path="/assistant" element={<Assistant />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;