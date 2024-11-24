const ipfs = require('../config/ipfs'); 
const File = require('../models/File');
const { Readable } = require('stream');

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


const grpc = require('@grpc/grpc-js');
const { connect, signers } = require('@hyperledger/fabric-gateway');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const { TextDecoder } = require('util');

const channelName = 'mychannel'; // Replace with your channel name
const chaincodeName = 'basic'; // Replace with your chaincode name
const mspId = 'rrMSP'; // Replace with your organization's MSP ID

// Paths to crypto materials
const cryptoPath = path.resolve(__dirname, 'path-to-crypto-materials'); // Update with your crypto path
const keyDirectoryPath = path.resolve(cryptoPath, 'users', 'User1@rr.isfcr.com', 'msp', 'keystore');
const certDirectoryPath = path.resolve(cryptoPath, 'users', 'User1@rr.isfcr.com', 'msp', 'signcerts');
const tlsCertPath = path.resolve(cryptoPath, 'peers', 'peer0.rr.isfcr.com', 'tls', 'ca.crt');
const peerEndpoint = 'localhost:7051'; // Replace with your peer endpoint
const peerHostAlias = 'peer0.rr.isfcr.com'; // Replace with your peer host alias

const utf8Decoder = new TextDecoder();

async function createAsset(assetID, size, owner, name, content) {
    const client = await newGrpcConnection();
    const gateway = connect({
        client,
        identity: await newIdentity(),
        signer: await newSigner(),
    });

    try {
        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);

        console.log(`\n--> Submit Transaction: CreateAsset`);
        await contract.submitTransaction('CreateAsset', assetID, size, owner, name, content);
        console.log(`*** Asset ${assetID} created successfully`);
    } catch (error) {
        console.error('Error creating asset:', error);
    } finally {
        gateway.close();
    }
}

async function newGrpcConnection() {
    const tlsRootCert = await fs.readFile(tlsCertPath);
    const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
    return new grpc.Client(peerEndpoint, tlsCredentials, {
        'grpc.ssl_target_name_override': peerHostAlias,
    });
}

async function newIdentity() {
    const certPath = (await fs.readdir(certDirectoryPath)).find(file => file.endsWith('.pem'));
    const credentials = await fs.readFile(path.join(certDirectoryPath, certPath));
    return { mspId, credentials };
}

async function newSigner() {
    const keyPath = (await fs.readdir(keyDirectoryPath)).find(file => file.endsWith('_sk'));
    const privateKeyPem = await fs.readFile(path.join(keyDirectoryPath, keyPath));
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return signers.newPrivateKeySigner(privateKey);
}



