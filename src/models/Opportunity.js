const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    type: {
        type: String,
        enum: ['Job', 'Volunteer'],
        required: [true, 'Type is required'],
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
    },
    deadline: {
        type: Date,
        required: [true, 'Deadline is required'],
    },
    status: {
        type: String,
        enum: ['Open', 'Closed'],
        default: 'Open',
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    requirements: [{
        type: String,
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Opportunity', opportunitySchema);
