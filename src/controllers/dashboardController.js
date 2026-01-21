const Donation = require('../models/Donation');
const Application = require('../models/Application');
const Subscriber = require('../models/Subscriber');
const Blog = require('../models/Blog');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * @route   GET /api/admin/dashboard/stats
 * @desc    Get dashboard statistics
 * @access  Private/Admin
 */
exports.getDashboardStats = async (req, res) => {
    try {
        // Total donations
        const totalDonations = await Donation.aggregate([
            { $match: { status: 'Successful' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);

        // Recent donations
        const recentDonations = await Donation.find({ status: 'Successful' })
            .sort({ createdAt: -1 })
            .limit(5);

        // Applications stats
        const totalApplications = await Application.countDocuments();
        const pendingApplications = await Application.countDocuments({ status: 'Pending' });

        // Subscribers count
        const subscriberCount = await Subscriber.countDocuments({ status: 'Active' });

        // Recent blog posts
        const recentPosts = await Blog.find({ status: 'Published' })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title createdAt views');

        const stats = {
            totalDonations: totalDonations[0]?.total || 0,
            recentDonations,
            totalApplications,
            pendingApplications,
            subscriberCount,
            recentPosts,
        };

        successResponse(res, stats);
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

/**
 * @route   GET /api/admin/dashboard/donation-trends
 * @desc    Get donation trends for charts
 * @access  Private/Admin
 */
exports.getDonationTrends = async (req, res) => {
    try {
        const trends = await Donation.aggregate([
            { $match: { status: 'Successful' } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    total: { $sum: '$amount' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 12 },
        ]);

        successResponse(res, trends);
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};
