import mongoose, { Schema, models } from 'mongoose';

export interface IIngredientMetadata {
  _id: string;
  name: string;
  category: string;
  commonUnits: string[];
  aliases: string[];
  nutritionPer100g?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
  };
  dietaryInfo?: {
    vegetarian?: boolean;
    vegan?: boolean;
    glutenFree?: boolean;
    dairyFree?: boolean;
    nutFree?: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const IngredientMetadataSchema = new Schema<IIngredientMetadata>(
  {
    name: {
      type: String,
      required: [true, 'Ingredient name is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Vegetables',
        'Fruits',
        'Grains',
        'Proteins',
        'Dairy',
        'Oils & Fats',
        'Spices & Herbs',
        'Condiments',
        'Beverages',
        'Other',
      ],
    },
    commonUnits: [String],
    aliases: [String],
    nutritionPer100g: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
      fiber: Number,
    },
    dietaryInfo: {
      vegetarian: { type: Boolean, default: true },
      vegan: { type: Boolean, default: false },
      glutenFree: { type: Boolean, default: true },
      dairyFree: { type: Boolean, default: true },
      nutFree: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

// Index for searching
IngredientMetadataSchema.index({ name: 'text', aliases: 'text' });

const IngredientMetadata =
  models.IngredientMetadata ||
  mongoose.model<IIngredientMetadata>('IngredientMetadata', IngredientMetadataSchema);

export default IngredientMetadata;

