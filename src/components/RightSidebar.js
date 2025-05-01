import React from 'react';
import './RightSidebar.css'; // Import the CSS file

const RightSidebar = () => {
  return (
    <div className="right-sidebar">
      <h2>Dashboard</h2>
      <ul>
        <li><a href="#">Link 1</a></li>
        <li><a href="#">Link 2</a></li>
        <li><a href="#">Link 3</a></li>
        <li><a href="#">Link 4</a></li>
      </ul>
    </div>
  );
};

export default RightSidebar;
