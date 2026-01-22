# MongoDB Atlas IP Whitelist Configuration

## Issue
Your server cannot connect to MongoDB Atlas because the deployment server's IP address is not whitelisted.

## Solution

### Option 1: Whitelist Specific IP (Recommended for Production)
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Select your cluster
3. Click on "Network Access" in the left sidebar
4. Click "Add IP Address"
5. Add your deployment server's IP address
6. Click "Confirm"

### Option 2: Allow Access from Anywhere (Development Only)
⚠️ **Warning**: Only use this for development/testing

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Select your cluster
3. Click on "Network Access"
4. Click "Add IP Address"
5. Click "Allow Access from Anywhere" (0.0.0.0/0)
6. Click "Confirm"

## For Deployment Platforms

### Railway/Render/Heroku
These platforms use dynamic IPs. You have two options:
1. **Allow all IPs** (0.0.0.0/0) - easier but less secure
2. **Use their static IP addon** - more secure but may cost extra

### Vercel/Netlify (Serverless)
These platforms require allowing all IPs (0.0.0.0/0) due to their serverless nature.

## After Whitelisting
1. Wait 1-2 minutes for changes to propagate
2. Restart your server
3. The connection should work

## Current MongoDB URI
Check your `.env` file to ensure the connection string is correct:
```
MONGODB_URI=mongodb+srv://intelsiabubakar_db_user:640DzQXJ3cagWFsK@tlwddb.fohg37r.mongodb.net/?appName=tlwdDB
```
