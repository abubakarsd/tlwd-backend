const Media = require('../models/Media');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { getPagination, getPaginationData } = require('../utils/pagination');
const { uploadImage, deleteImage } = require('../services/cloudinaryService');

// Get all media
exports.getMedia = async (req, res) => {
    try {
        const { page, limit, type, sort = 'createdAt', order = 'desc' } = req.query;
        const { skip, limit: limitNum, page: pageNum } = getPagination(page, limit);
        const query = {};
        if (type) query.type = type;

        const media = await Media.find(query)
            .sort({ [sort]: order === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limitNum);

        const total = await Media.countDocuments(query);
        const pagination = getPaginationData(total, pageNum, limitNum);

        paginatedResponse(res, media, pagination);
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

// Upload media
exports.createMedia = async (req, res) => {
    try {
        if (!req.file) {
            return errorResponse(res, 'Please upload a file', 400);
        }

        const uploaded = await uploadImage(req.file.buffer, 'TLWDF/media');

        // Determine type
        let type = 'image';
        if (req.file.mimetype.includes('pdf') || req.file.mimetype.includes('doc')) {
            type = 'document';
        } else if (req.file.mimetype.includes('video')) {
            type = 'video';
        }

        const media = await Media.create({
            filename: req.file.originalname,
            url: uploaded.url,
            publicId: uploaded.publicId,
            type,
            size: req.file.size,
        });

        successResponse(res, media, 'Media uploaded successfully', 201);
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

// Delete media
exports.deleteMedia = async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);
        if (!media) return errorResponse(res, 'Media not found', 404);

        if (media.publicId) {
            await deleteImage(media.publicId);
        }

        await media.deleteOne();
        successResponse(res, null, 'Media deleted successfully');
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};
