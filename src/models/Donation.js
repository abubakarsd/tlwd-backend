const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    reference: {
        type: String,
        required: true,
        unique: true,
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
    },
    name: {
        type: String,
    },
    method: {
        type: String,
        enum: ['Card', 'Bank Transfer'],
        default: 'Card',
    },
    status: {
        type: String,
        enum: ['Successful', 'Failed', 'Pending'],
        default: 'Pending',
    },
    paystackData: {
        type: mongoose.Schema.Types.Mixed,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Donation', donationSchema);
