const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['Active', 'Unsubscribed'],
        default: 'Active',
    },
    source: {
        type: String,
        default: 'Website',
    },
    subscribedAt: {
        type: Date,
        default: Date.now,
    },
    unsubscribedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Subscriber', subscriberSchema);
