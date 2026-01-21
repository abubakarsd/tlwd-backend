const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    publicId: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['image', 'document', 'video'],
        default: 'image',
    },
    category: {
        type: String,
    },
    alt: {
        type: String,
    },
    size: {
        type: Number,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Media', mediaSchema);
