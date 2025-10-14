# Quick Start Guide

Get RecipeFinder up and running in 5 minutes!

## Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free)
- Google Cloud account (free tier)

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Environment Variables

Copy the example file:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:

### MongoDB (Required)
1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string and add to `.env.local`

### NextAuth (Required)
Generate a secret:
```bash
openssl rand -base64 32
```
Add to `.env.local` as `NEXTAUTH_SECRET`

### Google Vision API (Required)
1. Create project at [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Vision API
3. Create service account and download JSON key
4. Save as `google-vision-key.json` in project root
5. Add path to `.env.local`

### Google OAuth (Optional)
Only needed if you want Google sign-in:
1. Set up OAuth in Google Cloud Console
2. Add credentials to `.env.local`

## 3. Seed Sample Data (Optional)

```bash
npm run seed
```

This adds 4 sample recipes to your database.

## 4. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 5. Create Your First Account

1. Click "Sign In" in the navbar
2. Click "Sign up" 
3. Enter your details
4. You're ready to go!

## What's Next?

- **Find Recipes**: Click "Find Recipes Now" and upload a photo or type ingredients
- **Browse Recipes**: Explore the featured recipes on the home page
- **Save Favorites**: Click the heart icon to save recipes
- **Rate Recipes**: Leave ratings and reviews
- **Update Profile**: Set your dietary preferences

## Common Issues

### "Can't connect to MongoDB"
- Check your connection string in `.env.local`
- Verify IP is whitelisted (use 0.0.0.0/0 for development)

### "Vision API error"
- Make sure Vision API is enabled in Google Cloud
- Check if billing is enabled (required but has free tier)
- Verify service account key path

### "NextAuth error"
- Ensure `NEXTAUTH_SECRET` is set and 32+ characters
- Check `NEXTAUTH_URL` is `http://localhost:3000`

## Need More Help?

See detailed instructions in [SETUP_GUIDE.md](./SETUP_GUIDE.md)

Enjoy! 🍳

