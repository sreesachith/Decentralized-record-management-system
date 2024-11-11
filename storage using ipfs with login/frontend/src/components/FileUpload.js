import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState(''); // Initialize as an empty string

  const onFileChange = e => {
    setFile(e.target.files[0]);
  };

  const onUsernameChange = (e) => {
    setUsername(e.target.value); // Use the correct value
  };

  const onFileUpload = () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('username', username); // Use the username from state

    axios.post('http://localhost:5000/api/upload', formData)
      .then(response => {
        console.log('File uploaded successfully:', response.data);
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
  };

  return (
    <div className="upload-form">
      <h2>Upload File</h2>
      <input type="text" placeholder="Enter your username" value={username} onChange={onUsernameChange} />
      <input type="file" onChange={onFileChange} />
      <button onClick={onFileUpload}>Upload</button>
    </div>
  );
}

export default FileUpload;
