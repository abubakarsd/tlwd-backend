const HeroSlide = require('../models/HeroSlide');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * @route   GET /api/hero-slides
 * @desc    Get active hero slides for public display
 * @access  Public
 */
exports.getActiveHeroSlides = async (req, res) => {
    try {
        const slides = await HeroSlide.find({ status: { $in: ['Active', 'active'] } })
            .sort({ order: 1 })
            .select('-imagePublicId');

        successResponse(res, slides);
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};
