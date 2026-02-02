const mongoose = require('mongoose');

const starBizzPartnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Partner name is required'],
    },
    website: {
        type: String,
    },
    tier: {
        type: String,
        enum: ['Gold', 'Silver', 'Bronze'],
        default: 'Bronze',
    },
    logo: {
        type: String,
    },
    logoPublicId: {
        type: String,
    },
    category: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('StarBizzPartner', starBizzPartnerSchema);
