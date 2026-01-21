const mongoose = require('mongoose');

const heroSlideSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    subtitle: {
        type: String,
    },
    category: {
        type: String,
    },
    image: {
        type: String,
        required: [true, 'Image is required'],
    },
    imagePublicId: {
        type: String,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    order: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('HeroSlide', heroSlideSchema);
