const { sendNewsletterBroadcast } = require('./src/services/emailService');
require('dotenv').config();

const testBroadcast = async () => {
    try {
        console.log('Sending test broadcast via Resend...');
        // Mock a subscriber
        const subscribers = [{ email: process.env.EMAIL_SEND || 'contact@tlwdfoundation.org' }];

        const result = await sendNewsletterBroadcast({
            title: 'Test Broadcast',
            body: 'This is a test broadcast message.',
            ctaText: 'Read More',
            ctaUrl: 'https://tlwdfoundation.org',
            subscribers
        });
        console.log('Broadcast sent successfully:', result);
    } catch (error) {
        console.error('Error sending broadcast:', error);
    }
};

testBroadcast();
