const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    opportunityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Opportunity',
        required: true,
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
    },
    phone: {
        type: String,
    },
    cv: {
        type: String,
    },
    cvPublicId: {
        type: String,
    },
    coverLetter: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Pending', 'Shortlisted', 'Rejected'],
        default: 'Pending',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Application', applicationSchema);
