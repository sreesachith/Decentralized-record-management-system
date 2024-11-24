const ipfs = require('../config/ipfs'); 
const File = require('../models/File');
const { Readable } = require('stream');
const { createAsset } = require('../server'); // Correct path to server.js
const server = require('../server');

console.log('createAsset:', createAsset);
exports.uploadFile = async (req, res) => {
    try {
        const file = req.file; // Get the uploaded file
        const username = req.body.username; // Get the username from the request body

        // Check if file and username are provided
        if (!file || !username) {
            return res.status(400).json({ error: 'File and username are required' });
        }

        // Convert the file buffer to a stream
        const fileStream = Readable.from(file.buffer);
        const result = await ipfs.add(fileStream); // Upload file to IPFS

        // Create a new file document
        const newFile = new File({
            cid: result.path,
            name: file.originalname,
            size: file.size,
            username: username // Use the username from the request body
        });

        await newFile.save(); // Save the file document to MongoDB
        
        const assetID = `asset-${Date.now()}`; // Generate a unique asset ID
        const size = file.size.toString(); // Use file size as size
        const owner = username; // Use the username as the owner
        const name = file.originalname.toString();
        const content = 'hello'; // Example value, modify as needed

        // Call createAsset with necessary parameters
        await createAsset(assetID , size , owner , name , content );
        console.log('Asset created on blockchain successfully!');

        res.status(200).json({ 
            cid: result.path,
            name: file.originalname,
            size: file.size,
            username: username // Return the username in the response
        });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ error: 'File upload failed', details: error.message });
    }
};

exports.getFiles = async (req, res) => {
    try {
        const files = await File.find();
        res.json(files);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching files' });
    }
};
exports.getFilesByUsername = async (req, res) => {
    try {
        const { username } = req.params; // Get the username from the request parameters
        const files = await File.find({ username });
        if (files.length === 0) {
            return res.status(404).json({ success: false, message: 'No files found for this user' });
        }
        res.json({ success: true, files });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching files' });
    }
};
exports.getAllFiles = async (req, res) => {
    try {
      const files = await File.find(); // Fetch all files
      res.status(200).json(files);
    } catch (error) {
      console.error('Error fetching files:', error);
      res.status(500).json({ message: 'Server error fetching files' });
    }
};
