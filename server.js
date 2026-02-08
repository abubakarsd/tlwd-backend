require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');
const transporter = require('./src/config/nodemailer');

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Start server
app.listen(PORT, async () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);

    // Verify SMTP connection
    try {
        await transporter.verify();
        console.log('SMTP connection established successfully');
    } catch (error) {
        console.error('SMTP connection failed:', error);
    }
});
