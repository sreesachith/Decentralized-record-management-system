import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminFileList = () => {
  const [files, setFiles] = useState([]);

  // Fetch all files on component mount
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/files');
        setFiles(response.data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);

  const handleDelete = async (fileId) => {
    try {
      console.log(`Deleting file with ID: ${fileId}`); // Debug log
      const response = await axios.delete(`http://localhost:5000/api/admin/files/${fileId}`);
      setFiles(files.filter((file) => file._id !== fileId)); // Remove the file from the UI
      console.log(response.data.message); // Log success message
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f9f9f9',
        minHeight: '100vh',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Admin File List</h2>
      {files.length > 0 ? (
        <table
          style={{
            width: '100%',
            maxWidth: '800px',
            margin: '0 auto',
            borderCollapse: 'collapse',
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#007bff', color: '#fff' }}>
              <th
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  textAlign: 'left',
                }}
              >
                File Name
              </th>
              <th
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  textAlign: 'left',
                }}
              >
                Uploaded By
              </th>
              <th
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  textAlign: 'center',
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <a
                    href={`https://ipfs.io/ipfs/${file.cid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#007bff',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                    }}
                  >
                    {file.name}
                  </a>
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {file.username}
                </td>
                <td
                  style={{
                    padding: '10px',
                    border: '1px solid #ddd',
                    textAlign: 'center',
                  }}
                >
                  <button
                    onClick={() => handleDelete(file._id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#dc3545',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: 'center', color: '#777' }}>No files available.</p>
      )}
    </div>
  );
};

export default AdminFileList;
