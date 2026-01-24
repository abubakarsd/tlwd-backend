const ImpactStory = require('../models/ImpactStory');
const Comment = require('../models/Comment');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * @route   GET /api/impact-stories/:id
 * @desc    Get single impact story with comments
 * @access  Public
 */
exports.getPublicImpactStory = async (req, res) => {
    try {
        const project = await ImpactStory.findById(req.params.id);

        if (!project || project.status !== 'published') {
            return errorResponse(res, 'Project not found', 404);
        }

        // Get approved comments
        const comments = await Comment.find({
            projectId: project._id,
            status: 'approved',
        }).sort({ createdAt: -1 });

        successResponse(res, { project, comments });
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

/**
 * @route   POST /api/impact-stories/:id/comments
 * @desc    Submit comment for project
 * @access  Public
 */
exports.submitProjectComment = async (req, res) => {
    try {
        const { user, email, text } = req.body;

        if (!user || !email || !text) {
            return errorResponse(res, 'All fields are required', 400);
        }

        const comment = await Comment.create({
            projectId: req.params.id,
            user,
            email,
            text,
        });

        successResponse(res, comment, 'Comment submitted for moderation', 201);
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

/**
 * @route   GET /api/admin/impact-stories/:id/comments
 * @desc    Get all comments for a project (Admin)
 * @access  Private/Admin
 */
exports.getAdminProjectComments = async (req, res) => {
    try {
        const comments = await Comment.find({ projectId: req.params.id }).sort({ createdAt: -1 });
        successResponse(res, comments);
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

/**
 * @route   PATCH /api/admin/impact-stories/:id/comments/:commentId/approve
 * @desc    Approve project comment
 * @access  Private/Admin
 */
exports.approveProjectComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return errorResponse(res, 'Comment not found', 404);

        comment.status = 'approved';
        await comment.save();

        successResponse(res, comment, 'Comment approved successfully');
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

/**
 * @route   DELETE /api/admin/impact-stories/:id/comments/:commentId
 * @desc    Delete project comment
 * @access  Private/Admin
 */
exports.deleteProjectComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return errorResponse(res, 'Comment not found', 404);

        await comment.deleteOne();
        successResponse(res, null, 'Comment deleted successfully');
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};
