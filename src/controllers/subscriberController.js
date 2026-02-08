const Subscriber = require('../models/Subscriber');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { getPagination, getPaginationData } = require('../utils/pagination');
const { exportToCSV } = require('../utils/csvExport');
const { sendNewsletterWelcome, sendNewsletterBroadcast } = require('../services/emailService');

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

exports.importSubscribers = async (req, res) => {
    try {
        if (!req.file) {
            return errorResponse(res, 'Please upload a CSV file', 400);
        }

        const csvData = req.file.buffer.toString('utf8');
        const lines = csvData.split('\n');
        const header = lines[0].split(',').map(h => h.trim().toLowerCase());

        const emailIndex = header.indexOf('email');
        const sourceIndex = header.indexOf('source');

        if (emailIndex === -1) {
            return errorResponse(res, 'CSV must contain an "email" column', 400);
        }

        const results = [];
        let importedCount = 0;

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const values = line.split(',').map(v => v.trim());
            const email = values[emailIndex];
            const source = sourceIndex !== -1 ? values[sourceIndex] : 'CSV Import';

            if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                let subscriber = await Subscriber.findOne({ email });

                if (subscriber) {
                    subscriber.status = 'Active';
                    subscriber.source = source || subscriber.source;
                    subscriber.subscribedAt = new Date();
                    await subscriber.save();
                } else {
                    await Subscriber.create({ email, source });
                }
                importedCount++;
            }
        }

        successResponse(res, { importedCount }, `Successfully imported ${importedCount} subscribers`);
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

        // Send welcome email (non-blocking)
        sendNewsletterWelcome(email).catch(err => console.error('Error sending welcome email:', err));

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
exports.broadcastNewsletter = async (req, res) => {
    try {
        console.log('Broadcast request received:', req.body);
        const { title, body, ctaText, ctaUrl } = req.body;

        if (!title || !body) {
            return errorResponse(res, 'Title and Body are required', 400);
        }

        const subscribers = await Subscriber.find({ status: 'Active' });
        console.log(`Found ${subscribers.length} active subscribers for broadcast.`);

        if (subscribers.length === 0) {
            return errorResponse(res, 'No active subscribers found', 404);
        }

        const stats = await sendNewsletterBroadcast({
            title,
            body,
            ctaText,
            ctaUrl,
            subscribers,
        });

        console.log('Broadcast stats:', stats);

        successResponse(res, stats, `Newsletter broadcasted successfully to ${stats.successful} subscribers`);
    } catch (error) {
        console.error('Broadcast error:', error);
        errorResponse(res, error.message, 500);
    }
};
