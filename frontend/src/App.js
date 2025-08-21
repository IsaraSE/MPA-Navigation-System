import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";

function App() {
  return (
    <Router>
      {/* Navigation Bar */}
      <nav style={{ padding: "10px", background: "#D8F1F6" }}>
        <Link to="/" style={{ marginRight: "20px", color: "#0062F0", textDecoration: "none" }}>
          Home
        </Link>
        <Link to="/about" style={{ color: "#0062F0", textDecoration: "none" }}>
          About
        </Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
