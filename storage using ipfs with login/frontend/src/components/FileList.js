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
      const response = await axios.get(`http://localhost:5000/api/files/${username}`);
      setFiles(response.data.files);
      setMessage(''); // Clear message on successful fetch
    } catch (error) {
      setMessage('Error fetching files. Please check the username and try again.');
      console.error('Error fetching files:', error);
    }
  };

  return (
    <div className="file-list" style={styles.container}>
      <h2>Uploaded Files</h2>
      <input
        type="text"
        placeholder="Enter Username"
        value={username}
        onChange={onUsernameChange}
        style={styles.input}
      />
      <button onClick={fetchFiles} style={styles.button}>Fetch Files</button>

      {message && <p>{message}</p>} {/* Display messages to the user */}

      {files.length > 0 && (
        <ul style={styles.fileList}>
          {files.map((file) => (
            <li key={file._id} style={styles.fileItem}>
              <a
                href={`https://ipfs.io/ipfs/${file.cid}`}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.fileLink}
              >
                {file.name}
              </a> 
              ({file.size} bytes)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Inline styles to match the FileUpload box style
const styles = {
  container: {
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '20px',
    width: '100%',
    maxWidth: '600px',
    margin: '20px auto',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  fileList: {
    listStyleType: 'none',
    padding: '0',
  },
  fileItem: {
    margin: '10px 0',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  fileLink: {
    color: '#007BFF',
    textDecoration: 'none',
  }
};

export default FileList;
