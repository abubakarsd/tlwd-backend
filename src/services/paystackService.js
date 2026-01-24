const axios = require('axios');

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

/**
 * Initialize payment
 */
const initializePayment = async ({ email, amount, reference }) => {
    try {
        const response = await axios.post(
            `${PAYSTACK_BASE_URL}/transaction/initialize`,
            {
                email,
                amount: amount * 100, // Convert to kobo
                reference,
                callback_url: `${process.env.FRONTEND_URL}/donate/verify`,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Verify payment
 */
const verifyPayment = async (reference) => {
    try {
        const response = await axios.get(
            `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(`[DEBUG] Paystack Verify Error for ${reference}:`, error.response?.data || error.message);
        throw error;
    }
};

module.exports = {
    initializePayment,
    verifyPayment,
};
