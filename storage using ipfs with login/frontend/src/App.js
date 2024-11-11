// import React from 'react';
// import FileUpload from './components/FileUpload';
// import FileList from './components/FileList';


// function App() {
//   return (
//     <div className="container">
//       <header>
//         <h1>Document Management System</h1>
//       </header>
//       <FileUpload />
//       <FileList />
//     </div>
//   );
// }

// export default App;
import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import Login from './components/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if token exists in localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true); // If token exists, set authenticated to true
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true); // Set authenticated state to true after login
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    setIsAuthenticated(false); // Set authenticated state to false
  };

  return (
    <div className="container">
      <header>
        <h1>Document Management System</h1>
        {isAuthenticated && (
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        )}
      </header>
      {isAuthenticated ? (
        <>
          <FileUpload />
          <FileList />
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
