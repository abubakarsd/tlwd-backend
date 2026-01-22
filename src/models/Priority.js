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
        enum: ['active', 'inactive'],
        default: 'active',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Priority', prioritySchema);
