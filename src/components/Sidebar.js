import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-blue-200 h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Course Sections</h2>
      <ul className="space-y-3">
        <li><Link to="/marksheets" className="hover:underline">Marksheets</Link></li>
        <li><Link to="/individual-scores" className="hover:underline">Individual Scores</Link></li>
        <li><Link to="/ranks" className="hover:underline">Ranks</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;

