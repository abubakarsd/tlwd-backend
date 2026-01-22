const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { getPagination, getPaginationData } = require('../utils/pagination');
const { uploadImage } = require('../services/cloudinaryService');
const { sendApplicationConfirmation } = require('../services/emailService');

/**
 * @route   GET /api/admin/applications
 * @desc    Get all applications
 * @access  Private/Admin
 */
exports.getApplications = async (req, res) => {
    try {
        const { page, limit, status } = req.query;
        const { skip, limit: limitNum, page: pageNum } = getPagination(page, limit);

        const filter = {};
        if (status) filter.status = status;

        const applications = await Application.find(filter)
            .populate('opportunityId', 'title type')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const total = await Application.countDocuments(filter);
        const pagination = getPaginationData(total, pageNum, limitNum);

        paginatedResponse(res, applications, pagination);
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

/**
 * @route   GET /api/admin/applications/:id
 * @desc    Get application details
 * @access  Private/Admin
 */
exports.getApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('opportunityId');

        if (!application) {
            return errorResponse(res, 'Application not found', 404);
        }

        successResponse(res, application);
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

/**
 * @route   PATCH /api/admin/applications/:id/status
 * @desc    Update application status
 * @access  Private/Admin
 */
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['Pending', 'Shortlisted', 'Rejected'].includes(status)) {
            return errorResponse(res, 'Invalid status', 400);
        }

        const application = await Application.findById(req.params.id);

        if (!application) {
            return errorResponse(res, 'Application not found', 404);
        }

        application.status = status;
        await application.save();

        successResponse(res, application, 'Application status updated successfully');
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

/**
 * @route   DELETE /api/admin/applications/:id
 * @desc    Delete application
 * @access  Private/Admin
 */
exports.deleteApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return errorResponse(res, 'Application not found', 404);
        }

        await application.deleteOne();

        successResponse(res, null, 'Application deleted successfully');
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

/**
 * PUBLIC ENDPOINT
 */

/**
 * @route   POST /api/opportunities/:id/apply
 * @desc    Submit application
 * @access  Public
 */
exports.submitApplication = async (req, res) => {
    try {
        const { name, email, phone, coverLetter } = req.body;

        if (!name || !email) {
            return errorResponse(res, 'Name and email are required', 400);
        }

        // Check if opportunity exists and is open
        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity || opportunity.status !== 'Open') {
            return errorResponse(res, 'Opportunity not available', 404);
        }

        // Upload CV if provided
        let cvData = {};
        if (req.file) {
            const uploaded = await uploadImage(req.file.buffer, 'TLWDF/applications');
            cvData = {
                cv: uploaded.url,
                cvPublicId: uploaded.publicId,
            };
        }

        const application = await Application.create({
            opportunityId: req.params.id,
            name,
            email,
            phone,
            coverLetter,
            ...cvData,
        });

        // Send confirmation email
        await sendApplicationConfirmation({
            name,
            email,
            opportunityTitle: opportunity.title,
        });

        successResponse(res, application, 'Application submitted successfully', 201);
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};
