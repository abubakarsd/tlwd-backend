const resend = require('../config/resend');

const FROM_EMAIL = `TLWD Foundation <${process.env.FROM_EMAIL || 'onboarding@resend.dev'}>`;

/**
 * Send contact form email
 */
const sendContactEmail = async ({ name, email, subject, message }) => {
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: process.env.EMAIL_SEND || 'contact@tlwdfoundation.org', // Send to admin
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
    return data;
  } catch (error) {
    console.error('Resend Error:', error);
    throw error;
  }
};

/**
 * Send application confirmation email
 */
const sendApplicationConfirmation = async ({ name, email, opportunityTitle }) => {
  try {
    const data = await resend.emails.send({
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
    return data;
  } catch (error) {
    console.error('Resend Error:', error);
    throw error;
  }
};

/**
 * Send donation receipt email
 */
const sendDonationReceipt = async ({ name, email, amount, reference }) => {
  try {
    const data = await resend.emails.send({
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
    return data;
  } catch (error) {
    console.error('Resend Error:', error);
    throw error;
  }
};

/**
 * Send newsletter welcome email
 */
const sendNewsletterWelcome = async (email) => {
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to TLWD Foundation Newsletter! 🔔✨',
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 0; color: #333333;">
          
          <!-- Header Image / Icon Area -->
          <div style="text-align: center; padding: 40px 20px;">
            <div style="display: inline-block; position: relative;">
               <!-- Green Circle Background (Simulation with border-radius) -->
               <div style="
                  background-color: #4ade80; 
                  width: 120px; 
                  height: 120px; 
                  border-radius: 50%; 
                  margin: 0 auto;
                  display: flex;
                  align-items: center;
                  justify-content: center;
               ">
                  <!-- Bell Icon -->
                  <img src="https://cdn-icons-png.flaticon.com/512/1157/1157000.png" alt="Bell" style="width: 60px; height: 60px; display: block; margin: 30px auto;" />
               </div>
            </div>
          </div>

          <!-- Main Content -->
          <div style="text-align: center; padding: 0 30px 40px;">
            <h1 style="color: #1a1a1a; font-size: 24px; font-weight: bold; margin-bottom: 20px;">Welcome to the family! 🎉</h1>
            
            <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 24px;">
              TLWD Foundation is thrilled to have you join us! You've successfully subscribed to our newsletter.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 30px;">
              Get ready for updates on our latest programs, impact stories, and opportunities to make a difference. We are stronger together! 💪
            </p>

            <!-- Call to Action Button -->
            <a href="${process.env.FRONTEND_URL || '#'}" style="
              display: inline-block;
              background-color: #2563eb;
              color: #ffffff;
              font-size: 16px;
              font-weight: bold;
              text-decoration: none;
              padding: 16px 32px;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);
            ">
              Visit Website
            </a>

            <p style="margin-top: 40px; font-size: 14px; color: #9ca3af;">
              If you have any questions, feel free to reply to this email.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
             <p style="font-size: 12px; color: #9ca3af; margin: 0;">
               © ${new Date().getFullYear()} TLWD Foundation. All rights reserved.
             </p>
          </div>
        </div>
      `,
    });
    return data;
  } catch (error) {
    console.error('Resend Error:', error);
    throw error;
  }
};

/**
 * Send newsletter broadcast
 */
/**
 * Send newsletter broadcast
 */
const sendNewsletterBroadcast = async ({ title, body, ctaText, ctaUrl, image, subscribers }) => {
  try {
    // Resend has rate limits, so we process in batches if needed. 
    // For simplicity, we map over subscribers. In production, use queue/batching.
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
            ${image ? `
              <div style="width: 100%; max-height: 300px; overflow: hidden;">
                <img src="${image}" alt="${title}" style="width: 100%; height: auto; object-fit: cover;" />
              </div>
            ` : ''}
            <div style="padding: 30px; background-color: white;">
              <h2 style="color: #333; margin-top: 0; font-size: 22px;">${title}</h2>
              <div style="color: #444; line-height: 1.6; margin-bottom: 25px; font-size: 16px;">
                ${body}
              </div>
              ${ctaUrl ? `
                <div style="text-align: center; margin-top: 30px;">
                  <a href="${ctaUrl}" style="display: inline-block; padding: 14px 35px; background-color: #4d7c0f; color: white; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
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
    console.error('Resend Error:', error);
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
