# RecipeFinder - Complete Setup Guide

This guide will walk you through setting up the RecipeFinder application from scratch.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [MongoDB Atlas Setup](#mongodb-atlas-setup)
3. [Google Cloud Vision API Setup](#google-cloud-vision-api-setup)
4. [Google OAuth Setup (Optional)](#google-oauth-setup-optional)
5. [Local Development Setup](#local-development-setup)
6. [Seeding the Database](#seeding-the-database)
7. [Deployment to Vercel](#deployment-to-vercel)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, make sure you have:
- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- A **MongoDB Atlas** account (free tier available)
- A **Google Cloud** account (free credits available)
- Basic knowledge of React and Next.js

---

## MongoDB Atlas Setup

### Step 1: Create Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free" and create an account
3. Choose the **Free Shared Cluster** option

### Step 2: Create Cluster
1. Select your cloud provider (AWS, Google Cloud, or Azure)
2. Choose a region close to your users
3. Click "Create Cluster" (takes 3-5 minutes)

### Step 3: Create Database User
1. Go to **Database Access** in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and strong password
5. Set "Database User Privileges" to "Read and write to any database"
6. Click "Add User"

### Step 4: Whitelist IP Address
1. Go to **Network Access** in the left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your specific IP addresses
5. Click "Confirm"

### Step 5: Get Connection String
1. Go to **Database** in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `myFirstDatabase` with `recipe-finder`

Example:
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/recipe-finder?retryWrites=true&w=majority
```

---

## Google Cloud Vision API Setup

### Step 1: Create Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "RecipeFinder" or similar
4. Click "Create"

### Step 2: Enable Vision API
1. In the search bar, type "Vision API"
2. Click on "Cloud Vision API"
3. Click "Enable"
4. You may need to enable billing (Google offers $300 free credits)

### Step 3: Create Service Account
1. Go to "IAM & Admin" → "Service Accounts"
2. Click "Create Service Account"
3. Name: `recipe-finder-vision`
4. Description: "Service account for Vision API"
5. Click "Create and Continue"
6. Role: Select "Project" → "Editor"
7. Click "Continue" → "Done"

### Step 4: Create Key
1. Find your service account in the list
2. Click the three dots (⋮) → "Manage keys"
3. Click "Add Key" → "Create new key"
4. Choose "JSON" format
5. Click "Create"
6. The JSON file will download automatically

### Step 5: Configure Key
1. Rename the downloaded file to something simple (e.g., `google-vision-key.json`)
2. Move it to your project root directory
3. **IMPORTANT**: Add this file to `.gitignore` (already done in this project)
4. Never commit this file to Git!

---

## Google OAuth Setup (Optional)

### Step 1: Configure OAuth Consent Screen
1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type
3. Fill in:
   - App name: "RecipeFinder"
   - User support email: Your email
   - Developer contact: Your email
4. Click "Save and Continue"
5. Skip "Scopes" and "Test users" for now
6. Click "Save and Continue"

### Step 2: Create OAuth Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: "Web application"
4. Name: "RecipeFinder Web Client"
5. Authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - Your production URL (e.g., `https://recipefinder.vercel.app`)
6. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Click "Create"
8. Copy the Client ID and Client Secret

---

## Local Development Setup

### Step 1: Clone and Install
```bash
# Clone the repository (or use your existing code)
cd recipe-finder-app

# Install dependencies
npm install
```

### Step 2: Environment Variables
1. Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and fill in your values:
```env
# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/recipe-finder

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=run_openssl_rand_base64_32_to_generate_this

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Google Vision
GOOGLE_APPLICATION_CREDENTIALS=./google-vision-key.json
GOOGLE_CLOUD_PROJECT_ID=recipefinder-123456
```

### Step 3: Generate NextAuth Secret
```bash
# On Mac/Linux
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Copy the output and paste it as `NEXTAUTH_SECRET` in `.env.local`

### Step 4: Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Seeding the Database

To populate your database with sample recipes:

### Option 1: Using the Seed Script
```bash
# Add ts-node as dev dependency
npm install -D ts-node @types/node

# Run seed script
npx ts-node scripts/seed.ts
```

### Option 2: Manual Creation
1. Sign up for an account on your local app
2. Use the app to create recipes manually through the UI
3. Upload images and add ingredients

---

## Deployment to Vercel

### Step 1: Prepare for Deployment
1. Ensure all environment variables are set
2. Test the app locally
3. Commit your code to Git (excluding `.env.local` and service account keys)

### Step 2: Deploy to Vercel
1. Go to [Vercel](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your repository
5. Configure project:
   - Framework: Next.js (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Step 3: Environment Variables
Add all environment variables from `.env.local`:

1. In Vercel dashboard, go to "Settings" → "Environment Variables"
2. Add each variable:
   - `MONGODB_URI`
   - `NEXTAUTH_URL` (use your Vercel URL: `https://your-app.vercel.app`)
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_CLOUD_PROJECT_ID`

### Step 4: Google Vision API on Vercel
For the service account key on Vercel:

**Option A: Base64 Encoding (Recommended)**
```bash
# Encode the JSON file
cat google-vision-key.json | base64
```

Then in your code (`lib/vision.ts`), decode it:
```typescript
const credentials = process.env.GOOGLE_CREDENTIALS_BASE64
  ? JSON.parse(Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString())
  : undefined;

visionClient = new vision.ImageAnnotatorClient({
  credentials,
});
```

Add `GOOGLE_CREDENTIALS_BASE64` to Vercel environment variables.

**Option B: Direct JSON**
Add the entire JSON content as an environment variable:
```
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account",...}
```

### Step 5: Update OAuth Redirect URIs
1. Go to Google Cloud Console
2. Update OAuth credentials with your Vercel URL:
   - `https://your-app.vercel.app/api/auth/callback/google`

### Step 6: Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Visit your app at the provided URL

---

## Troubleshooting

### MongoDB Connection Issues
**Problem**: Can't connect to MongoDB
**Solutions**:
- Verify connection string is correct
- Check if IP is whitelisted (0.0.0.0/0 for development)
- Ensure database user has correct permissions
- Try connecting with MongoDB Compass to test credentials

### Google Vision API Errors
**Problem**: "Google Vision API failed"
**Solutions**:
- Verify Vision API is enabled in Google Cloud Console
- Check if billing is enabled (required for Vision API)
- Ensure service account has correct permissions
- Verify the JSON key file path is correct
- Check if the key file is valid JSON

### NextAuth Errors
**Problem**: Authentication not working
**Solutions**:
- Verify `NEXTAUTH_SECRET` is set and at least 32 characters
- Check `NEXTAUTH_URL` matches your current URL
- For Google OAuth, verify redirect URIs are configured
- Clear browser cookies and try again

### Image Upload Issues
**Problem**: Image upload fails
**Solutions**:
- Check file size (Next.js has a default 4MB limit)
- Verify formidable is installed (`npm install formidable`)
- Check API route configuration (bodyParser: false)
- Look for errors in browser console and server logs

### Build Errors on Vercel
**Problem**: Deployment fails
**Solutions**:
- Check build logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify all environment variables are set
- Test build locally: `npm run build`
- Check for TypeScript errors: `npm run lint`

### Slow Performance
**Problem**: App is slow
**Solutions**:
- Enable MongoDB indexes (automatically created by models)
- Use image optimization (already configured with Next.js Image)
- Consider CDN for images (Vercel does this automatically)
- Monitor Vision API usage and cache results

---

## Getting Help

- **Documentation**: Check README.md for feature documentation
- **Issues**: Open an issue on GitHub
- **Community**: Join Next.js Discord or MongoDB Community
- **Professional Help**: Consider hiring a developer if needed

---

## Next Steps

After setup:
1. ✅ Create your first user account
2. ✅ Add some recipes using the seed script
3. ✅ Test ingredient detection with photos
4. ✅ Customize the UI to match your brand
5. ✅ Add your own recipes
6. ✅ Share with friends and get feedback!

Enjoy building with RecipeFinder! 🍳

