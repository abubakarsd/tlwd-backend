const express = require('express');
const router = express.Router();
const {
    getAdminProjectComments,
    approveProjectComment,
    deleteProjectComment
} = require('../../controllers/impactStoryController');
const { impactStoryController } = require('../../controllers/crudControllers');
const createCRUDRoutes = require('./crudRoutes');
const { protect, admin } = require('../../middleware/auth');

router.use(protect, admin);

// Use the standard CRUD routes for the base / and /:id routes
const standardRouter = createCRUDRoutes(impactStoryController);

// Mount the standard CRUD routes
router.use('/', standardRouter);

// Add specific comment management routes
// Note: These must be careful not to conflict with standard routes
// Standard GET /:id is handled by standardRouter above
router.get('/:id/comments', getAdminProjectComments);
router.patch('/:id/comments/:commentId/approve', approveProjectComment);
router.delete('/:id/comments/:commentId', deleteProjectComment);

module.exports = router;
