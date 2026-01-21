# Quick Setup Guide

## Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Cloudinary account
- Resend account
- Paystack account

## Setup Steps

### 1. Install Dependencies
```bash
cd tlwd-backend
npm install
```

### 2. Environment Configuration
Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
- MongoDB connection string
- JWT secret (generate a random string)
- Cloudinary credentials (from dashboard)
- Resend API key (from dashboard)
- Paystack keys (test keys for development)
- Frontend URLs

### 3. Create Admin User
```bash
npm run seed
```

Login credentials:
- Email: `admin@tlwd.org`
- Password: `admin123`

### 4. Start Development Server
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### 5. Test the API
```bash
# Health check
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tlwd.org","password":"admin123"}'
```

## Next Steps
1. Update frontend API base URL to `http://localhost:5000/api`
2. Implement authentication in frontend
3. Connect all CRUD operations
4. Test file uploads
5. Test Paystack integration

## Production Deployment
1. Set up MongoDB Atlas
2. Use production Cloudinary account
3. Use production Resend API key
4. Use Paystack live keys
5. Deploy to hosting service
6. Update CORS origins
7. Enable HTTPS
