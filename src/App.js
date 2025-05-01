import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Marksheets from './components/Marksheets';

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-grow p-6">
          <Routes>
            <Route path="/marksheets" element={<Marksheets />} />
            {/* You can add other routes later like individual-scores, ranks, etc. */}
          </Routes>
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
