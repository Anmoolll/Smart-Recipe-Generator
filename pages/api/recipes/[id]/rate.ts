import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Rating from '@/models/Rating';
import Recipe from '@/models/Recipe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Recipe ID is required' });
  }

  await dbConnect();

  switch (req.method) {
    case 'POST':
      try {
        const { rating, comment } = req.body;
        
        if (!rating || rating < 1 || rating > 5) {
          return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        // Check if recipe exists
        const recipe = await Recipe.findById(id);
        if (!recipe) {
          return res.status(404).json({ message: 'Recipe not found' });
        }

        // Upsert the rating (create or update)
        const updatedRating = await Rating.findOneAndUpdate(
          { user: session.user.id, recipe: id },
          { rating, comment },
          { upsert: true, new: true, runValidators: true }
        );

        // Calculate and update average rating
        const ratings = await Rating.find({ recipe: id });
        const avgRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;
        
        await Recipe.findByIdAndUpdate(id, { 
          averageRating: Math.round(avgRating * 10) / 10,
          totalRatings: ratings.length 
        });

        return res.status(200).json(updatedRating);
      } catch (error) {
        console.error('Rating error:', error);
        return res.status(500).json({ message: 'Failed to rate recipe' });
      }
      break;

    case 'GET':
      try {
        const rating = await Rating.findOne({
          user: session.user.id,
          recipe: id,
        });
        
        if (!rating) {
          return res.status(404).json({ message: 'Rating not found' });
        }

        return res.status(200).json(rating);
      } catch (error) {
        console.error('Get rating error:', error);
        return res.status(500).json({ message: 'Failed to get rating' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}