const express = require('express');
const router = express.Router();
const {
    getHeroSlides,
    createHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
} = require('../../controllers/heroSlideController');
const { protect, admin } = require('../../middleware/auth');
const upload = require('../../middleware/upload');

// All routes require authentication and admin role
router.use(protect, admin);

router.route('/')
    .get(getHeroSlides)
    .post(upload.single('image'), createHeroSlide);

router.route('/:id')
    .put(upload.single('image'), updateHeroSlide)
    .delete(deleteHeroSlide);

module.exports = router;
