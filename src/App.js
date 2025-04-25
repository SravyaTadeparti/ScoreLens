import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import Dashboard_p from './Dashboard_p';
import Dashboard_s from './Dashboard_s';
import LoginPage from './LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard_p" element={<Dashboard_p />} />
        <Route path="/dashboard_s" element={<Dashboard_s />} />
      </Routes>
    </Router>
  );
}

export default App;
