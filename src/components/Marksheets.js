import React, { useState } from 'react';

const Marksheets = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [uploads, setUploads] = useState([]);

  const handleUpload = () => {
    if (!file || !name) return;

    const newUpload = {
      name,
      description,
      fileName: file.name,
      uploadedAt: new Date().toLocaleString(),
    };

    setUploads([...uploads, newUpload]);
    setFile(null);
    setName('');
    setDescription('');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Upload Marksheets</h2>
      <input type="file" accept=".xlsx" onChange={(e) => setFile(e.target.files[0])} />
      <input
        type="text"
        placeholder="Enter marksheet name (e.g., M1, Finals)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="block mt-2 border p-1"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="block mt-2 border p-1 w-96"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
      >
        Upload
      </button>

      <h3 className="text-xl mt-6 mb-2">Previous Uploads</h3>
      <ul>
        {uploads.map((u, idx) => (
          <li key={idx} className="border p-2 mb-2 rounded bg-gray-100">
            <strong>{u.name}</strong> - {u.description} <br />
            <em>Uploaded: {u.uploadedAt}</em>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Marksheets;
