import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import { calculateRecipeMatch } from '@/lib/recipeMatching';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { ingredients, filters } = req.body;

    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ message: 'Invalid ingredients' });
    }

    // Build query based on filters
    const query: any = {};

    if (filters?.dietary && filters.dietary.length > 0) {
      filters.dietary.forEach((pref: string) => {
        query[`dietary.${pref}`] = true;
      });
    }

    if (filters?.difficulty && filters.difficulty.length > 0) {
      query.difficulty = { $in: filters.difficulty };
    }

    if (typeof filters?.maxCookTime === 'number' && !Number.isNaN(filters.maxCookTime)) {
      query.cookTime = { $lte: filters.maxCookTime };
    }

    // If user provided ingredients, prefilter recipes by any ingredient name matching via regex
    let recipesQuery = Recipe.find(query);
    if (ingredients.length > 0) {
      const regexes = ingredients.map((ing: string) => new RegExp(ing, 'i'));
      recipesQuery = recipesQuery.find({ 'ingredients.name': { $in: regexes } });
    }

    const recipes = await recipesQuery.lean();

    // Calculate match percentage for each recipe
    const recipesWithMatch = recipes
      .map((recipe) => calculateRecipeMatch(recipe as any, ingredients))
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    return res.status(200).json({ recipes: recipesWithMatch });
  } catch (error) {
    console.error('Recipe match API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

