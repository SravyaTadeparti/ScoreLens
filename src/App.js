import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Marksheets from './components/Marksheets'; // You’ll create this
import './App.css'; // Ensure this line is here for CSS
import RightSidebar from './components/RightSidebar'; // Adjust the path if necessary


function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        {/* LEFT SIDEBAR */}
        <div style={{ width: '200px', background: '#f0f0f0', height: '100vh', padding: '20px' }}>
          <h2>ScoreLens</h2>
          <nav>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><Link to="/marksheets">Marksheets</Link></li>
              {/* Add more links like Individual Scores, Ranks etc later */}
            </ul>
          </nav>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/marksheets" element={<Marksheets />} />
          </Routes>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="right-sidebar">
          <ul>
            <li><a href="#marksheets">Mark Sheets</a></li>
            <li><a href="#individual-scores">Individual Scores</a></li>
            <li><a href="#ranks">Ranks</a></li>
          </ul>
        </div>
      </div>
    </Router>
  );
}

export default App;


// import React, { useState, useEffect } from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import LoginPage from './LoginPage'; // Assuming your LoginPage component is in a separate file
// import Dashboard_p from './Dashboard_p'; // Assuming your Dashboard_p component is in a separate file
// import LocalStorageTest from './LocalStorageTest';

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userRole, setUserRole] = useState(null);

//   useEffect(() => {
//       const storedUserId = localStorage.getItem('user_id');
//       const storedRole = localStorage.getItem('role');
//       if (storedUserId) {
//           setIsLoggedIn(true);
//           setUserRole(storedRole);
//       }
//   }, []);

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route
//           path="/dashboard_p"
//           element={<Dashboard_p />}
//         />
//         {/* Add other routes as needed */}
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
