import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();

    if (req.method === 'GET') {
      const {
        search,
        difficulty,
        maxCookTime,
        dietary,
        ingredients,
        page = '1',
        limit = '12',
      } = req.query;

      // Build query
      const query: any = {};

      if (search) {
        query.$text = { $search: search as string };
      }

      if (difficulty) {
        const difficulties = (difficulty as string).split(',');
        query.difficulty = { $in: difficulties };
      }

      if (maxCookTime) {
        query.cookTime = { $lte: parseInt(maxCookTime as string) };
      }

      if (dietary) {
        const dietaryPrefs = (dietary as string).split(',');
        dietaryPrefs.forEach((pref) => {
          query[`dietary.${pref}`] = true;
        });
      }

      if (ingredients) {
        const ingredientList = (ingredients as string).split(',');
        query['ingredients.name'] = {
          $in: ingredientList.map((ing) => new RegExp(ing, 'i')),
        };
      }

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const recipes = await Recipe.find(query)
        .sort({ averageRating: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean();

      const total = await Recipe.countDocuments(query);

      return res.status(200).json({
        recipes,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      });
    }

    if (req.method === 'POST') {
      const session = await getServerSession(req, res, authOptions);

      if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const recipeData = req.body;
      recipeData.createdBy = session.user.id;

      const recipe = await Recipe.create(recipeData);

      return res.status(201).json({ recipe });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Recipe API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

