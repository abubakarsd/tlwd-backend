const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Resource name is required'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
    },
    file: {
        type: String,
        required: [true, 'File is required'],
    },
    filePublicId: {
        type: String,
    },
    fileType: {
        type: String,
    },
    fileSize: {
        type: Number,
    },
    downloads: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Resource', resourceSchema);
