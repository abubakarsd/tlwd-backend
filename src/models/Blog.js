const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    slug: {
        type: String,
        unique: true,
    },
    author: {
        type: String,
        required: [true, 'Author is required'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
    },
    status: {
        type: String,
        enum: ['Published', 'Draft'],
        default: 'Draft',
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
    },
    image: {
        type: String,
    },
    imagePublicId: {
        type: String,
    },
    authorImage: {
        type: String,
    },
    authorRole: {
        type: String,
        default: 'Contributor',
    },
    authorBio: {
        type: String,
        default: 'Dedicated to sharing stories of impact and change. Join us in making a difference in the world, one community at a time.',
    },
    views: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

// Generate slug before saving
blogSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model('Blog', blogSchema);
