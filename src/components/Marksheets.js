import React, { useState } from 'react';

function Marksheets() {
  const [uploads, setUploads] = useState([]);
  const [file, setFile] = useState(null);
  const [testName, setTestName] = useState('');

  const handleUpload = () => {
    if (!file || !testName) return alert("Please select a file and enter a test name.");
    
    const newUpload = { name: testName, fileName: file.name };
    setUploads([...uploads, newUpload]);
    setFile(null);
    setTestName('');
  };

  return (
    <div>
      <h2>Upload Marksheets</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <input
        type="text"
        placeholder="Enter test name (e.g. M1)"
        value={testName}
        onChange={(e) => setTestName(e.target.value)}
      />
      <button onClick={handleUpload}>Upload</button>

      <h3>Uploaded Marksheets:</h3>
      <ul>
        {uploads.map((upload, idx) => (
          <li key={idx}>
            📄 <strong>{upload.name}</strong> - {upload.fileName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Marksheets;
