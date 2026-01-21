const Subscriber = require('../models/Subscriber');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { getPagination, getPaginationData } = require('../utils/pagination');
const { exportToCSV } = require('../utils/csvExport');
const { sendNewsletterWelcome } = require('../services/emailService');

/**
 * ADMIN ENDPOINTS
 */

exports.getSubscribers = async (req, res) => {
    try {
        const { page, limit, status } = req.query;
        const { skip, limit: limitNum, page: pageNum } = getPagination(page, limit);

        const filter = {};
        if (status) filter.status = status;

        const subscribers = await Subscriber.find(filter)
            .sort({ subscribedAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const total = await Subscriber.countDocuments(filter);
        const pagination = getPaginationData(total, pageNum, limitNum);

        paginatedResponse(res, subscribers, pagination);
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

exports.deleteSubscriber = async (req, res) => {
    try {
        const subscriber = await Subscriber.findById(req.params.id);

        if (!subscriber) {
            return errorResponse(res, 'Subscriber not found', 404);
        }

        await subscriber.deleteOne();

        successResponse(res, null, 'Subscriber deleted successfully');
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

exports.exportSubscribers = async (req, res) => {
    try {
        const subscribers = await Subscriber.find({ status: 'Active' })
            .sort({ subscribedAt: -1 });

        const fields = [
            { key: 'email', label: 'Email' },
            { key: 'source', label: 'Source' },
            { key: 'subscribedAt', label: 'Subscribed Date' },
        ];

        const csv = exportToCSV(subscribers, fields);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv');
        res.send(csv);
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

/**
 * PUBLIC ENDPOINTS
 */

exports.subscribe = async (req, res) => {
    try {
        const { email, source = 'Website' } = req.body;

        if (!email) {
            return errorResponse(res, 'Email is required', 400);
        }

        // Check if already subscribed
        let subscriber = await Subscriber.findOne({ email });

        if (subscriber) {
            if (subscriber.status === 'Active') {
                return errorResponse(res, 'Email already subscribed', 400);
            }
            // Reactivate if previously unsubscribed
            subscriber.status = 'Active';
            subscriber.subscribedAt = new Date();
            await subscriber.save();
        } else {
            subscriber = await Subscriber.create({ email, source });
        }

        // Send welcome email
        await sendNewsletterWelcome(email);

        successResponse(res, subscriber, 'Successfully subscribed to newsletter', 201);
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

exports.unsubscribe = async (req, res) => {
    try {
        const { email } = req.body;

        const subscriber = await Subscriber.findOne({ email });

        if (!subscriber) {
            return errorResponse(res, 'Email not found', 404);
        }

        subscriber.status = 'Unsubscribed';
        subscriber.unsubscribedAt = new Date();
        await subscriber.save();

        successResponse(res, null, 'Successfully unsubscribed');
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};
