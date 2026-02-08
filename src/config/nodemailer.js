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
    // Custom lookup function to strictly force IPv4
    // This bypasses potential environment-specific DNS behaviors that favor IPv6
    lookup: (hostname, options, callback) => {
        dns.lookup(hostname, { family: 4, hints: dns.ADDRCONFIG | dns.V4MAPPED }, callback);
    }
});

module.exports = transporter;
