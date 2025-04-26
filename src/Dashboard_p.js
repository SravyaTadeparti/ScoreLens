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

  const navigate = useNavigate();

  const handleCreateCourse = () => {
    const courseName = prompt('Enter course name:');
    if (!courseName) return;
  
    const courseCode = Math.random().toString(36).substring(2, 8).toUpperCase(); // random 6-char code
    const newCourse = {
      name: courseName,
      professor: 'You', 
      description: 'Newly created course',
      code: courseCode
    };
  
    setCourses(prev => [...prev, newCourse]);
    alert(`Course "${courseName}" created with code: ${courseCode}`);
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
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  setSelectedCourse(course.name);
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
