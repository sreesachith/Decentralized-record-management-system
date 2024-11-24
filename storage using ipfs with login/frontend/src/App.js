import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import AdminFileList from './components/AdminFileList';
import Login from './components/Login';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if token and role exist in localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      setIsAuthenticated(true);
      setIsAdmin(role === 'admin'); // Set admin state based on role
    }
  }, []);

  const handleLogin = () => {
    const role = localStorage.getItem('role');
    setIsAuthenticated(true);
    setIsAdmin(role === 'admin'); // Check role after login
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    localStorage.removeItem('role'); // Remove the role from localStorage
    setIsAuthenticated(false); // Set authenticated state to false
    setIsAdmin(false); // Set admin state to false
  };

  return (
    <div className="container">
      <header style={headerStyles}>
        <h1 style={headingStyles}>File Management System</h1>
        {isAuthenticated && (
          <button onClick={handleLogout} style={logoutButtonStyles}>
            Logout
          </button>
        )}
      </header>
      {isAuthenticated ? (
        isAdmin ? (
          <AdminFileList /> // Show AdminFileList if the user is an admin
        ) : (
          <>
            <FileUpload />
            <FileList />
          </>
        )
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

// Styles for the header
const headerStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  borderRadius: '8px',
  marginBottom: '20px',
};

// Styles for the heading
const headingStyles = {
  fontSize: '2rem',
  margin: 0,
  fontFamily: "'Arial', sans-serif",
};

// Styles for the logout button
const logoutButtonStyles = {
  backgroundColor: '#fff',
  color: '#007bff',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: 'bold',
};

export default App;
