const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
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
    homepage: {
        type: Boolean,
        default: false,
    },
    logo: {
        type: String,
    },
    logoPublicId: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Partner', partnerSchema);
