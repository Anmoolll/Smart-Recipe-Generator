import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await connectDB();

    if (req.method === 'POST') {
      const { recipeId } = req.body;

      if (!recipeId) {
        return res.status(400).json({ message: 'Recipe ID is required' });
      }

      const user = await User.findById(session.user.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Normalize ObjectId comparison to strings
      const recipeIdStr = recipeId.toString();
      const recipeIndex = user.savedRecipes.findIndex((id: any) => id.toString() === recipeIdStr);

      if (recipeIndex > -1) {
        // Remove from saved recipes
        user.savedRecipes.splice(recipeIndex, 1);
      } else {
        // Add to saved recipes
        user.savedRecipes.push(recipeId);
      }

      await user.save();

      return res.status(200).json({ 
        saved: recipeIndex === -1,
        savedRecipes: user.savedRecipes 
      });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Saved recipes API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

