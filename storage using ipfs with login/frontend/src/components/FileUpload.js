import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const onFileUpload = () => {
    if (!file) {
      setMessage('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    const storedusername = localStorage.getItem("username");
    if (storedusername){
      console.log("nostored username");
    }
    else {
      console.log("got username ", username);
    }

    formData.append('username', storedusername);

    setMessage(''); // Reset message before making the request

    axios.post('http://localhost:5000/api/upload', formData)
      .then((response) => {
        console.log('File uploaded successfully:', response.data);
        setMessage('File uploaded successfully!');
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
        setMessage('Error uploading file. Please try again.');
      });
  };

  return (
    <div
      style={{
        maxWidth: '500px',
        margin: '20px auto',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Upload File</h2>
      <div style={{ marginBottom: '15px' }}>
        <input
          type="file"
          onChange={onFileChange}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        />
      </div>
      <button
        onClick={onFileUpload}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Upload
      </button>

      {/* Display the message below the button */}
      {message && (
        <div
          style={{
            marginTop: '15px',
            padding: '10px',
            backgroundColor: message.includes('success') ? '#28a745' : '#dc3545',
            color: '#fff',
            borderRadius: '4px',
            textAlign: 'center',
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
