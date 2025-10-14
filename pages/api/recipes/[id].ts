import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid recipe ID' });
    }

    if (req.method === 'GET') {
      const recipe = await Recipe.findById(id)
        .populate('ratings.userId', 'name image')
        .lean();

      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }

      return res.status(200).json({ recipe });
    }

    if (req.method === 'PUT') {
      const session = await getServerSession(req, res, authOptions);

      if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const recipe = await Recipe.findById(id);

      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }

      if (recipe.createdBy?.toString() !== session.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      const updatedRecipe = await Recipe.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      return res.status(200).json({ recipe: updatedRecipe });
    }

    if (req.method === 'DELETE') {
      const session = await getServerSession(req, res, authOptions);

      if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const recipe = await Recipe.findById(id);

      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }

      if (recipe.createdBy?.toString() !== session.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      await Recipe.findByIdAndDelete(id);

      return res.status(200).json({ message: 'Recipe deleted successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Recipe API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

