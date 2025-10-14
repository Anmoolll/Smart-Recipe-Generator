import mongoose, { Schema, models } from 'mongoose';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
  dietaryPreferences?: {
    vegetarian?: boolean;
    vegan?: boolean;
    glutenFree?: boolean;
    dairyFree?: boolean;
    nutFree?: boolean;
    keto?: boolean;
    paleo?: boolean;
  };
  savedRecipes: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      select: false,
    },
    image: String,
    dietaryPreferences: {
      vegetarian: { type: Boolean, default: false },
      vegan: { type: Boolean, default: false },
      glutenFree: { type: Boolean, default: false },
      dairyFree: { type: Boolean, default: false },
      nutFree: { type: Boolean, default: false },
      keto: { type: Boolean, default: false },
      paleo: { type: Boolean, default: false },
    },
    savedRecipes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Recipe',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

