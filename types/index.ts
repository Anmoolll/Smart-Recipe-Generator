export interface Recipe {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  cookTime: number;
  prepTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: Ingredient[];
  instructions: string[];
  nutrition: Nutrition;
  tags: string[];
  dietary: DietaryInfo;
  ratings: Rating[];
  averageRating: number;
  totalRatings: number;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  category?: string;
}

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface DietaryInfo {
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  dairyFree?: boolean;
  nutFree?: boolean;
  keto?: boolean;
  paleo?: boolean;
}

export interface Rating {
  userId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  dietaryPreferences?: DietaryInfo;
  savedRecipes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchFilters {
  dietary?: string[];
  difficulty?: string[];
  maxCookTime?: number;
  ingredients?: string[];
  searchQuery?: string;
}

export interface DetectedIngredient {
  name: string;
  confidence: number;
  category?: string;
}

