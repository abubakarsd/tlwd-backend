const mongoose = require('mongoose');

const valueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Value title is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    icon: {
        type: String,
        required: [true, 'Icon is required'],
        default: 'Star',
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
        set: (v) => v ? v.charAt(0).toUpperCase() + v.slice(1).toLowerCase() : 'Active'
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Value', valueSchema);
