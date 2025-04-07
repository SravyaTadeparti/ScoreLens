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
import './Dashboard.css';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const courses = [
  { name: 'Mathematics', professor: 'Dr. Smith', description: 'Advanced Algebra & Calculus' },
  { name: 'Physics', professor: 'Dr. Johnson', description: 'Quantum Mechanics & Thermodynamics' },
  { name: 'Computer Science', professor: 'Prof. Allen', description: 'Data Structures & Algorithms' }
];

const scoreData = {
  Mathematics: [78, 85, 90, 72, 88, 95],
  Physics: [82, 75, 89, 91, 77, 84],
  'Computer Science': [92, 88, 94, 97, 85, 90]
};

export default function Dashboard() {
  const [selectedCourse, setSelectedCourse] = useState(null);

  const chartData = {
    labels: ['Test 1', 'Test 2', 'Test 3', 'Test 4', 'Test 5', 'Test 6'],
    datasets: [
      {
        label: 'Scores',
        data: selectedCourse ? scoreData[selectedCourse] : [],
        borderColor: '#007BFF',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        borderWidth: 2,
        tension: 0.3
      }
    ]
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Student Dashboard</h1>
        <div className="header-buttons">
          <button onClick={() => alert('Feature to join a class will be implemented soon!')}>Join Class</button>
          <button onClick={() => {
            alert('Logging out...');
            window.location.href = 'Login.html';
          }}>Log Out</button>
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
                  <h3>{course.name}</h3>
                  <p><strong>{course.professor}</strong></p>
                  <p>{course.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="chart-wrapper">
              <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
