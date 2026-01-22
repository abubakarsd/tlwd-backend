const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    role: {
        type: String,
        required: [true, 'Role/Designation is required'],
    },
    content: {
        type: String,
        required: [true, 'Testimonial content is required'],
    },
    image: {
        type: String,
    },
    imagePublicId: {
        type: String,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
