// This file contains simple CRUD controllers for models that follow standard patterns
const Program = require('../models/Program');
const Team = require('../models/Team');
const Partner = require('../models/Partner');
const Opportunity = require('../models/Opportunity');
const ImpactStory = require('../models/ImpactStory');
const Resource = require('../models/Resource');
const Priority = require('../models/Priority');
const Value = require('../models/Value');
const Media = require('../models/Media');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { getPagination, getPaginationData } = require('../utils/pagination');
const { uploadImage, deleteImage, uploadMultipleImages } = require('../services/cloudinaryService');

// Generic CRUD factory
const createCRUDController = (Model, modelName, folder, dbField = 'image') => ({
    getAll: async (req, res) => {
        try {
            const { page, limit } = req.query;
            const { skip, limit: limitNum, page: pageNum } = getPagination(page, limit);

            const items = await Model.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum);

            const total = await Model.countDocuments();
            const pagination = getPaginationData(total, pageNum, limitNum);

            paginatedResponse(res, items, pagination);
        } catch (error) {
            errorResponse(res, error.message, 500);
        }
    },

    create: async (req, res) => {
        try {
            let imageData = {};
            if (req.file) {
                const uploaded = await uploadImage(req.file.buffer, folder);
                imageData = {
                    [folder === 'partners' ? 'logo' : dbField]: uploaded.url,
                    [folder === 'partners' ? 'logoPublicId' : `${dbField}PublicId`]: uploaded.publicId,
                };
            }

            if (req.body.status) {
                req.body.status = req.body.status.toLowerCase();
            }

            const item = await Model.create({ ...req.body, ...imageData });
            successResponse(res, item, `${modelName} created successfully`, 201);
        } catch (error) {
            errorResponse(res, error.message, 500);
        }
    },

    update: async (req, res) => {
        try {
            const item = await Model.findById(req.params.id);

            if (!item) {
                return errorResponse(res, `${modelName} not found`, 404);
            }

            if (req.file) {
                const publicIdField = folder === 'partners' ? 'logoPublicId' : `${dbField}PublicId`;
                if (item[publicIdField]) {
                    await deleteImage(item[publicIdField]);
                }
                const uploaded = await uploadImage(req.file.buffer, folder);
                const urlField = folder === 'partners' ? 'logo' : dbField;
                item[urlField] = uploaded.url;
                item[publicIdField] = uploaded.publicId;
            }

            Object.keys(req.body).forEach(key => {
                if (req.body[key] !== undefined) {
                    item[key] = key === 'status' ? req.body[key].toLowerCase() : req.body[key];
                }
            });

            await item.save();
            successResponse(res, item, `${modelName} updated successfully`);
        } catch (error) {
            errorResponse(res, error.message, 500);
        }
    },

    delete: async (req, res) => {
        try {
            const item = await Model.findById(req.params.id);

            if (!item) {
                return errorResponse(res, `${modelName} not found`, 404);
            }

            const publicIdField = folder === 'partners' ? 'logoPublicId' : `${dbField}PublicId`;
            if (item[publicIdField]) {
                await deleteImage(item[publicIdField]);
            }

            await item.deleteOne();
            successResponse(res, null, `${modelName} deleted successfully`);
        } catch (error) {
            errorResponse(res, error.message, 500);
        }
    },

    getPublic: async (req, res) => {
        try {
            const filter = {};
            if (Model.schema.path('status')) {
                filter.status = req.query.status || 'active';
            }
            if (Model.schema.path('type') && req.query.type) {
                filter.type = req.query.type;
            }

            const publicIdField = folder === 'partners' ? 'logoPublicId' : `${dbField}PublicId`;
            const items = await Model.find(filter).select(`-${publicIdField}`);
            successResponse(res, items);
        } catch (error) {
            errorResponse(res, error.message, 500);
        }
    },

    getPublicById: async (req, res) => {
        try {
            const item = await Model.findById(req.params.id).select(folder === 'partners' ? '-logoPublicId' : `-${dbField}PublicId`);

            if (!item) {
                return errorResponse(res, `${modelName} not found`, 404);
            }

            successResponse(res, item);
        } catch (error) {
            errorResponse(res, error.message, 500);
        }
    },
});

// Export controllers for each model
module.exports = {
    programController: createCRUDController(Program, 'Program', 'programs'),
    teamController: createCRUDController(Team, 'Team Member', 'team'),
    partnerController: createCRUDController(Partner, 'Partner', 'partners'),
    opportunityController: createCRUDController(Opportunity, 'Opportunity', 'opportunities'),
    impactStoryController: createCRUDController(ImpactStory, 'Impact Story', 'impact-stories'),
    resourceController: createCRUDController(Resource, 'Resource', 'resources', 'file'),
    priorityController: createCRUDController(Priority, 'Priority', 'priorities'),
    valueController: createCRUDController(Value, 'Value', 'values'),
};
