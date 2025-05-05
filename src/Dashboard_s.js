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
// import * as XLSX from 'xlsx';
// import './Dashboard_s.css';

// ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

// const courses = [
//   { name: 'Mathematics', professor: 'Dr. Smith', description: 'Advanced Algebra & Calculus' },
//   { name: 'Physics', professor: 'Dr. Johnson', description: 'Quantum Mechanics & Thermodynamics' },
//   { name: 'Computer Science', professor: 'Prof. Allen', description: 'Data Structures & Algorithms' }
// ];

// export default function Dashboard_s() {
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [customScores, setCustomScores] = useState([]);
//   const [labels, setLabels] = useState([]);
//   const navigate = useNavigate();

//   const defaultScores = {
//     Mathematics: [78, 85, 90, 72, 88, 95],
//     Physics: [82, 75, 89, 91, 77, 84],
//     'Computer Science': [92, 88, 94, 97, 85, 90]
//   };

//   const chartData = {
//     labels: labels.length > 0 ? labels : ['Test 1', 'Test 2', 'Test 3', 'Test 4', 'Test 5', 'Test 6'],
//     datasets: [
//       {
//         label: 'Scores',
//         data: customScores.length > 0 ? customScores : (selectedCourse ? defaultScores[selectedCourse] : []),
//         borderColor: '#007BFF',
//         backgroundColor: 'rgba(0, 123, 255, 0.2)',
//         borderWidth: 2,
//         tension: 0.3
//       }
//     ]
//   };

//   const handleExcelUpload = (e) => {
//     const file = e.target.files[0];
//     if (file && selectedCourse) {
//       const reader = new FileReader();
//       reader.onload = (evt) => {
//         const data = new Uint8Array(evt.target.result);
//         const workbook = XLSX.read(data, { type: 'array' });
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];
//         const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

//         const headings = json[0];
//         const values = json[1];

//         if (Array.isArray(headings) && Array.isArray(values)) {
//           setLabels(headings);
//           setCustomScores(values.map(val => Number(val)));
//         }
//       };
//       reader.readAsArrayBuffer(file);
//     }
//   };

//   return (
//     <div className="dashboard">
//       <header className="dashboard-header">
//         <h1>Student Dashboard</h1>
//         <div className="header-buttons">
//           <button onClick={() => alert('Feature to create a class will be implemented soon!')}>Join Class</button>
//           <button onClick={() => {
//             alert('Logging out...');
//             navigate('/login');
//           }}>Log Out</button>
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
//                   setCustomScores([]); 
//                   setLabels([]);        
//                 }}>
//                   {course.name}
//                 </a>
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
//                   onClick={() => {
//                     setSelectedCourse(course.name);
//                     setCustomScores([]);
//                     setLabels([]);
//                   }}
//                 >
//                   <h3>{course.name}</h3>
//                   <p><strong>{course.professor}</strong></p>
//                   <p>{course.description}</p>
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
//               </div>
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
import * as XLSX from 'xlsx';
import './Dashboard_s.css';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);


