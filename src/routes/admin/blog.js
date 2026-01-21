const express = require('express');
const router = express.Router();
const {
    getBlogPosts,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    getBlogComments,
    approveComment,
    deleteComment,
} = require('../../controllers/blogController');
const { protect, admin } = require('../../middleware/auth');
const upload = require('../../middleware/upload');

router.use(protect, admin);

router.route('/')
    .get(getBlogPosts)
    .post(upload.single('image'), createBlogPost);

router.route('/:id')
    .put(upload.single('image'), updateBlogPost)
    .delete(deleteBlogPost);

router.get('/:id/comments', getBlogComments);
router.patch('/:id/comments/:commentId/approve', approveComment);
router.delete('/:id/comments/:commentId', deleteComment);

module.exports = router;
