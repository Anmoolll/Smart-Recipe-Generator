# RecipeFinder - Feature Documentation

Complete guide to all features in the RecipeFinder app.

## Table of Contents
- [User Features](#user-features)
- [Recipe Discovery](#recipe-discovery)
- [Authentication](#authentication)
- [Profile Management](#profile-management)
- [Technical Features](#technical-features)

---

## User Features

### 1. Ingredient-Based Recipe Search

**How it works:**
- Users can input ingredients they have in two ways:
  1. **Manual Input**: Type ingredient names one by one
  2. **Photo Upload**: Upload a photo and AI detects ingredients

**Features:**
- AI-powered ingredient detection using Google Vision API
- Editable ingredient chips (add/remove detected items)
- Match percentage shown for each recipe
- Recipes ranked by ingredient availability

**Example Use Cases:**
- "I have chicken, tomatoes, and pasta - what can I make?"
- Take a photo of your fridge contents
- Clear out ingredients before they expire

### 2. Advanced Recipe Filtering

**Filter Options:**
- **Dietary Preferences**: Vegetarian, Vegan, Gluten-Free, Dairy-Free, Nut-Free, Keto, Paleo
- **Difficulty Level**: Easy, Medium, Hard
- **Cook Time**: Slider from 15 to 240 minutes
- **Search Query**: Text search in recipe titles and descriptions

**How it works:**
- Filters can be combined for precise results
- Real-time filtering as you adjust settings
- Filters persist during session

### 3. Recipe Details & Customization

**Recipe View Includes:**
- High-quality recipe image
- Preparation and cook time
- Difficulty level
- Average rating and total reviews
- Serving size adjuster

**Interactive Features:**
- **Serving Size Adjustment**: 
  - Increase/decrease servings
  - Ingredients automatically recalculate
  - Nutrition values update in real-time
  
- **Tabbed Interface**:
  - Ingredients tab with checkboxes
  - Step-by-step instructions
  - Detailed nutrition information

### 4. Recipe Ratings & Smart Suggestions

**Rating Features:**
- Interactive 5-star rating system
- Real-time rating updates
- View all ratings from other users
- Update your rating anytime
- See rating date and history

**Smart Suggestions:**
- Personalized recipe recommendations based on:
  - Your highly rated recipes (4+ stars)
  - Common tags among liked recipes
  - Dietary preferences from rated recipes
  - Overall community ratings
- New users get popular, highly-rated recipes
- Suggestions exclude recipes you've already rated

**Calculation:**
- Average rating calculated automatically
- Total ratings displayed
- Recipes sorted by rating in browse view
- Suggestion algorithm weighs multiple factors:
  - Tag matching from liked recipes
  - Dietary preference patterns
  - Community rating scores
  - Recipe freshness

### 5. Save Favorite Recipes

**How it works:**
- Click heart icon on any recipe card
- Saved recipes accessible from "Saved" page
- One-click unsave from card or saved page
- Synced across devices (same account)

---

## Recipe Discovery

### Browse Mode

**Featured on Home Page:**
- Top-rated recipes
- Recently added recipes
- Beautiful card layout with:
  - Recipe image
  - Title and description
  - Cook time and difficulty
  - Star rating
  - Nutrition summary
  - Dietary tags

### Search Mode

**Smart Matching Algorithm:**
1. Compares your ingredients with recipe requirements
2. Uses fuzzy matching for similar names (e.g., "tomato" matches "cherry tomatoes")
3. Calculates match percentage
4. Shows which ingredients you have vs. need

**Match Percentage Badge:**
- 80-100%: Green (Perfect match!)
- 60-79%: Yellow (Pretty good)
- 40-59%: Orange (Missing some)
- 0-39%: Red (Need many ingredients)

---

## Authentication

### Sign Up

**Options:**
1. **Email/Password**:
   - Secure password hashing with bcrypt
   - Minimum 6 characters
   - Email verification available

2. **Google OAuth**:
   - One-click sign up
   - No password needed
   - Uses your Google profile

### Sign In

- Remember me (session persistence)
- Secure session management with NextAuth
- Auto-redirect to intended page after login

### Session Management

- JWT-based authentication
- Secure HTTP-only cookies
- Auto-refresh on activity
- Sign out from anywhere

---

## Profile Management

### Account Settings

**Editable Fields:**
- Full name
- Email (view-only, set at registration)
- Profile image (from OAuth providers)

### Dietary Preferences

**Available Options:**
- Vegetarian
- Vegan
- Gluten-Free
- Dairy-Free
- Nut-Free
- Keto
- Paleo

**Benefits:**
- Personalized recipe recommendations
- Pre-filtered search results
- Saved for future sessions

### Saved Recipes

**Features:**
- View all saved recipes in one place
- Same card interface as browse mode
- Quick access to favorites
- Remove from saved with one click

---

## Technical Features

### AI-Powered Image Recognition

**Technology:** Google Cloud Vision API

**Capabilities:**
- Label detection for food items
- Confidence scoring
- Food categorization
- Multiple ingredient detection from single image

**Processing:**
1. User uploads image
2. Image sent to Google Vision API
3. Labels filtered for food items
4. Results presented as editable chips
5. User can remove incorrect detections

### Smart Recipe Matching

**Algorithm Features:**
- **Exact Matching**: Direct name comparison
- **Partial Matching**: Substring detection
- **Fuzzy Matching**: Levenshtein distance calculation
- **Confidence Threshold**: 70% similarity required

**Example:**
```
User has: ["chicken", "tomatoes", "garlic"]
Recipe needs: ["chicken breast", "cherry tomatoes", "garlic cloves", "olive oil"]

Match: 75% (3 out of 4 ingredients)
```

### Nutrition Calculation

**Per Recipe:**
- Calories
- Protein (g)
- Carbohydrates (g)
- Fat (g)
- Fiber (g) - optional
- Sugar (g) - optional
- Sodium (mg) - optional

**Dynamic Recalculation:**
- Values adjust with serving size
- Formula: `new_value = original_value * (new_servings / original_servings)`
- Rounded appropriately for display

### Responsive Design

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Features:**
- Mobile-first design
- Touch-optimized interactions
- Collapsible navigation menu
- Responsive grid layouts

### Dark Mode

**Implementation:**
- System preference detection
- Manual toggle available
- Persists user choice
- Smooth transitions
- All components support both themes

### Loading States

**Skeleton Loaders:**
- Recipe cards
- Profile information
- Search results

**Spinners:**
- Form submissions
- Image uploads
- API calls

### Error Handling

**User-Facing:**
- Toast notifications for errors
- Fallback UI for failed components
- Helpful error messages

**Technical:**
- Try-catch blocks on API calls
- Graceful degradation
- Error logging (console)
- Network error handling

### Performance Optimizations

**Image Optimization:**
- Next.js Image component
- Automatic WebP conversion
- Lazy loading
- Responsive images

**Code Splitting:**
- Automatic route-based splitting
- Dynamic imports where needed
- Optimized bundle sizes

**Database:**
- MongoDB indexes on common queries
- Lean queries for better performance
- Pagination support

---

## API Architecture

### RESTful Endpoints

**Recipes:**
- `GET /api/recipes` - List all recipes
- `POST /api/recipes` - Create recipe
- `GET /api/recipes/[id]` - Get single recipe
- `PUT /api/recipes/[id]` - Update recipe
- `DELETE /api/recipes/[id]` - Delete recipe
- `POST /api/recipes/[id]/rate` - Rate recipe
- `GET /api/recipes/[id]/rate` - Get user's rating for recipe
- `GET /api/recipes/suggestions` - Get personalized suggestions
- `POST /api/recipes/match` - Match recipes by ingredients

**Users:**
- `POST /api/auth/signup` - Register
- `GET /api/user/profile` - Get profile
- `PUT /api/user/profile` - Update profile
- `POST /api/user/saved-recipes` - Toggle saved recipe

**Vision:**
- `POST /api/vision/detect` - Detect ingredients from image

### Authentication Middleware

- Session verification
- Protected routes
- User context in requests

---

## Future Enhancement Ideas

### Already Suggested:
- Shopping list generation
- Meal planning calendar
- Recipe sharing & social features
- Advanced nutrition tracking
- Recipe collections/cookbooks

### Additional Ideas:
- Recipe import from URLs
- Barcode scanning for ingredients
- Voice input for hands-free cooking
- Timer integration
- Cooking mode with larger text
- Print-friendly recipe view
- Ingredient substitution suggestions
- Cooking tips and techniques
- Video tutorials
- Community recipe contributions
- Recipe difficulty auto-calculation
- Seasonal recipe recommendations
- Cost estimation per recipe
- Leftover management
- Allergen warnings

---

## Best Practices for Users

### Getting the Best Results:

1. **Photo Quality:**
   - Good lighting
   - Clear focus
   - Show ingredients clearly
   - One photo can detect multiple items

2. **Manual Entry:**
   - Use common names ("chicken breast" not "poultry")
   - Singular or plural works ("tomato" or "tomatoes")
   - Be specific when needed ("brown rice" vs "rice")

3. **Filters:**
   - Start broad, then narrow down
   - Combine dietary filters as needed
   - Adjust cook time based on available time

4. **Saving Recipes:**
   - Save recipes you want to try
   - Use as a personal cookbook
   - Review saved recipes before grocery shopping

---

## Developer Notes

### Adding New Features:

1. **New Dietary Option:**
   - Add to `DietaryInfo` type in `types/index.ts`
   - Update `Recipe` and `User` models
   - Add to filters panel
   - Update seed data

2. **New Recipe Field:**
   - Update `IRecipe` interface in `models/Recipe.ts`
   - Add to recipe form
   - Update display components
   - Consider MongoDB migration

3. **New API Endpoint:**
   - Create in `pages/api/`
   - Add authentication if needed
   - Update types
   - Add error handling

### Testing Checklist:

- [ ] Image upload works
- [ ] Ingredient detection accurate
- [ ] Recipe matching calculates correctly
- [ ] Filters apply properly
- [ ] Serving size adjustment works
- [ ] Ratings save correctly
- [ ] Authentication flow complete
- [ ] Responsive on mobile
- [ ] Dark mode works
- [ ] Error states display

---

For technical setup, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

For quick start, see [QUICKSTART.md](./QUICKSTART.md)

