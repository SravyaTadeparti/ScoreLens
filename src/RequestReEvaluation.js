import React, { useState } from 'react';

function RequestReEvaluation() {
  const [message, setMessage] = useState('');
  const studentId = "student123"; // testing

  const handleRequest = () => {
    if (!message.trim()) {
      alert("Please write a message for re-evaluation.");
      return;
    }

    const newNotification = {
      type: "Re-Evaluation Request",
      from: studentId,
      message: message,
      timestamp: new Date().toISOString(),
      to: "professor123", // send to professor
    };

    const existing = JSON.parse(localStorage.getItem('notifications')) || [];
    existing.push(newNotification);
    localStorage.setItem('notifications', JSON.stringify(existing));

    alert('Re-evaluation request sent to Professor!');
    setMessage('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Request Re-Evaluation</h2>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your reason for re-evaluation..."
        rows={4}
        cols={50}
      />
      <br />
      <button onClick={handleRequest} style={{ marginTop: '10px' }}>
        Send Re-Evaluation Request
      </button>
    </div>
  );
}

export default RequestReEvaluation;
