import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import Rating from '@/models/Rating';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    await dbConnect();

    // Get user's highly rated recipes (4+ stars)
    const userRatings = await Rating.find({
      user: session.user.id,
      rating: { $gte: 4 },
    }).populate('recipe');

    if (userRatings.length === 0) {
      // If no ratings, return highly rated recipes in general
      const topRecipes = await Recipe.find({
        averageRating: { $gte: 4 },
        totalRatings: { $gte: 5 },
      })
        .sort({ averageRating: -1, totalRatings: -1 })
        .limit(10);

      return res.status(200).json(topRecipes);
    }

    // Extract preferences from highly rated recipes
    const preferredTags = new Set<string>();
    const preferredDietary: Record<string, number> = {};
    const ratedRecipeIds = new Set<string>();

    userRatings.forEach((rating) => {
      const recipe = rating.recipe as any; // Type assertion needed due to populate
      ratedRecipeIds.add(recipe._id.toString());
      
      // Collect tags
      recipe.tags?.forEach((tag: string) => preferredTags.add(tag));
      
      // Count dietary preferences
      Object.entries(recipe.dietary || {}).forEach(([key, value]) => {
        if (value) {
          preferredDietary[key] = (preferredDietary[key] || 0) + 1;
        }
      });
    });

    // Find recipes with similar characteristics
    const dietaryPreferences = Object.entries(preferredDietary)
      .filter(([_, count]) => count >= 2) // User likes this preference in multiple recipes
      .map(([key]) => key);

    const suggestions = await Recipe.find({
      _id: { $nin: Array.from(ratedRecipeIds) }, // Exclude already rated recipes
      $or: [
        { tags: { $in: Array.from(preferredTags) } },
        {
          $and: dietaryPreferences.map((pref) => ({
            [`dietary.${pref}`]: true,
          })),
        },
      ],
    })
      .sort({ averageRating: -1, totalRatings: -1 })
      .limit(10);

    return res.status(200).json(suggestions);
  } catch (error) {
    console.error('Recipe suggestions error:', error);
    return res.status(500).json({ message: 'Failed to get recipe suggestions' });
  }
}
