// This file contains simple CRUD controllers for models that follow standard patterns
const ImpactCount = require('../models/ImpactCount');
const Team = require('../models/Team');
const Partner = require('../models/Partner');
const Opportunity = require('../models/Opportunity');
const ImpactStory = require('../models/ImpactStory');
const Resource = require('../models/Resource');
const Priority = require('../models/Priority');
const Value = require('../models/Value');
const Testimonial = require('../models/Testimonial');
const Media = require('../models/Media');
const StarBizzImpact = require('../models/StarBizzImpact');
const StarBizzProgram = require('../models/StarBizzProgram');
const StarBizzPartner = require('../models/StarBizzPartner');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { getPagination, getPaginationData } = require('../utils/pagination');
const { uploadImage, deleteImage, uploadMultipleImages } = require('../services/cloudinaryService');

// Generic CRUD factory
const createCRUDController = (Model, modelName, folder, dbField = 'image', onCreated = null) => ({
    getAll: async (req, res) => {
        try {
            const { page, limit } = req.query;
            const { skip, limit: limitNum, page: pageNum } = getPagination(page, limit);

            let sort = { createdAt: -1 };
            if (Model.modelName === 'ImpactStory') {
                sort = { year: -1 };
            }

            const items = await Model.find()
                .sort(sort)
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
                // req.body.status = req.body.status.toLowerCase();
            }

            const item = await Model.create({ ...req.body, ...imageData });

            if (onCreated) {
                try {
                    await onCreated(item);
                } catch (hookError) {
                    console.error(`Error in onCreated hook for ${modelName}:`, hookError);
                }
            }

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
                    item[key] = key === 'status' ? req.body[key] : req.body[key];
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
                // Determine the correct "active" status for this model
                const modelName = Model.modelName;
                let defaultStatus = 'Active';

                if (modelName === 'Opportunity') defaultStatus = 'Open';
                if (modelName === 'ImpactStory' || modelName === 'Blog') defaultStatus = 'Published';

                const status = req.query.status || defaultStatus;

                // Construct a set of equivalent statuses (e.g., 'Published', 'published')
                const statusList = [
                    status,
                    status.toLowerCase(),
                    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
                ];

                // For public routes, if looking for Active/Published, also allow the lowercase versions
                if (status.toLowerCase() === 'active' || status.toLowerCase() === 'published' || status.toLowerCase() === 'open') {
                    statusList.push('Active', 'active', 'Published', 'published', 'Open', 'open');
                }

                if (modelName === 'Opportunity') {
                    // TEMPORARY DEBUG: Disable status filter for Opportunity
                    // filter.status = { $in: [...new Set(statusList)] };
                    console.log(`[DEBUG] getPublic Opportunity Filter DISABLED status check`);
                } else {
                    filter.status = { $in: [...new Set(statusList)] };
                }
                if (modelName === 'Opportunity') {
                    console.log(`[DEBUG] getPublic Opportunity Filter:`, JSON.stringify(filter));
                }
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

const Subscriber = require('../models/Subscriber');
const { sendNewsletterBroadcast } = require('../services/emailService');

// Export controllers for each model
module.exports = {
    impactCountController: createCRUDController(ImpactCount, 'Impact Count', 'impact-counts'),
    teamController: createCRUDController(Team, 'Team Member', 'team'),
    partnerController: createCRUDController(Partner, 'Partner', 'partners'),
    opportunityController: createCRUDController(Opportunity, 'Opportunity', 'opportunities', 'image', async (item) => {
        try {
            const subscribers = await Subscriber.find({ status: 'Active' });
            if (subscribers.length > 0) {
                await sendNewsletterBroadcast({
                    title: `New Opportunity: ${item.title}`,
                    body: `<p>A new ${item.type} opportunity is available at TLWD Foundation!</p><p>${item.description.substring(0, 200)}...</p>`,
                    ctaText: 'View Opportunity',
                    ctaUrl: `${process.env.FRONTEND_URL}/opportunities/${item._id}`,
                    image: item.image,
                    subscribers,
                });
            }
        } catch (error) {
            console.error('Email broadcast failed for opportunity:', error);
        }
    }),
    impactStoryController: createCRUDController(ImpactStory, 'Impact Story', 'impact-stories'),
    resourceController: createCRUDController(Resource, 'Resource', 'resources', 'file'),
    priorityController: createCRUDController(Priority, 'Priority', 'priorities'),
    valueController: createCRUDController(Value, 'Value', 'values'),
    testimonialController: createCRUDController(Testimonial, 'Testimonial', 'testimonials'),
    starBizzImpactController: createCRUDController(StarBizzImpact, 'StarBizz Impact', 'starbizz-impact'),
    starBizzProgramController: createCRUDController(StarBizzProgram, 'StarBizz Program', 'starbizz-programs', 'image', async (item) => {
        try {
            const subscribers = await Subscriber.find({ status: 'Active' });
            if (subscribers.length > 0) {
                await sendNewsletterBroadcast({
                    title: `New StarBizz Program: ${item.title}`,
                    body: `<p>A new program has been added to StarBizz!</p><p>${item.description.substring(0, 200)}...</p>`,
                    ctaText: 'View Program',
                    ctaUrl: `${process.env.FRONTEND_URL}/startbizzlab`, // Or specific program URL if available
                    image: item.image,
                    subscribers,
                });
            }
        } catch (error) {
            console.error('Email broadcast failed for StarBizz Program:', error);
        }
    }),
    starBizzPartnerController: createCRUDController(StarBizzPartner, 'StarBizz Partner', 'starbizz-partners', 'logo'),
};
