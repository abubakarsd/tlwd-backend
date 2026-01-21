require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const createAdminUser = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@tlwd.org' });

        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            name: 'Admin',
            email: 'admin@tlwd.org',
            password: 'admin123', // Change this password after first login
            role: 'super-admin',
        });

        console.log('Admin user created successfully');
        console.log('Email: admin@tlwd.org');
        console.log('Password: admin123');
        console.log('⚠️  IMPORTANT: Change this password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
};

createAdminUser();
