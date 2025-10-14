'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ChefHat, Heart, Star } from 'lucide-react';
import { Recipe } from '@/types';
import { formatTime, getDifficultyColor, getMatchColor } from '@/lib/utils';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

interface RecipeCardProps {
  recipe: Recipe & { matchPercentage?: number };
  showMatchPercentage?: boolean;
}

export default function RecipeCard({ recipe, showMatchPercentage = false }: RecipeCardProps) {
  const { data: session } = useSession();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const totalTime = recipe.cookTime + recipe.prepTime;

  const handleSaveRecipe = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error('Please sign in to save recipes');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('/api/user/saved-recipes', {
        recipeId: recipe._id,
      });

      setIsSaved(response.data.saved);
      toast.success(response.data.saved ? 'Recipe saved!' : 'Recipe removed from saved');
    } catch (error) {
      console.error('Save recipe error:', error);
      toast.error('Failed to save recipe');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link href={`/recipes/${recipe._id}`}>
      <div className="group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          {recipe.imageUrl ? (
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <ChefHat className="w-16 h-16 text-white opacity-50" />
            </div>
          )}

          {showMatchPercentage && recipe.matchPercentage !== undefined && (
            <div className="absolute top-3 left-3">
              <div className={`px-3 py-1 rounded-full text-white font-bold text-sm ${getMatchColor(recipe.matchPercentage)}`}>
                {recipe.matchPercentage}% Match
              </div>
            </div>
          )}

          <button
            onClick={handleSaveRecipe}
            disabled={isLoading}
            className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 transition-transform disabled:opacity-50"
          >
            <Heart
              className={`w-5 h-5 ${
                isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'
              }`}
            />
          </button>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {recipe.title}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 flex-1">
            {recipe.description}
          </p>

          <div className="flex items-center gap-3 mb-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatTime(totalTime)}</span>
            </div>

            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{recipe.averageRating > 0 ? recipe.averageRating.toFixed(1) : 'New'}</span>
            </div>

            <div className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.entries(recipe.dietary)
              .filter(([_, value]) => value)
              .slice(0, 3)
              .map(([key]) => (
                <span
                  key={key}
                  className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs"
                >
                  {key}
                </span>
              ))}
          </div>

          <div className="mt-3 pt-3 border-t dark:border-gray-700">
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {recipe.nutrition.calories}
                </div>
                <div className="text-gray-500 dark:text-gray-400">Cal</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {recipe.nutrition.protein}g
                </div>
                <div className="text-gray-500 dark:text-gray-400">Protein</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {recipe.nutrition.carbs}g
                </div>
                <div className="text-gray-500 dark:text-gray-400">Carbs</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {recipe.nutrition.fat}g
                </div>
                <div className="text-gray-500 dark:text-gray-400">Fat</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

