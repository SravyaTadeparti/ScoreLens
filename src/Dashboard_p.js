// import React, { useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   Tooltip,
//   Legend
// } from 'chart.js';
// import { useNavigate } from 'react-router-dom';
// import './Dashboard_p.css';

// ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

// // const courses = [
// //   { name: 'Mathematics', professor: 'Dr. Smith', description: 'Advanced Algebra & Calculus' },
// //   { name: 'Physics', professor: 'Dr. Johnson', description: 'Quantum Mechanics & Thermodynamics' },
// //   { name: 'Computer Science', professor: 'Prof. Allen', description: 'Data Structures & Algorithms' }
// // ];




// export default function Dashboard_p() {
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [courseData, setCourseData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [courses, setCourses] = useState([]);

//   const navigate = useNavigate();

//   const handleCreateCourse = () => {
//     const courseName = prompt('Enter course name:');
//     if (!courseName) return;
  
//     const courseCode = Math.random().toString(36).substring(2, 8).toUpperCase(); 
//     const newCourse = {
//       name: courseName,
//       professor: 'You', 
//       description: 'Newly created course',
//       code: courseCode
//     };
  
//     setCourses(prev => [...prev, newCourse]);
//     alert(`Course "${courseName}" created with code: ${courseCode}`);
//   };

//   const handleExcelUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file || !selectedCourse) return;

//     setLoading(true);
//     setError(null);

//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('subject', selectedCourse);

//     try {
//       const response = await fetch('http://localhost:5001/upload', {
//         method: 'POST',
//         body: formData
//       });

//       const result = await response.json();

//       if (response.ok) {
//         alert(result.message);
//         setCourseData(prev => ({
//           ...prev,
//           [selectedCourse]: {
//             labels: result.labels,
//             scores: result.scores,
//             stats: result.statistics
//           }
//         }));
//       } else {
//         setError(result.error);
//       }
//     } catch (err) {
//       setError(`Error uploading file: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const selectedData = courseData[selectedCourse] || { labels: [], scores: [], stats: {} };

//   const chartData = {
//     labels: selectedData.labels,
//     datasets: [
//       {
//         label: 'Marks',
//         data: selectedData.scores,
//         borderColor: '#007BFF',
//         backgroundColor: 'rgba(0, 123, 255, 0.2)',
//         borderWidth: 2,
//         tension: 0.4
//       }
//     ]
//   };

//   return (
//     <div className="dashboard">
//       <header className="dashboard-header">
//         <h1>Professor Dashboard</h1>
//         <div className="header-buttons">
//           {/* <button onClick={() => alert('Create Class feature coming soon!')}>Create Class</button> */}
//           <button onClick={handleCreateCourse}>Create Class</button>

//           <button onClick={() => navigate('/login')}>Log Out</button>
//         </div>
//       </header>

//       <div className="dashboard-body">
//         <aside className="sidebar">
//           <h3>Enrolled Courses</h3>
//           <ul>
//             {courses.map(course => (
//               <li key={course.name}>
//                 <a href="#" onClick={(e) => {
//                   e.preventDefault();
//                   setSelectedCourse(course.name);
//                 }}>
//                   {course.name}
//                 </a>
//               </li>
//             ))}
//           </ul>
//         </aside>

//         <main className="main-content">
//         <h2>{selectedCourse ? `${selectedCourse} Scores` : 'Select a Course'}</h2>


//           {!selectedCourse ? (
//             <div className="course-grid">
//               {courses.map(course => (
//                 <div
//                   key={course.name}
//                   className="course-card"
//                   onClick={() => setSelectedCourse(course.name)}
//                 >
//                   <h1>{course.name}</h1>
//                   {/* <p><strong>{course.professor}</strong></p> */}
//                   {/* <p>{course.description}</p> */}
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <>
//               <div className="chart-wrapper">
//                 <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
//               </div>

//               <div className="upload-section">
//                 <label className="upload-btn">
//                   📄 Upload Excel Sheet for {selectedCourse}
//                   <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} hidden />
//                 </label>

//                 {loading && <p>Uploading...</p>}
//                 {error && <p className="error-message">{error}</p>}
//               </div>

//               {selectedData.stats && (
//                 <div className="stats-panel">
//                   <h4>Statistics</h4>
//                   <ul>
//                     <li>Average: {selectedData.stats.average}</li>
//                     <li>Minimum: {selectedData.stats.min}</li>
//                     <li>Maximum: {selectedData.stats.max}</li>
//                     <li>25th Percentile: {selectedData.stats["25th_percentile"]}</li>
//                     <li>Median: {selectedData.stats["50th_percentile"]}</li>
//                     <li>75th Percentile: {selectedData.stats["75th_percentile"]}</li>
//                   </ul>
//                 </div>
//               )}
//             </>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }







//working code

// import React, { useState, useEffect } from 'react';
// import { Line } from 'react-chartjs-2';
// import axios from 'axios';

// import {
//   Chart as ChartJS,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   Tooltip,
//   Legend
// } from 'chart.js';
// import { useNavigate } from 'react-router-dom';
// import './Dashboard_p.css';

// ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

// export default function Dashboard_p() {
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [courseData, setCourseData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [courses, setCourses] = useState([]);
//   const [userId, setUserId] = useState(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUserId = localStorage.getItem('user_id');
//     if (storedUserId) {
//       setUserId(storedUserId);
//     }

//     const storedCourses = localStorage.getItem('courses');
//     if (storedCourses) {
//       setCourses(JSON.parse(storedCourses));
//     } else {
//       const fetchCourses = async () => {
//         try {
//           const response = await fetch('http://localhost:5001/api/courses');
//           const data = await response.json();
//           setCourses(data);
//           localStorage.setItem('courses', JSON.stringify(data));
//         } catch (error) {
//           console.error('Error fetching courses:', error);
//         }
//       };
//       fetchCourses();
//     }
//   }, []);
//   const handleCreateCourse = async () => {
//     const courseName = prompt('Enter course name:');
//     if (!courseName) return;
  
//     const courseCode = Math.random().toString(36).substring(2, 8).toUpperCase(); // random 6-char code
//     const newCourse = {
//       name: courseName,
//       professor: 'You',
//       description: 'Newly created course',
//       code: courseCode
//     };
  
//     try {
//       const response = await fetch('http://localhost:5001/api/courses', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newCourse)
//       });
  
//       if (response.ok) {
//         const savedCourse = await response.json();
//         // Ensure that the newly created course is added to the state
//         setCourses(prev => [...prev, savedCourse]);
//         localStorage.setItem('courses', JSON.stringify([...courses, savedCourse])); // Store new course in localStorage
//         alert(`Course "${savedCourse.name}" created with code: ${savedCourse.code}`);
//       } else {
//         alert('Failed to create course.');
//       }
//     } catch (error) {
//       console.error('Error creating course:', error);
//       alert('Error creating course.');
//     }
//   };
  

//   const handleDeleteCourse = async (courseName) => {
//     try {
//       const response = await axios.delete(`http://localhost:5001/api/courses/${courseName}`);
//       setCourses(prevCourses => prevCourses.filter(course => course.name !== courseName));
//       if (selectedCourse === courseName) {
//         setSelectedCourse(null);
//         setCourseData({});
//       }
//     } catch (error) {
//       console.error('Failed to delete course:', error);
//       setError('Failed to delete course');
//     }
//   };

//   const handleExcelUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file || !selectedCourse) return;

//     setLoading(true);
//     setError(null);

//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('subject', selectedCourse);

//     try {
//       const response = await fetch('http://localhost:5001/upload', {
//         method: 'POST',
//         body: formData
//       });

//       const result = await response.json();

//       if (response.ok) {
//         alert(result.message);
//         setCourseData(prev => ({
//           ...prev,
//           [selectedCourse]: {
//             labels: result.labels,
//             scores: result.scores,
//             stats: result.statistics
//           }
//         }));
//       } else {
//         setError(result.error);
//       }
//     } catch (err) {
//       setError(`Error uploading file: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const selectedData = courseData[selectedCourse] || { labels: [], scores: [], stats: {} };

//   const chartData = {
//     labels: selectedData.labels,
//     datasets: [
//       {
//         label: 'Marks',
//         data: selectedData.scores,
//         borderColor: '#007BFF',
//         backgroundColor: 'rgba(0, 123, 255, 0.2)',
//         borderWidth: 2,
//         tension: 0.4
//       }
//     ]
//   };

//   return (
//     <div className="dashboard">
//       <header className="dashboard-header">
//         <h1>Professor Dashboard</h1>
//         <div className="header-buttons">
//           <button onClick={handleCreateCourse}>Create Class</button>
//           <button onClick={() => navigate('/login')}>Log Out</button>
//         </div>
//       </header>

//       <div className="dashboard-body">
//         <aside className="sidebar">
//           <h3>Enrolled Courses</h3>
//           <ul>
//             {courses.map(course => (
//               <li key={course.name}>
//                 <div className="course-list-item">
//                   <a href="#" onClick={(e) => {
//                     e.preventDefault();
//                     setSelectedCourse(course.name);
//                   }}>
//                     {course.name}
//                   </a>
//                   <button className="delete-btn" onClick={() => handleDeleteCourse(course.id)}>❌</button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </aside>

//         <main className="main-content">
//           <h2>{selectedCourse ? `${selectedCourse} Scores` : 'Select a Course'}</h2>

//           {!selectedCourse ? (
//             <div className="course-grid">
//               {courses.map(course => (
//                 <div
//                   key={course.name}
//                   className="course-card"
//                   onClick={() => setSelectedCourse(course.name)}
//                 >
//                   <h1>{course.name}</h1>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <>
//               <div className="chart-wrapper">
//                 <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
//               </div>

//               <div className="upload-section">
//                 <label className="upload-btn">
//                   📄 Upload Excel Sheet for {selectedCourse}
//                   <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} hidden />
//                 </label>

//                 {loading && <p>Uploading...</p>}
//                 {error && <p className="error-message">{error}</p>}
//               </div>

//               {selectedData.stats && (
//                 <div className="stats-panel">
//                   <h4>Statistics</h4>
//                   <ul>
//                     <li>Average: {selectedData.stats.average}</li>
//                     <li>Minimum: {selectedData.stats.min}</li>
//                     <li>Maximum: {selectedData.stats.max}</li>
//                     <li>25th Percentile: {selectedData.stats["25th_percentile"]}</li>
//                     <li>Median: {selectedData.stats["50th_percentile"]}</li>
//                     <li>75th Percentile: {selectedData.stats["75th_percentile"]}</li>
//                   </ul>
//                 </div>
//               )}
//             </>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }










import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
} from 'chart.js';
import { useNavigate } from 'react-router-dom';
import './Dashboard_p.css';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function Dashboard_p() {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courseData, setCourseData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [courses, setCourses] = useState([]);
    const [userId, setUserId] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showCreateCourse, setShowCreateCourse] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserId = localStorage.getItem('user_id');
        if (storedUserId) {
            setUserId(storedUserId);
            const fetchCourses = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/courses?professor_id=${storedUserId}`);
                    const data = await response.json();
                    setCourses(data);
                } catch (error) {
                    setError('Failed to fetch courses.');
                }
            };
            fetchCourses();
        }
    }, []);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleCreateCourse = async () => {
        if (!selectedFile) {
            setError('Please upload an Excel file.');
            return;
        }

        setLoading(true);
        setError(null);

        const courseName = document.getElementById('courseName').value;
        const professorId = parseInt(userId, 10);
        const formData = new FormData();
        formData.append('name', courseName);
        formData.append('professor_id', professorId);
        formData.append('file', selectedFile);

<<<<<<< HEAD
    try {
      const response = await fetch('http://localhost:5001/upload', {
        method: 'POST',
        body: formData
      });
=======
        try {
            const response = await fetch('http://localhost:5000/api/courses', {
                method: 'POST',
                body: formData,
            });
>>>>>>> 2a29e274376e2878185e36bf9ed2dd9a526fa61e

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                setCourses(prev => [...prev, { name: courseName, code: data.code, id: data.id }]);
                setSelectedCourse(null);
                setSelectedFile(null);
                setShowCreateCourse(false);
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError('Failed to create course.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCourse = async (courseId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
                setSelectedCourse(null);
                setCourseData({});
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to delete course');
            }
        } catch (error) {
            setError('Failed to delete course');
        }
    };

    const handleExcelUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !selectedCourse) return;

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const course = courses.find(c => c.name === selectedCourse);
            if (!course) {
                setError("Course not found");
                setLoading(false);
                return;
            }
            const response = await fetch(`http://localhost:5000/api/upload_scores/${course.id}`, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                setCourseData(prev => ({
                    ...prev,
                    [selectedCourse]: {
                        labels: result.labels,
                        scores: result.scores,
                        stats: result.statistics
                    }
                }));
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError(`Error uploading file: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const selectedData = courseData[selectedCourse] || { labels: [], scores: [], stats: {} };

    const chartData = {
        labels: selectedData.labels,
        datasets: [
            {
                label: 'Marks',
                data: selectedData.scores,
                borderColor: '#007BFF',
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                borderWidth: 2,
                tension: 0.4
            }
        ]
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Professor Dashboard</h1>
                <div className="header-buttons">
                    <button onClick={() => setShowCreateCourse(!showCreateCourse)}>
                        {showCreateCourse ? 'Cancel' : 'Create Class'}
                    </button>
                    <button onClick={() => navigate('/login')}>Log Out</button>
                </div>
            </header>

            <div className="dashboard-body">
                <aside className="sidebar">
                    <h3>Enrolled Courses</h3>
                    <ul>
                        {courses.map(course => (
                            <li key={course.name}>
                                <div className="course-list-item">
                                    <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedCourse(course.name);
                                    }}>
                                        {course.name}
                                    </a>
                                    <button className="delete-btn" onClick={() => handleDeleteCourse(course.id)}>❌</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </aside>

                <div className="main-layout">
                    <main className="main-content">
                        <h2>{selectedCourse ? `${selectedCourse} Scores` : 'Select a Course'}</h2>

                        {showCreateCourse && (
                            <div className="create-course-form">
                                <input type="text" id="courseName" placeholder="Course Name" />
                                <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
                                <button onClick={handleCreateCourse} disabled={loading}>
                                    {loading ? 'Creating...' : 'Create Course'}
                                </button>
                                {error && <p className="error-message">{error}</p>}
                            </div>
                        )}

                        {!selectedCourse ? (
                            <div className="course-grid">
                                {courses.map(course => (
                                    <div
                                        key={course.name}
                                        className="course-card"
                                        onClick={() => setSelectedCourse(course.name)}
                                    >
                                        <h1>{course.name}</h1>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                <div className="chart-wrapper">
                                    <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                                </div>

                                <div className="upload-section">
                                    <label className="upload-btn">
                                        📄 Upload Excel Sheet for {selectedCourse}
                                        <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} hidden />
                                    </label>
                                    {loading && <p>Uploading...</p>}
                                    {error && <p className="error-message">{error}</p>}
                                </div>

                                {selectedData.stats && (
                                    <div className="stats-panel">
                                        <h4>Statistics</h4>
                                        <ul>
                                            <li>Average: {selectedData.stats.average}</li>
                                            <li>Minimum: {selectedData.stats.min}</li>
                                            <li>Maximum: {selectedData.stats.max}</li>
                                            <li>25th Percentile: {selectedData.stats["25th_percentile"]}</li>
                                            <li>Median: {selectedData.stats["50th_percentile"]}</li>
                                            <li>75th Percentile: {selectedData.stats["75th_percentile"]}</li>
                                        </ul>
                                    </div>
                                )}
                            </>
                        )}
                    </main>

                    <aside className="right-sidebar">
                        <h3>Actions / Summary</h3>
                        <p>You can add recent uploads, graphs, links, or any quick info here.</p>
                    </aside>
                </div>
            </div>
        </div>
    );
}


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

<<<<<<< HEAD
              {selectedData.stats && (
                <div className="stats-panel">
                  <h4>Statistics</h4>
                  <ul>
                    <li>Average: {selectedData.stats.average}</li>
                    <li>Minimum: {selectedData.stats.min}</li>
                    <li>Maximum: {selectedData.stats.max}</li>
                    <li>25th Percentile: {selectedData.stats["25th_percentile"]}</li>
                    <li>Median: {selectedData.stats["50th_percentile"]}</li>
                    <li>75th Percentile: {selectedData.stats["75th_percentile"]}</li>
                  </ul>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
=======
// export default function Dashboard_p() {
//     const [userId, setUserId] = useState(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const storedUserId = localStorage.getItem('user_id');
//         console.log("Dashboard_p: useEffect - localStorage userId:", storedUserId);
//         if (storedUserId) {
//             setUserId(storedUserId);
//             console.log("Dashboard_p: useEffect - userId set to:", storedUserId);
//             console.log("Dashboard_p: useEffect - userId is now:", storedUserId); // Log immediately after setting
//         }
//     }, []);

//     const handleCreateCourse = () => {
//         console.log("Dashboard_p: handleCreateCourse - userId is:", userId);
//         console.log("Dashboard_p: localStorage user_id:", localStorage.getItem('user_id'));
//         const courseName = "Test Course";
//         const professorId = parseInt(userId, 10);

//         if (userId) {
//              alert(`Course "${courseName}" created with professor ID: ${professorId}`);
//         }
//         else{
//             alert("userId is null.  Cannot create course")
//         }

//     };

//     return (
//         <div className="dashboard">
//             <header className="dashboard-header">
//                 <h1>Professor Dashboard</h1>
//                 <div className="header-buttons">
//                     <button onClick={() => navigate('/login')}>Log Out</button>
//                 </div>
//             </header>
//             <div className="dashboard-body">
//                 <main className="main-content">
//                     <h2>Create Course</h2>
//                     <button onClick={handleCreateCourse}>Create Course</button>
//                      {userId && <p>User ID: {userId}</p>}
//                 </main>
//             </div>
//         </div>
//     );
// }
>>>>>>> 2a29e274376e2878185e36bf9ed2dd9a526fa61e
