import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FileList() {
  const [username, setUsername] = useState('');
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');

  const onUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const fetchFiles = async () => {
    if (!username) {
      setMessage('Please enter a username.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/files/${username}`); // Update API call to include username
      setFiles(response.data.files);
      setMessage(''); // Clear message on successful fetch
    } catch (error) {
      setMessage('Error fetching files. Please check the username and try again.');
      console.error('Error fetching files:', error);
    }
  };

  return (
    <div className="file-list">
      <h2>Uploaded Files</h2>
      <input
        type="text"
        placeholder="Enter Username"
        value={username}
        onChange={onUsernameChange}
      />
      <button onClick={fetchFiles}>Fetch Files</button>

      {message && <p>{message}</p>} {/* Display messages to the user */}

      {files.length > 0 && (
        <ul>
          {files.map(file => (
            <li key={file._id}>
              <a href={`https://ipfs.io/ipfs/${file.cid}`} target="_blank" rel="noopener noreferrer">
                {file.name}
              </a> ({file.size} bytes)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FileList;
