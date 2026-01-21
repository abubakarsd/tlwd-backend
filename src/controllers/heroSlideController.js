const HeroSlide = require('../models/HeroSlide');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { getPagination, getPaginationData } = require('../utils/pagination');
const { uploadImage, deleteImage } = require('../services/cloudinaryService');

/**
 * @route   GET /api/admin/hero-slides
 * @desc    Get all hero slides
 * @access  Private/Admin
 */
exports.getHeroSlides = async (req, res) => {
    try {
        const { page, limit, sort = 'order', order = 'asc' } = req.query;
        const { skip, limit: limitNum, page: pageNum } = getPagination(page, limit);

        const sortOrder = order === 'desc' ? -1 : 1;
        const slides = await HeroSlide.find()
            .sort({ [sort]: sortOrder })
            .skip(skip)
            .limit(limitNum);

        const total = await HeroSlide.countDocuments();
        const pagination = getPaginationData(total, pageNum, limitNum);

        paginatedResponse(res, slides, pagination);
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

/**
 * @route   POST /api/admin/hero-slides
 * @desc    Create hero slide
 * @access  Private/Admin
 */
exports.createHeroSlide = async (req, res) => {
    try {
        const { title, subtitle, category, status, order } = req.body;

        // Upload image if provided
        let imageData = {};
        if (req.file) {
            const uploaded = await uploadImage(req.file.buffer, 'hero-slides');
            imageData = {
                image: uploaded.url,
                imagePublicId: uploaded.publicId,
            };
        }

        const slide = await HeroSlide.create({
            title,
            subtitle,
            category,
            status,
            order,
            ...imageData,
        });

        successResponse(res, slide, 'Hero slide created successfully', 201);
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

/**
 * @route   PUT /api/admin/hero-slides/:id
 * @desc    Update hero slide
 * @access  Private/Admin
 */
exports.updateHeroSlide = async (req, res) => {
    try {
        const slide = await HeroSlide.findById(req.params.id);

        if (!slide) {
            return errorResponse(res, 'Hero slide not found', 404);
        }

        const { title, subtitle, category, status, order } = req.body;

        // Upload new image if provided
        if (req.file) {
            // Delete old image
            if (slide.imagePublicId) {
                await deleteImage(slide.imagePublicId);
            }

            const uploaded = await uploadImage(req.file.buffer, 'hero-slides');
            slide.image = uploaded.url;
            slide.imagePublicId = uploaded.publicId;
        }

        slide.title = title || slide.title;
        slide.subtitle = subtitle || slide.subtitle;
        slide.category = category || slide.category;
        slide.status = status || slide.status;
        slide.order = order !== undefined ? order : slide.order;

        await slide.save();

        successResponse(res, slide, 'Hero slide updated successfully');
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

/**
 * @route   DELETE /api/admin/hero-slides/:id
 * @desc    Delete hero slide
 * @access  Private/Admin
 */
exports.deleteHeroSlide = async (req, res) => {
    try {
        const slide = await HeroSlide.findById(req.params.id);

        if (!slide) {
            return errorResponse(res, 'Hero slide not found', 404);
        }

        // Delete image from Cloudinary
        if (slide.imagePublicId) {
            await deleteImage(slide.imagePublicId);
        }

        await slide.deleteOne();

        successResponse(res, null, 'Hero slide deleted successfully');
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};
