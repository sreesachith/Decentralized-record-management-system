
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
    setError(''); // Reset any previous errors
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      // Check if the token is received
      if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Store the token in localStorage
        onLogin(); // Notify parent component of successful login
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
    <div className="login-container">
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>
      <form onSubmit={isRegistering ? handleRegister : handleLogin}>
        {isRegistering && (
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        )}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
        {error && <p className="error">{error}</p>} {/* Display error message */}
      </form>
      <button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? 'Already have an account? Login' : 'New user? Register'}
      </button>
    </div>
  );
};

export default Login;
