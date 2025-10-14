import mongoose, { Schema, models } from 'mongoose';

export interface INutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface IIngredient {
  name: string;
  amount: number;
  unit: string;
  category?: string;
}

export interface IRecipe {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  cookTime: number; // in minutes
  prepTime: number; // in minutes
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: IIngredient[];
  instructions: string[];
  nutrition: INutrition;
  tags: string[];
  dietary: {
    vegetarian?: boolean;
    vegan?: boolean;
    glutenFree?: boolean;
    dairyFree?: boolean;
    nutFree?: boolean;
    keto?: boolean;
    paleo?: boolean;
  };
  ratings: {
    userId: string;
    rating: number;
    comment?: string;
    createdAt: Date;
  }[];
  averageRating: number;
  totalRatings: number;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RecipeSchema = new Schema<IRecipe>(
  {
    title: {
      type: String,
      required: [true, 'Recipe title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Recipe description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    imageUrl: String,
    cookTime: {
      type: Number,
      required: [true, 'Cook time is required'],
      min: [0, 'Cook time cannot be negative'],
    },
    prepTime: {
      type: Number,
      required: [true, 'Prep time is required'],
      min: [0, 'Prep time cannot be negative'],
    },
    servings: {
      type: Number,
      required: [true, 'Servings is required'],
      min: [1, 'Servings must be at least 1'],
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: [true, 'Difficulty level is required'],
    },
    ingredients: [
      {
        name: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        unit: {
          type: String,
          required: true,
        },
        category: String,
      },
    ],
    instructions: [
      {
        type: String,
        required: true,
      },
    ],
    nutrition: {
      calories: { type: Number, required: true },
      protein: { type: Number, required: true },
      carbs: { type: Number, required: true },
      fat: { type: Number, required: true },
      fiber: Number,
      sugar: Number,
      sodium: Number,
    },
    tags: [String],
    dietary: {
      vegetarian: { type: Boolean, default: false },
      vegan: { type: Boolean, default: false },
      glutenFree: { type: Boolean, default: false },
      dairyFree: { type: Boolean, default: false },
      nutFree: { type: Boolean, default: false },
      keto: { type: Boolean, default: false },
      paleo: { type: Boolean, default: false },
    },
    ratings: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Index for searching and filtering
RecipeSchema.index({ title: 'text', description: 'text', tags: 'text' });
RecipeSchema.index({ cookTime: 1, difficulty: 1 });
RecipeSchema.index({ averageRating: -1 });

const Recipe = models.Recipe || mongoose.model<IRecipe>('Recipe', RecipeSchema);

export default Recipe;

