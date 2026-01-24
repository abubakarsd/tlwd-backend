const mongoose = require('mongoose');

const prioritySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Priority name is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    icon: {
        type: String,
        required: [true, 'Icon is required'],
        default: 'Target',
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

module.exports = mongoose.model('Priority', prioritySchema);
