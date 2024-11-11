
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Import the auth routes
const fileRoutes = require('./routes/fileRoutes'); // Import the file routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS for all requests

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/using-ipfs', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Use authentication routes
app.use('/api/auth', authRoutes); // Authentication routes

// File handling routes (no auth middleware, public access for file upload and retrieval)
app.use('/api', fileRoutes); // File upload and retrieval routes

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
