const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Title is required'],
    },
    count: {
        type: String,
        required: [true, 'Count value is required'],
    },
    icon: {
        type: String,
        default: 'Target',
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('ImpactCount', programSchema);
