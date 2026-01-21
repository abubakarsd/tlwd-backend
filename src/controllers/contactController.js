const Contact = require('../models/Contact');
const { successResponse, errorResponse } = require('../utils/response');
const { sendContactEmail } = require('../services/emailService');

/**
 * @route   POST /api/contact
 * @desc    Submit contact form
 * @access  Public
 */
exports.submitContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return errorResponse(res, 'All fields are required', 400);
        }

        const contact = await Contact.create({
            name,
            email,
            subject,
            message,
        });

        // Send email notification
        await sendContactEmail({ name, email, subject, message });

        successResponse(res, contact, 'Message sent successfully', 201);
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};
