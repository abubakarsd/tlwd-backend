const mongoose = require('mongoose');

const impactStorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Project name is required'],
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
    },
    year: {
        type: Number,
        required: [true, 'Year is required'],
    },
    outcome: {
        type: String,
        required: [true, 'Outcome is required'],
    },
    image: {
        type: String,
        required: [true, 'Cover image is required'],
    },
    imagePublicId: {
        type: String,
    },
    description: {
        type: String,
    },
    gallery: [{
        url: String,
        publicId: String,
    }],
    status: {
        type: String,
        enum: ['published', 'draft'],
        default: 'published',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('ImpactStory', impactStorySchema);
