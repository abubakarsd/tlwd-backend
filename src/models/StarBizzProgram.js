const mongoose = require('mongoose');

const starBizzProgramSchema = new mongoose.Schema({
    header: {
        type: String,
        required: [true, 'Header is required'],
    },
    body: {
        type: String,
        required: [true, 'Body text is required'],
    },
    badge: {
        type: String,
        required: [true, 'Badge text is required'],
    },
    icon: {
        type: String,
        default: 'Leaf',
    },
    color: {
        type: String,
        default: 'green', // for the accent color (bg-green-600 etc)
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('StarBizzProgram', starBizzProgramSchema);
