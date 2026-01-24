const Donation = require('../models/Donation');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { getPagination, getPaginationData } = require('../utils/pagination');
const { initializePayment, verifyPayment } = require('../services/paystackService');
const { sendDonationReceipt } = require('../services/emailService');
const { exportToCSV } = require('../utils/csvExport');

/**
 * @route   GET /api/admin/donations
 * @desc    Get all donations with filters
 * @access  Private/Admin
 */
exports.getDonations = async (req, res) => {
    try {
        const { page, limit, status, method, from, to } = req.query;
        const { skip, limit: limitNum, page: pageNum } = getPagination(page, limit);

        // Build filter
        const filter = {};
        if (status) filter.status = status;
        if (method) filter.method = method;
        if (from || to) {
            filter.createdAt = {};
            if (from) filter.createdAt.$gte = new Date(from);
            if (to) filter.createdAt.$lte = new Date(to);
        }

        const donations = await Donation.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const total = await Donation.countDocuments(filter);
        const pagination = getPaginationData(total, pageNum, limitNum);

        paginatedResponse(res, donations, pagination);
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

/**
 * @route   GET /api/admin/donations/export
 * @desc    Export donations as CSV
 * @access  Private/Admin
 */
exports.exportDonations = async (req, res) => {
    try {
        const donations = await Donation.find().sort({ createdAt: -1 });

        const fields = [
            { key: 'reference', label: 'Reference' },
            { key: 'name', label: 'Donor Name' },
            { key: 'email', label: 'Email' },
            { key: 'amount', label: 'Amount' },
            { key: 'method', label: 'Method' },
            { key: 'status', label: 'Status' },
            { key: 'createdAt', label: 'Date' },
        ];

        const csv = exportToCSV(donations, fields);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=donations.csv');
        res.send(csv);
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

/**
 * @route   POST /api/donations/initialize
 * @desc    Initialize donation payment
 * @access  Public
 */
exports.initializeDonation = async (req, res) => {
    try {
        const { amount, email, name } = req.body;

        if (!amount || !email) {
            return errorResponse(res, 'Amount and email are required', 400);
        }

        // Generate unique reference (or use provided one)
        const reference = req.body.reference || `TLWD-${Date.now()}`;

        // Create donation record
        const donation = await Donation.create({
            reference,
            amount,
            email,
            name,
            status: 'Pending',
        });

        // Initialize payment with Paystack
        const paymentData = await initializePayment({
            email,
            amount,
            reference,
        });

        successResponse(res, {
            reference,
            authorization_url: paymentData.data.authorization_url,
        }, 'Payment initialized successfully');
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

/**
 * @route   GET /api/donations/verify/:reference
 * @desc    Verify donation payment
 * @access  Public
 */
exports.verifyDonation = async (req, res) => {
    try {
        const { reference } = req.params;

        // Verify with Paystack
        const verification = await verifyPayment(reference);
        console.log(`[DEBUG] Verify Response for ${reference}:`, verification.data.status);

        // Update donation record
        const donation = await Donation.findOne({ reference });

        if (!donation) {
            console.error(`[DEBUG] Donation NOT FOUND for reference: ${reference}`);
            return errorResponse(res, 'Donation not found', 404);
        }

        console.log(`[DEBUG] Found Donation:`, donation._id, donation.status);

        donation.status = verification.data.status === 'success' ? 'Successful' : 'Failed';
        donation.paystackData = verification.data;
        await donation.save();
        console.log(`[DEBUG] Donation Updated to:`, donation.status);

        // Send receipt email if successful
        if (donation.status === 'Successful') {
            try {
                await sendDonationReceipt({
                    name: donation.name || 'Donor',
                    email: donation.email,
                    amount: donation.amount,
                    reference: donation.reference,
                });
                console.log(`[DEBUG] Receipt Sent`);
            } catch (emailErr) {
                console.error(`[DEBUG] Email Error:`, emailErr);
            }
        }

        successResponse(res, {
            status: donation.status,
            amount: donation.amount,
        }, 'Payment verified successfully');
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};
