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

/**
 * Send newsletter broadcast for new blog post
 */
const sendNewsletterBroadcast = async ({ title, excerpt, slug, subscribers }) => {
    try {
        const blogUrl = `${process.env.FRONTEND_URL}/blog/${slug}`;

        // Send to all subscribers (Resend supports batch sending)
        const emailPromises = subscribers.map(subscriber =>
            resend.emails.send({
                from: 'TLWD Foundation <noreply@tlwd.org>',
                to: subscriber.email,
                subject: `New Post: ${title}`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Blog Post from TLWD Foundation</h2>
            <h3 style="color: #0066cc;">${title}</h3>
            <p style="color: #666; line-height: 1.6;">${excerpt}</p>
            <a href="${blogUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0066cc; color: white; text-decoration: none; border-radius: 5px; margin-top: 16px;">Read More</a>
            <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              You're receiving this email because you subscribed to TLWD Foundation's newsletter.
              <br>
              <a href="${process.env.FRONTEND_URL}/unsubscribe?email=${subscriber.email}" style="color: #999;">Unsubscribe</a>
            </p>
          </div>
        `,
            })
        );

        const results = await Promise.allSettled(emailPromises);

        // Count successful sends
        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;

        return { successful, failed, total: subscribers.length };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    sendContactEmail,
    sendApplicationConfirmation,
    sendDonationReceipt,
    sendNewsletterWelcome,
    sendNewsletterBroadcast,
};
