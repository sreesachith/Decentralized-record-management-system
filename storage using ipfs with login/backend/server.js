
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Import the auth routes
const fileRoutes = require('./routes/fileRoutes'); // Import the file routes
const User = require('./models/User'); // Ensure the path is correct

const app = express();
const PORT = process.env.PORT || 5000;
let gateway;
//HLF
const grpc = require('@grpc/grpc-js');
const { connect, signers } = require('@hyperledger/fabric-gateway');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const { TextDecoder } = require('util');

const channelName = envOrDefault('CHANNEL_NAME', 'mychannel');
const chaincodeName = envOrDefault('CHAINCODE_NAME', 'basic');
const mspId = envOrDefault('MSP_ID', 'rrMSP');

// Path to crypto materials.
const cryptoPath = envOrDefault('CRYPTO_PATH', path.resolve(__dirname, '..', '..', '..', 'HLF2.5-LOCAL', 'organizations', 'peerOrganizations', 'rr.isfcr.com'));

// Path to user private key directory.
const keyDirectoryPath = envOrDefault('KEY_DIRECTORY_PATH', path.resolve(cryptoPath, 'users', 'User1@rr.isfcr.com', 'msp', 'keystore'));

// Path to user certificate directory.
const certDirectoryPath = envOrDefault('CERT_DIRECTORY_PATH', path.resolve(cryptoPath, 'users', 'User1@rr.isfcr.com', 'msp', 'signcerts'));

// Path to peer tls certificate.
const tlsCertPath = envOrDefault('TLS_CERT_PATH', path.resolve(cryptoPath, 'peers', 'peer0.rr.isfcr.com', 'tls', 'ca.crt'));

// Gateway peer endpoint.
const peerEndpoint = envOrDefault('PEER_ENDPOINT', 'localhost:7051');

// Gateway peer SSL host name override.
const peerHostAlias = envOrDefault('PEER_HOST_ALIAS', 'peer0.rr.isfcr.com');

const utf8Decoder = new TextDecoder();
const assetId = `asset${Date.now()}`;

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

async function seedAdmin() {
  const adminExists = await User.findOne({ email: 'admin@gmail.com' });
  if (!adminExists) {
    const admin = new User({
      username: 'Admin',
      email: 'admin@gmail.com',
      password: 'admin', // Do not store plaintext passwords in production
      role: 'admin',
    });
    await admin.save();
    console.log('Admin user created.');
  }
}

seedAdmin();
async function main() {
    await displayInputParameters();

    // The gRPC client connection should be shared by all Gateway connections to this endpoint.
    const client = await newGrpcConnection();

    const gateway = connect({
        client,
        identity: await newIdentity(),
        signer: await newSigner(),
        // Default timeouts for different gRPC calls
        evaluateOptions: () => ({ deadline: Date.now() + 5000 }), // 5 seconds
        endorseOptions: () => ({ deadline: Date.now() + 15000 }), // 15 seconds
        submitOptions: () => ({ deadline: Date.now() + 5000 }), // 5 seconds
        commitStatusOptions: () => ({ deadline: Date.now() + 60000 }), // 1 minute
    });

    try {
        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);

        //await initLedger(contract);
        console.log('*** Ledger initialization successful.');
    } catch (error) {
        // Handle errors without closing the gateway
        console.error('An error occurred during ledger initialization:', error);

        // Optional: Retry logic or different actions based on the error type
        if (error.message.includes('connection')) {
            console.log('This seems to be a connection error. Retrying...');
            // Add retry logic here if needed
        } else {
            console.error('Unhandled error:', error);
        }
    } finally {
        // You can keep the gateway open or perform other cleanup here if needed
        console.log('*** Main function execution complete.');
    }
}

main().catch(error => {
    console.error('******** FAILED to run the application:', error);
    process.exitCode = 1;
});

async function newGrpcConnection() {
    const tlsRootCert = await fs.readFile(tlsCertPath);
    const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
    return new grpc.Client(peerEndpoint, tlsCredentials, {
        'grpc.ssl_target_name_override': peerHostAlias,
    });
}

async function newIdentity() {
    const certPath = await getFirstDirFileName(certDirectoryPath);
    const credentials = await fs.readFile(certPath);
    return { mspId, credentials };
}

async function getFirstDirFileName(dirPath) {
    const files = await fs.readdir(dirPath);
    return path.join(dirPath, files[0]);
}

async function newSigner() {
    const keyPath = await getFirstDirFileName(keyDirectoryPath);
    const privateKeyPem = await fs.readFile(keyPath);
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return signers.newPrivateKeySigner(privateKey);
}

async function initLedger(contract) {
    console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');

    await contract.submitTransaction('InitLedger');

    console.log('*** Transaction committed successfully');
}


//CreateAsset(ctx contractapi.TransactionContextInterface, assetID string, size int, owner string, name string, content string)

async function createAsset(assetID , size , owner , name , content ) {
   
        if (!gateway) {
            throw new Error('Gateway not initialized');
        }

    const network = gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);
    console.log('\n--> Submit Transaction: CreateAsset, creates new asset with metadata arguments');

    await contract.submitTransaction(
        'CreateAsset',
        assetID,
        size,
        owner,
        name,
        content
    );
    
    console.log('*** Transaction committed successfully');

}
module.exports = { createAsset };


function envOrDefault(key, defaultValue) {
    return process.env[key] || defaultValue;
}

async function displayInputParameters() {
    console.log(`channelName:       ${channelName}`);
    console.log(`chaincodeName:     ${chaincodeName}`);
    console.log(`mspId:             ${mspId}`);
    console.log(`cryptoPath:        ${cryptoPath}`);
    console.log(`keyDirectoryPath:  ${keyDirectoryPath}`);
    console.log(`certDirectoryPath: ${certDirectoryPath}`);
    console.log(`tlsCertPath:       ${tlsCertPath}`);
    console.log(`peerEndpoint:      ${peerEndpoint}`);
    console.log(`peerHostAlias:     ${peerHostAlias}`);
}
