# TLWD Foundation Backend API

A comprehensive REST API for the TLWD Foundation platform built with Node.js, Express, MongoDB, and integrated with Cloudinary, Resend, and Paystack.

## Features

- 🔐 JWT Authentication
- 📝 Complete CRUD operations for all resources
- 📤 File uploads with Cloudinary
- 📧 Email notifications with Resend
- 💳 Payment processing with Paystack
- 📊 Dashboard analytics
- 🔍 Pagination and filtering
- 📥 CSV export functionality

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **File Storage**: Cloudinary
- **Email**: Resend
- **Payment**: Paystack

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your credentials:
   - MongoDB URI
   - JWT Secret
   - Cloudinary credentials
   - Resend API key
   - Paystack keys
   - Frontend URLs

5. Create admin user:
```bash
npm run seed
```

6. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token

### Admin Endpoints (Protected)
All admin routes require authentication and admin role.

- **Hero Slides**: `/api/admin/hero-slides`
- **Programs**: `/api/admin/programs`
- **Impact Stories**: `/api/admin/impact-stories`
- **Blog**: `/api/admin/blog`
- **Team**: `/api/admin/team`
- **Partners**: `/api/admin/partners`
- **Opportunities**: `/api/admin/opportunities`
- **Applications**: `/api/admin/applications`
- **Donations**: `/api/admin/donations`
- **Resources**: `/api/admin/resources`
- **Subscribers**: `/api/admin/subscribers`
- **Dashboard**: `/api/admin/dashboard`

### Public Endpoints
- **Hero Slides**: `GET /api/hero-slides`
- **Programs**: `GET /api/programs`
- **Impact Stories**: `GET /api/impact-stories`
- **Blog**: `GET /api/blog`
- **Team**: `GET /api/team`
- **Partners**: `GET /api/partners`
- **Opportunities**: `GET /api/opportunities`
- **Apply**: `POST /api/opportunities/:id/apply`
- **Donations**: `POST /api/donations/initialize`, `GET /api/donations/verify/:reference`
- **Contact**: `POST /api/contact`
- **Newsletter**: `POST /api/subscribe`, `POST /api/unsubscribe`

## Default Admin Credentials

After running the seed script:
- **Email**: admin@tlwd.org
- **Password**: admin123

⚠️ **IMPORTANT**: Change this password immediately after first login!

## Environment Variables

See `.env.example` for all required environment variables.

## Project Structure

```
tlwd-backend/
├── src/
│   ├── config/          # Configuration files
│   ├── models/          # Mongoose models
│   ├── controllers/     # Route controllers
│   ├── routes/          # Express routes
│   ├── middleware/      # Custom middleware
│   ├── services/        # External services
│   ├── utils/           # Utility functions
│   └── app.js           # Express app
├── server.js            # Entry point
├── seed.js              # Database seeder
└── package.json
```

## License

MIT
