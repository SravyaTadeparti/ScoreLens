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
import * as XLSX from 'xlsx';
import './Dashboard.css';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const courses = [
  { name: 'Mathematics', professor: 'Dr. Smith', description: 'Advanced Algebra & Calculus' },
  { name: 'Physics', professor: 'Dr. Johnson', description: 'Quantum Mechanics & Thermodynamics' },
  { name: 'Computer Science', professor: 'Prof. Allen', description: 'Data Structures & Algorithms' }
];

export default function Dashboard() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [customScores, setCustomScores] = useState([]);
  const [labels, setLabels] = useState([]);
  const navigate = useNavigate();

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

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Student Dashboard</h1>
        <div className="header-buttons">
          <button onClick={() => alert('Feature to join a class will be implemented soon!')}>Join Class</button>
          <button onClick={() => {
            alert('Logging out...');
            navigate('/login');
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
                  setCustomScores([]); // reset previous scores
                  setLabels([]);        // reset previous labels
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
                  onClick={() => {
                    setSelectedCourse(course.name);
                    setCustomScores([]);
                    setLabels([]);
                  }}
                >
                  <h3>{course.name}</h3>
                  <p><strong>{course.professor}</strong></p>
                  <p>{course.description}</p>
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
            </>
          )}
        </main>
      </div>
    </div>
  );
}
