import React, { useState } from 'react';
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

// const courses = [
//   { name: 'Mathematics', professor: 'Dr. Smith', description: 'Advanced Algebra & Calculus' },
//   { name: 'Physics', professor: 'Dr. Johnson', description: 'Quantum Mechanics & Thermodynamics' },
//   { name: 'Computer Science', professor: 'Prof. Allen', description: 'Data Structures & Algorithms' }
// ];




export default function Dashboard_p() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseData, setCourseData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const storedCourses = localStorage.getItem('courses');
    
    if (storedCourses) {
      // If courses are already stored in localStorage, load them
      setCourses(JSON.parse(storedCourses));
    } else {
      // Otherwise, fetch the courses from the backend
      const fetchCourses = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/courses');
          const data = await response.json();
          
          setCourses(data); // Store fetched courses into state
          localStorage.setItem('courses', JSON.stringify(data)); // Save to localStorage for persistence
        } catch (error) {
          console.error('Error fetching courses:', error);
        }
      };
      
      fetchCourses(); // Fetch courses from backend if not in localStorage
    }
  }, []); // [] ensures this effect runs only once when the component mounts
  

  const navigate = useNavigate();

  const handleCreateCourse = async () => {
    const courseName = prompt('Enter course name:');
    if (!courseName) return;
  
    const courseCode = Math.random().toString(36).substring(2, 8).toUpperCase(); // random 6-char code
    const newCourse = {
      name: courseName,
      professor: 'You',
      description: 'Newly created course',
      code: courseCode
    };
  
    try {
      const response = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse)
      });
  
      if (response.ok) {
        const savedCourse = await response.json();
        setCourses(prev => [...prev, savedCourse]);
        alert(`Course "${savedCourse.name}" created with code: ${savedCourse.code}`);
      } else {
        alert('Failed to create course.');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Error creating course.');
    }
  };

  const handleDeleteCourse = async (courseName) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/courses/${courseName}`);
      setCourses(prevCourses => prevCourses.filter(course => course.name !== courseName));
      if (selectedCourse === courseName) {
        setSelectedCourse(null);
        setCourseData({});
      }
    } catch (error) {
      console.error('Failed to delete course:', error);
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
    formData.append('subject', selectedCourse);

    try {
      const response = await fetch('http://localhost:5001/upload', {
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
          {/* <button onClick={() => alert('Create Class feature coming soon!')}>Create Class</button> */}
          <button onClick={handleCreateCourse}>Create Class</button>

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

        <main className="main-content">
        <h2>{selectedCourse ? `${selectedCourse} Scores` : 'Select a Course'}</h2>


          {!selectedCourse ? (
            <div className="course-grid">
              {courses.map(course => (
                <div
                  key={course.name}
                  className="course-card"
                  onClick={() => setSelectedCourse(course.name)}
                >
                  <h1>{course.name}</h1>
                  {/* <p><strong>{course.professor}</strong></p> */}
                  {/* <p>{course.description}</p> */}
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
      </div>
    </div>
  );
}