export default function Dashboard_s() {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [customScores, setCustomScores] = useState([]);
    const [labels, setLabels] = useState([]);
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);  // State to store fetched courses
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userEmail, setUserEmail] = useState(null); //state to store email
    const [stats, setStats] = useState(null);

    const[courseId, setcourseId] = useState(null);
    const [chartData_s, setChartData_s] = useState(null);

    useEffect(() => {

       

        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setUserEmail(storedEmail);
        }

        const fetchCourses = async () => {
            if (!storedEmail) {
                setError("Email not found in local storage. Please log in again.");
                setLoading(false);
                return;
            }
            try {
                const response = await fetch(`http://localhost:5000/api/courses?student_email=${storedEmail}`); //change api where marks is shown in the response to display in the chart
                if (!response.ok) {
                    throw new Error(`Failed to fetch courses: ${response.status}`);
                }
                const data = await response.json();
                setCourses(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (storedEmail) {
            fetchCourses();
        }
    }, [userEmail] , [courseId]);

    const defaultScores = {
        Mathematics: [78, 85, 90, 72, 88, 95],
        Physics: [82, 75, 89, 91, 77, 84],
        'Computer Science': [92, 88, 94, 97, 85, 90]
    };

    const chartData = {
        labels: labels.length > 0 ? labels : ['Test 1', 'Test 2', 'Test 3', 'Test 4', 'Test 5', 'Test 6'],
        datasets: [
            {
                label: 'Scores',
                data: customScores.length > 0 ? customScores : (selectedCourse ? defaultScores[selectedCourse] : []),
                borderColor: '#007BFF',
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                borderWidth: 2,
                tension: 0.3
            }
        ]
    };

    const handleExcelUpload = (e) => {
        const file = e.target.files[0];
        if (file && selectedCourse) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                const data = new Uint8Array(evt.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                const headings = json[0];
                const values = json[1];

                if (Array.isArray(headings) && Array.isArray(values)) {
                    setLabels(headings);
                    setCustomScores(values.map(val => Number(val)));
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };

    if (loading) {
        return <div>Loading courses...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // dashboard_p starts
    // const fetchScores = async (courseId) => {
    //     const email = localStorage.getItem("email"); // or however you're storing it
    //         alert("email "+email);
    //     try {
    //       const response = await fetch(`http://localhost:5000/api/courses?student_email=${email}`);
    //       const data = await response.json();
      
    //       if (response.ok) {
    //         alert("response "+ toString(response));
    //         setChartData_s({
    //           labels: data.labels,
    //           datasets: [{
    //             label: 'Marks',
    //             data: data.scores,
    //             borderColor: '#007BFF',
    //             backgroundColor: 'rgba(0, 123, 255, 0.2)',
    //             borderWidth: 2,
    //             tension: 0.4
    //           }]
    //         });
      
    //         setStats(data.statistics);
    //       } else {
    //         console.error("Failed to fetch scores", data.error);
    //       }
    //     } catch (error) {
    //       console.error("Error fetching scores:", error);
    //     }
    //   };
      
    const fetchScores = async () => {
        const email = localStorage.getItem("email"); // Or however you get the student email
        try {
            const res = await fetch(`http://localhost:5000/api/courses?student_email=${email}`);
            const data = await res.json();
            console.log("Fetched student courses:", data);
            setCourses(data); // Make sure this line exists
        } catch (err) {
            console.error("Failed to fetch student courses", err);
        }
    };

    
    
    //dashboard_p end 

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Student Dashboard</h1>
                <div className="header-buttons">
                    <button onClick={() => navigate('/login')}>Log Out</button>
                </div>
            </header>

            <div className="dashboard-body">
                <aside className="sidebar">
                    <h3>Enrolled Courses</h3>
                    <ul>
                        {courses.map(course => (
                            <li key={course.id}>
                                <a href="#" onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedCourse(course.name);
                                    setCustomScores([]);
                                    setLabels([]);
                                }}>
                                    {course.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </aside>

                <main className="main-content">
                    <h2>{selectedCourse ? `${selectedCourse} Scores` : 'Select a Course'}</h2>

                    {!selectedCourse ? (
                        <div className="course-grid">
                            {courses.map(course => (
                                <div
                                    key={course.id}
                                    className="course-card"
                                    onClick={() => {
                                        setSelectedCourse(course.name);
                                        setCustomScores([]);
                                        setLabels([]);
                                    }}
                                >
                                    <h3>{course.name}</h3>
                                    <p>Course Code: {course.code}</p>
                                    <p>Professor ID: {course.professor_id}</p>
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
                            </div>
                            <div>
                                <p>
                                {courses.map(course => (
    <button key={course.id} onClick={() => fetchScores('893662B0')}>
        {course.name}

    </button>
    
    
))}{chartData && (
    <div>
        <Line data={chartData} />
    </div>
)}

{stats && (
    <ul>
        <li>Average: {stats.average}</li>
        <li>Min: {stats.min}</li>
        <li>Max: {stats.max}</li>
        <li>P25: {stats["25th_percentile"]}</li>
        <li>Median: {stats["50th_percentile"]}</li>
        <li>P75: {stats["75th_percentile"]}</li>
    </ul>
)}


                                </p>
                            </div>
                        </>
                    )}
                    
                </main>
            </div>
        </div>
    );
}
