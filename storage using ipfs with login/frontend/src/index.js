

import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom
import App from './App';
import './index.css';

// Get the root element from your HTML
const container = document.getElementById('root');

// Use createRoot instead of ReactDOM.render
const root = createRoot(container); 

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
