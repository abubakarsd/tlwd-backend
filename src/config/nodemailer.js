const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_SEND,
        pass: process.env.EMAIL_PASS
    },
    // Force IPv4 to avoid ENETUNREACH errors on some networks with IPv6 issues
    family: 4
});

module.exports = transporter;
