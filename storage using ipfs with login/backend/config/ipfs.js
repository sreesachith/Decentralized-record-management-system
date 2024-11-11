const IPFS = require('ipfs-http-client');

// Configure IPFS client
const ipfs = IPFS.create({
    host: 'localhost',
    port: 5002,
    protocol: 'http'
});

module.exports = ipfs;


