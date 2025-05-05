import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './LandingPage';
import Dashboard_p from './Dashboard_p';
import Dashboard_s from './Dashboard_s';
import LoginPage from './LoginPage';
import RequestReEvaluation from './RequestReEvaluation';
import Notification from './Notification';

function App() {
  const [userRole, setUserRole] = useState(null); // student / professor

  useEffect(() => {
    const storedUserId = localStorage.getItem('loggedInUserId');
    if (storedUserId === 'student123') {
      setUserRole('student');
    } else if (storedUserId === 'professor123') {
      setUserRole('professor');
    }
  }, []);

  return (
    <Router>
      <div>
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/">Home</Link> |{" "}
          <Link to="/login">Login</Link> |{" "}
          {userRole === 'professor' && (
            <Link to="/dashboard_p">Professor Dashboard</Link>
          )}
          {userRole === 'student' && (
            <Link to="/dashboard_s">Student Dashboard</Link>
          )}
        </nav>

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard_p" element={<Dashboard_p />} />
          <Route path="/dashboard_s" element={<Dashboard_s />} />
          <Route path="/request-reevaluation" element={<RequestReEvaluation />} />
          <Route path="/notifications" element={<Notification />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
