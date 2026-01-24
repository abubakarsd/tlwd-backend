const resend = require('../config/resend');

const FROM_EMAIL = `TLWD Foundation <${process.env.ADMIN_EMAIL || 'noreply@tlwdfoundation.org'}>`;

/**
 * Send contact form email
 */
const sendContactEmail = async ({ name, email, subject, message }) => {
    try {
        const result = await resend.emails.send({
            from: FROM_EMAIL,
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
            from: FROM_EMAIL,
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
            from: FROM_EMAIL,
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
            from: FROM_EMAIL,
            to: email,
            subject: 'Welcome to TLWD Foundation Newsletter',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded: 10px;">
          <h2 style="color: #4d7c0f;">Welcome to our newsletter!</h2>
          <p>Thank you for subscribing to TLWD Foundation's newsletter.</p>
          <p>You'll receive updates about our programs, impact stories, and upcoming events.</p>
          <br>
          <p>Best regards,</p>
          <p><strong>TLWD Foundation Team</strong></p>
        </div>
      `,
        });
        return result;
    } catch (error) {
        throw error;
    }
};

/**
 * Send newsletter broadcast
 */
const sendNewsletterBroadcast = async ({ title, body, ctaText, ctaUrl, subscribers }) => {
    try {
        const emailPromises = subscribers.map(subscriber =>
            resend.emails.send({
                from: FROM_EMAIL,
                to: subscriber.email,
                subject: title,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #4d7c0f; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">TLWD Foundation</h1>
            </div>
            <div style="padding: 30px; background-color: white;">
              <h2 style="color: #333; margin-top: 0;">${title}</h2>
              <div style="color: #555; line-height: 1.6; margin-bottom: 25px;">
                ${body}
              </div>
              ${ctaUrl ? `
                <div style="text-align: center;">
                  <a href="${ctaUrl}" style="display: inline-block; padding: 12px 30px; background-color: #4d7c0f; color: white; text-decoration: none; border-radius: 30px; font-weight: bold;">
                    ${ctaText || 'Read More'}
                  </a>
                </div>
              ` : ''}
            </div>
            <div style="background-color: #f9f9f9; padding: 20px; text-align: center; color: #999; font-size: 12px;">
              <p>You're receiving this because you subscribed to TLWD Foundation updates.</p>
              <p><a href="${process.env.FRONTEND_URL}/unsubscribe" style="color: #999;">Unsubscribe</a></p>
            </div>
          </div>
        `,
            })
        );

        const results = await Promise.allSettled(emailPromises);
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
