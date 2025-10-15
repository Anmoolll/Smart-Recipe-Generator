import mongoose, { Schema, models, Types } from 'mongoose';

export interface IRating {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  recipe: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RatingSchema = new Schema<IRating>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    recipe: {
      type: Schema.Types.ObjectId,
      ref: 'Recipe',
      required: [true, 'Recipe ID is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
    },
    comment: {
      type: String,
      maxlength: [500, 'Comment cannot be longer than 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only rate a recipe once (can update their rating though)
RatingSchema.index({ user: 1, recipe: 1 }, { unique: true });

// Add index for quick recipe rating lookups
RatingSchema.index({ recipe: 1 });

const Rating = models.Rating || mongoose.model<IRating>('Rating', RatingSchema);

export default Rating;
