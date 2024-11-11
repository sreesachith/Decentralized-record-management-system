const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    cid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    username: {
      type: String,
      required: true
  },
}, {
    timestamps: true // This will add `createdAt` and `updatedAt` timestamps
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
