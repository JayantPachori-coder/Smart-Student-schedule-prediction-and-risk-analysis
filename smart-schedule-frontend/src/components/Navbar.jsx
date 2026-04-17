import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Smart Student</div>
      <ul className="navbar-links">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/schedule-prediction">Schedule Prediction</Link></li>
        <li><Link to="/risk-insights">Risk Insights</Link></li>
        <li><Link to="/proctored-test">Proctored Test</Link></li>
        <li><Link to="/assignments">Assignments</Link></li>
        <li><Link to="/view-schedule">View Schedule</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;