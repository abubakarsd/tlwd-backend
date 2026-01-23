const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
    },
    type: {
        type: String,
        enum: ['Team Member', 'Director', 'Board', 'Advisory', 'Team'], // Keeping 'Team' for backward compatibility if needed
        default: 'Team Member',
        required: [true, 'Type is required'],
    },
    image: {
        type: String,
    },
    imagePublicId: {
        type: String,
    },
    bio: {
        type: String,
    },
    socialLinks: {
        linkedin: String,
        twitter: String,
        instagram: String,
        facebook: String,
        email: String,
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Team', teamSchema);
