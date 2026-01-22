const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Title is required'],
    },
    description: {
        type: String,
    },
    count: {
        type: String,
        required: [true, 'Count value is required'],
    },
    icon: {
        type: String,
        default: 'Target',
    },
    image: {
        type: String,
    },
    imagePublicId: {
        type: String,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('ImpactCount', programSchema);
