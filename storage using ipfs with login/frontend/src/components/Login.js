import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and registration

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        console.log("usernameeee ", response.data.username);
        localStorage.setItem('username', response.data.username);
        onLogin(); // Notify parent
      } else {
        setError('Login failed, no token received.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid credentials or server error.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); // Reset any previous errors
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password,
      });

      // Optionally, log in the user after registration
      if (response.data.success) {
        setIsRegistering(false); // Switch back to login form
        setError('Registration successful! You can now log in.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f4f4f9',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
          {isRegistering ? 'Register' : 'Login'}
        </h2>
        <form
          onSubmit={isRegistering ? handleRegister : handleLogin}
          style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
        >
          {isRegistering && (
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
            </div>
          )}
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: '#007bff',
              color: '#fff',
              padding: '10px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {isRegistering ? 'Register' : 'Login'}
          </button>
          {error && (
            <p
              style={{
                color: 'red',
                fontSize: '14px',
                textAlign: 'center',
                marginTop: '10px',
              }}
            >
              {error}
            </p>
          )}
        </form>
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          style={{
            marginTop: '10px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#007bff',
            cursor: 'pointer',
            textAlign: 'center',
            display: 'block',
            width: '100%',
          }}
        >
          {isRegistering ? 'Already have an account? Login' : 'New user? Register'}
        </button>
      </div>
    </div>
  );
};

export default Login;
