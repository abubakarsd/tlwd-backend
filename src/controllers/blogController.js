const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const Subscriber = require('../models/Subscriber');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { getPagination, getPaginationData } = require('../utils/pagination');
const { uploadImage, deleteImage } = require('../services/cloudinaryService');
const { sendNewsletterBroadcast } = require('../services/emailService');

/**
 * @route   GET /api/admin/blog
 * @desc    Get all blog posts
 * @access  Private/Admin
 */
exports.getBlogPosts = async (req, res) => {
    try {
        const { page, limit, status, category } = req.query;
        const { skip, limit: limitNum, page: pageNum } = getPagination(page, limit);

        const filter = {};
        if (status) filter.status = status;
        if (category) filter.category = category;

        const posts = await Blog.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const total = await Blog.countDocuments(filter);
        const pagination = getPaginationData(total, pageNum, limitNum);

        paginatedResponse(res, posts, pagination);
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

/**
 * @route   POST /api/admin/blog
 * @desc    Create blog post
 * @access  Private/Admin
 */
exports.createBlogPost = async (req, res) => {
    try {
        const { title, author, category, status, content, authorRole, authorBio, authorImage } = req.body;

        let imageData = {};
        if (req.file) {
            const uploaded = await uploadImage(req.file.buffer, 'blog');
            imageData = {
                image: uploaded.url,
                imagePublicId: uploaded.publicId,
            };
        }

        const post = await Blog.create({
            title,
            author,
            category,
            status,
            content,
            authorRole,
            authorBio,
            authorImage,
            ...imageData,
        });

        // Send newsletter if post is published
        if (status === 'Published') {
            try {
                const subscribers = await Subscriber.find({ status: 'Active' });
                if (subscribers.length > 0) {
                    await sendNewsletterBroadcast({
                        title: `New Post: ${title}`,
                        body: `<p>${content.replace(/<[^>]*>/g, '').substring(0, 300)}...</p>`,
                        ctaText: 'Read Article',
                        ctaUrl: `${process.env.FRONTEND_URL}/blog/${post._id}`,
                        subscribers,
                    });
                }
            } catch (emailError) {
                console.error('Newsletter send error:', emailError);
            }
        }

        successResponse(res, post, 'Blog post created successfully', 201);
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

/**
 * @route   PUT /api/admin/blog/:id
 * @desc    Update blog post
 * @access  Private/Admin
 */
exports.updateBlogPost = async (req, res) => {
    try {
        const post = await Blog.findById(req.params.id);

        if (!post) {
            return errorResponse(res, 'Blog post not found', 404);
        }

        const { title, author, category, status, content, authorRole, authorBio, authorImage } = req.body;
        const wasPublished = post.status === 'Published';

        if (req.file) {
            if (post.imagePublicId) {
                await deleteImage(post.imagePublicId);
            }
            const uploaded = await uploadImage(req.file.buffer, 'TLWDF/blog');
            post.image = uploaded.url;
            post.imagePublicId = uploaded.publicId;
        }

        post.title = title || post.title;
        post.author = author || post.author;
        post.category = category || post.category;
        post.status = status || post.status;
        post.content = content || post.content;
        post.authorRole = authorRole || post.authorRole;
        post.authorBio = authorBio || post.authorBio;
        post.authorImage = authorImage || post.authorImage;

        await post.save();

        // Send newsletter if post is newly published (was Draft, now Published)
        if (!wasPublished && post.status === 'Published') {
            try {
                const subscribers = await Subscriber.find({ status: 'Active' });
                if (subscribers.length > 0) {
                    const excerpt = post.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...';

                    await sendNewsletterBroadcast({
                        title: post.title,
                        excerpt,
                        slug: post.slug,
                        subscribers,
                    });
                }
            } catch (emailError) {
                console.error('Newsletter send error:', emailError);
            }
        }

        successResponse(res, post, 'Blog post updated successfully');
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

/**
 * @route   DELETE /api/admin/blog/:id
 * @desc    Delete blog post
 * @access  Private/Admin
 */
exports.deleteBlogPost = async (req, res) => {
    try {
        const post = await Blog.findById(req.params.id);

        if (!post) {
            return errorResponse(res, 'Blog post not found', 404);
        }

        if (post.imagePublicId) {
            await deleteImage(post.imagePublicId);
        }

        // Delete associated comments
        await Comment.deleteMany({ blogId: post._id });

        await post.deleteOne();

        successResponse(res, null, 'Blog post deleted successfully');
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

/**
 * @route   GET /api/admin/blog/:id/comments
 * @desc    Get comments for a blog post
 * @access  Private/Admin
 */
exports.getBlogComments = async (req, res) => {
    try {
        const comments = await Comment.find({ blogId: req.params.id })
            .sort({ createdAt: -1 });

        successResponse(res, comments);
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

/**
 * @route   PATCH /api/admin/blog/:id/comments/:commentId/approve
 * @desc    Approve comment
 * @access  Private/Admin
 */
exports.approveComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return errorResponse(res, 'Comment not found', 404);
        }

        comment.status = 'approved';
        await comment.save();

        successResponse(res, comment, 'Comment approved successfully');
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

/**
 * @route   DELETE /api/admin/blog/:id/comments/:commentId
 * @desc    Delete comment
 * @access  Private/Admin
 */
exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return errorResponse(res, 'Comment not found', 404);
        }

        await comment.deleteOne();

        successResponse(res, null, 'Comment deleted successfully');
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

/**
 * PUBLIC ENDPOINTS
 */

/**
 * @route   GET /api/blog
 * @desc    Get published blog posts
 * @access  Public
 */
exports.getPublicBlogPosts = async (req, res) => {
    try {
        const { page, limit, category, search } = req.query;
        const { skip, limit: limitNum, page: pageNum } = getPagination(page, limit);

        const filter = { status: 'Published' };
        if (category) filter.category = category;

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        const posts = await Blog.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .select('-imagePublicId');

        const total = await Blog.countDocuments(filter);
        const pagination = getPaginationData(total, pageNum, limitNum);

        paginatedResponse(res, posts, pagination);
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

/**
 * @route   GET /api/blog/:id
 * @desc    Get single blog post
 * @access  Public
 */
exports.getPublicBlogPost = async (req, res) => {
    try {
        const post = await Blog.findById(req.params.id).select('-imagePublicId');

        if (!post || post.status !== 'Published') {
            return errorResponse(res, 'Blog post not found', 404);
        }

        // Increment views
        post.views += 1;
        await post.save();

        // Get approved comments
        const comments = await Comment.find({
            blogId: post._id,
            status: 'approved',
        }).sort({ createdAt: -1 });

        successResponse(res, { post, comments });
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

/**
 * @route   POST /api/blog/:id/comments
 * @desc    Submit comment
 * @access  Public
 */
exports.submitComment = async (req, res) => {
    try {
        const { user, email, text } = req.body;

        if (!user || !email || !text) {
            return errorResponse(res, 'All fields are required', 400);
        }

        const comment = await Comment.create({
            blogId: req.params.id,
            user,
            email,
            text,
        });

        successResponse(res, comment, 'Comment submitted for moderation', 201);
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};
