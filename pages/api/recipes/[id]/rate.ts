import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await connectDB();

    const { id } = req.query;
    const { rating, comment } = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid recipe ID' });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if user already rated this recipe
    const existingRatingIndex = recipe.ratings.findIndex(
      (r: any) => r.userId.toString() === session.user.id
    );

    if (existingRatingIndex !== -1) {
      // Update existing rating
      recipe.ratings[existingRatingIndex] = {
        userId: session.user.id,
        rating,
        comment,
        createdAt: new Date(),
      };
    } else {
      // Add new rating
      recipe.ratings.push({
        userId: session.user.id,
        rating,
        comment,
        createdAt: new Date(),
      });
    }

    // Recalculate average rating
    const totalRating = recipe.ratings.reduce((sum: number, r: any) => sum + r.rating, 0);
    recipe.averageRating = totalRating / recipe.ratings.length;
    recipe.totalRatings = recipe.ratings.length;

    await recipe.save();

    return res.status(200).json({ recipe });
  } catch (error) {
    console.error('Rating API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

