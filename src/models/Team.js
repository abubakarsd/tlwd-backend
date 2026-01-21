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
        enum: ['Team', 'Board', 'Advisory'],
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
        email: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Team', teamSchema);
