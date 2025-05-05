import React, { useEffect, useState } from 'react';

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const userId = "student123"; // or "professor123" depending on login

  useEffect(() => {
    const allNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
    const userNotifications = allNotifications.filter(note => note.to === userId);
    setNotifications(userNotifications);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Your Notifications</h2>

      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul>
          {notifications.map((note, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>
              <strong>Type:</strong> {note.type}<br />
              <strong>Message:</strong> {note.message}<br />
              <small>{new Date(note.timestamp).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notification;
