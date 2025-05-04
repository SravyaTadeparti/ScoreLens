import React from 'react';
import './RightSidebar.css'; // Create this CSS file for styling

const RightSidebar = ({ marksheets, onUpload, onSelect }) => {
  return (
    <div className="right-sidebar">
      <h2>Marksheets</h2>
      <button onClick={onUpload}>Upload Marksheet</button>
      <ul>
        {marksheets.map((sheet, index) => (
          <li key={index} onClick={() => onSelect(sheet)}>
            {sheet.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RightSidebar;
