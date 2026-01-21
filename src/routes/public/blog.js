const express = require('express');
const router = express.Router();
const {
    getPublicBlogPosts,
    getPublicBlogPost,
    submitComment,
} = require('../../controllers/blogController');

router.get('/', getPublicBlogPosts);
router.get('/:id', getPublicBlogPost);
router.post('/:id/comments', submitComment);

module.exports = router;
