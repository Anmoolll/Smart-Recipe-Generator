# RecipeFinder - AI-Powered Recipe Discovery App

A modern Next.js web application that helps users discover recipes based on ingredients they have, featuring AI-powered image recognition and intelligent recipe matching.

## 🚀 Features

### Core Functionality
- **AI-Powered Ingredient Detection**: Upload photos of ingredients and use Google Vision API to automatically detect them
- **Smart Recipe Matching**: Get recipes ranked by ingredient match percentage
- **Advanced Filtering**: Filter recipes by dietary preferences, difficulty, and cook time
- **Serving Size Adjustment**: Automatically recalculate ingredients and nutrition based on serving size
- **Recipe Ratings & Reviews**: Rate and review recipes with a 5-star system
- **Save Favorite Recipes**: Bookmark recipes for easy access later

### User Experience
- **Responsive Design**: Beautiful, mobile-friendly UI built with Tailwind CSS
- **Dark Mode Support**: Toggle between light and dark themes
- **Skeleton Loading States**: Smooth loading experience with skeleton loaders
- **Error Handling**: Comprehensive error handling with fallbacks
- **Real-time Updates**: Instant feedback with toast notifications

### Authentication & Profile
- **NextAuth Integration**: Secure authentication with credentials and Google OAuth
- **User Profiles**: Manage dietary preferences and account settings
- **Personalized Experience**: Recipe recommendations based on dietary preferences

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animations
- **Lucide React**: Icon library
- **React Hook Form**: Form management

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **NextAuth**: Authentication
- **MongoDB Atlas**: Database
- **Mongoose**: ODM for MongoDB

### AI & External Services
- **Google Cloud Vision API**: Image recognition for ingredient detection
- **bcryptjs**: Password hashing

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- MongoDB Atlas account
- Google Cloud account with Vision API enabled
- (Optional) Google OAuth credentials for social login

## 🔧 Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd recipe-finder-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/recipe-finder?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Google Vision API
GOOGLE_APPLICATION_CREDENTIALS=path-to-your-service-account-key.json
GOOGLE_CLOUD_PROJECT_ID=your-project-id
```

### 4. Set up Google Cloud Vision API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Vision API
4. Create a service account
5. Download the service account key JSON file
6. Place it in your project root (don't commit it!)
7. Update `GOOGLE_APPLICATION_CREDENTIALS` in `.env`

### 5. Set up MongoDB Atlas

1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Whitelist your IP address
4. Get your connection string
5. Update `MONGODB_URI` in `.env`

### 6. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Update `NEXTAUTH_SECRET` in `.env` with the generated value.

### 7. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/                      # Next.js app directory
│   ├── auth/                # Authentication pages
│   ├── profile/             # User profile page
│   ├── recipes/             # Recipe pages
│   ├── saved/               # Saved recipes page
│   ├── search/              # Search page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── providers.tsx        # Client providers
├── components/              # React components
│   ├── FiltersPanel.tsx
│   ├── Footer.tsx
│   ├── IngredientInputModal.tsx
│   ├── Navbar.tsx
│   ├── RecipeCard.tsx
│   ├── RecipeDetailView.tsx
│   ├── RatingSection.tsx
│   └── SkeletonCard.tsx
├── lib/                     # Utility libraries
│   ├── auth.ts             # NextAuth configuration
│   ├── mongodb.ts          # MongoDB connection
│   ├── recipeMatching.ts   # Recipe matching algorithm
│   ├── utils.ts            # Utility functions
│   └── vision.ts           # Google Vision API integration
├── models/                  # Mongoose models
│   ├── Ingredient.ts
│   ├── Recipe.ts
│   └── User.ts
├── pages/api/              # API routes
│   ├── auth/               # Authentication endpoints
│   ├── recipes/            # Recipe endpoints
│   ├── user/               # User endpoints
│   └── vision/             # Image detection endpoint
├── types/                   # TypeScript types
│   └── index.ts
└── public/                  # Static files
```

## 🔌 API Routes

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Sign in (handled by NextAuth)

### Recipes
- `GET /api/recipes` - Get all recipes (with filters)
- `POST /api/recipes` - Create new recipe
- `GET /api/recipes/[id]` - Get recipe by ID
- `PUT /api/recipes/[id]` - Update recipe
- `DELETE /api/recipes/[id]` - Delete recipe
- `POST /api/recipes/[id]/rate` - Rate a recipe
- `POST /api/recipes/match` - Match recipes by ingredients

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/saved-recipes` - Toggle saved recipe

### Vision
- `POST /api/vision/detect` - Detect ingredients from image

## 🎨 Key Features Explained

### Ingredient Detection
Upload a photo and the Google Vision API analyzes it to detect food items. The system filters for food-related labels and presents them as editable chips.

### Recipe Matching Algorithm
The matching algorithm:
1. Compares user's ingredients with recipe requirements
2. Uses fuzzy matching (Levenshtein distance) for similar ingredient names
3. Calculates match percentage
4. Ranks recipes by match percentage

### Serving Size Adjustment
When users change serving size:
- Ingredient quantities are proportionally adjusted
- Nutrition values are recalculated
- Updates happen in real-time

### Dietary Filters
Users can filter recipes by:
- Vegetarian, Vegan
- Gluten-Free, Dairy-Free, Nut-Free
- Keto, Paleo
- Difficulty level (Easy, Medium, Hard)
- Maximum cook time

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy!

Vercel automatically detects Next.js and configures everything.

### Important Notes
- Make sure to add all environment variables in Vercel dashboard
- For Google Vision API, you may need to use base64 encoded credentials
- MongoDB Atlas should allow connections from anywhere (0.0.0.0/0) or add Vercel's IP ranges

## 📝 Additional Features to Consider

The app is designed to be extensible. Consider adding:

1. **Shopping List Generation**: Generate shopping lists from selected recipes
2. **Meal Planning**: Weekly meal planner
3. **Nutrition Tracking**: Track daily nutrition goals
4. **Social Features**: Share recipes, follow users
5. **Recipe Collections**: Curated recipe collections
6. **Advanced Search**: Search by cuisine type, prep method, etc.
7. **Recipe Import**: Import recipes from URLs
8. **Print-Friendly View**: Optimized recipe printing
9. **Ingredient Substitutions**: Suggest ingredient alternatives
10. **Cooking Mode**: Step-by-step cooking instructions with timer

## 🐛 Troubleshooting

### Google Vision API errors
- Verify service account key is correct
- Check if Vision API is enabled in Google Cloud Console
- Ensure billing is enabled (Vision API requires billing account)

### MongoDB connection issues
- Check if IP is whitelisted in MongoDB Atlas
- Verify connection string is correct
- Ensure database user has proper permissions

### NextAuth errors
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your deployment URL
- For Google OAuth, verify redirect URIs are configured

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js, React, MongoDB, and Google Cloud Vision API

