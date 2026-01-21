const express = require('express');
const router = express.Router();
const { getActiveHeroSlides } = require('../../controllers/publicHeroSlideController');

router.get('/', getActiveHeroSlides);

module.exports = router;
