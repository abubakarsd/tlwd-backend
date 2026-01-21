const resend = require('../config/resend');

/**
 * Send contact form email
 */
const sendContactEmail = async ({ name, email, subject, message }) => {
    try {
        const result = await resend.emails.send({
            from: 'TLWD Foundation <noreply@tlwd.org>',
            to: process.env.ADMIN_EMAIL,
            subject: `Contact Form: ${subject}`,
            html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
        });
        return result;
    } catch (error) {
        throw error;
    }
};

/**
 * Send application confirmation email
 */
const sendApplicationConfirmation = async ({ name, email, opportunityTitle }) => {
    try {
        const result = await resend.emails.send({
            from: 'TLWD Foundation <noreply@tlwd.org>',
            to: email,
            subject: 'Application Received - TLWD Foundation',
            html: `
        <h2>Thank you for your application!</h2>
        <p>Dear ${name},</p>
        <p>We have received your application for <strong>${opportunityTitle}</strong>.</p>
        <p>Our team will review your application and get back to you soon.</p>
        <br>
        <p>Best regards,</p>
        <p>TLWD Foundation Team</p>
      `,
        });
        return result;
    } catch (error) {
        throw error;
    }
};

/**
 * Send donation receipt email
 */
const sendDonationReceipt = async ({ name, email, amount, reference }) => {
    try {
        const result = await resend.emails.send({
            from: 'TLWD Foundation <noreply@tlwd.org>',
            to: email,
            subject: 'Donation Receipt - TLWD Foundation',
            html: `
        <h2>Thank you for your generous donation!</h2>
        <p>Dear ${name},</p>
        <p>We have received your donation of <strong>₦${amount.toLocaleString()}</strong>.</p>
        <p><strong>Transaction Reference:</strong> ${reference}</p>
        <p>Your support helps us make a difference in the lives of many.</p>
        <br>
        <p>Best regards,</p>
        <p>TLWD Foundation Team</p>
      `,
        });
        return result;
    } catch (error) {
        throw error;
    }
};

/**
 * Send newsletter welcome email
 */
const sendNewsletterWelcome = async (email) => {
    try {
        const result = await resend.emails.send({
            from: 'TLWD Foundation <noreply@tlwd.org>',
            to: email,
            subject: 'Welcome to TLWD Foundation Newsletter',
            html: `
        <h2>Welcome to our newsletter!</h2>
        <p>Thank you for subscribing to TLWD Foundation's newsletter.</p>
        <p>You'll receive updates about our programs, impact stories, and upcoming events.</p>
        <br>
        <p>Best regards,</p>
        <p>TLWD Foundation Team</p>
      `,
        });
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    sendContactEmail,
    sendApplicationConfirmation,
    sendDonationReceipt,
    sendNewsletterWelcome,
};
