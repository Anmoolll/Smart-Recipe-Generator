'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Clock, Users, ChefHat, Star, Heart, Plus, Minus } from 'lucide-react';
import { Recipe } from '@/types';
import { formatTime, getDifficultyColor } from '@/lib/utils';
import { adjustServingSize, recalculateNutrition } from '@/lib/recipeMatching';
import RatingSection from './RatingSection';

interface RecipeDetailViewProps {
  recipe: Recipe;
}

export default function RecipeDetailView({ recipe }: RecipeDetailViewProps) {
  const [servings, setServings] = useState(recipe.servings);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions' | 'nutrition'>('ingredients');

  const adjustedIngredients = adjustServingSize(recipe.ingredients, recipe.servings, servings);
  const adjustedNutrition = recalculateNutrition(recipe.nutrition, recipe.servings, servings);

  const totalTime = recipe.cookTime + recipe.prepTime;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative h-96">
            {recipe.imageUrl ? (
              <Image
                src={recipe.imageUrl}
                alt={recipe.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <ChefHat className="w-24 h-24 text-white opacity-50" />
              </div>
            )}
          </div>

          <div className="p-6 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {recipe.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {recipe.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(recipe.dietary)
                  .filter(([_, value]) => value)
                  .map(([key]) => (
                    <span
                      key={key}
                      className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm"
                    >
                      {key}
                    </span>
                  ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Clock className="w-5 h-5 text-primary-600" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Time</div>
                  <div className="font-semibold">{formatTime(totalTime)}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <ChefHat className="w-5 h-5 text-primary-600" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Difficulty</div>
                  <div className={`font-semibold px-2 py-1 rounded inline-block ${getDifficultyColor(recipe.difficulty)}`}>
                    {recipe.difficulty}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Rating</div>
                  <div className="font-semibold">
                    {recipe.averageRating > 0 ? recipe.averageRating.toFixed(1) : 'No ratings'}
                    {recipe.totalRatings > 0 && (
                      <span className="text-sm text-gray-500 ml-1">({recipe.totalRatings})</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Users className="w-5 h-5 text-primary-600" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Servings</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setServings(Math.max(1, servings - 1))}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold">{servings}</span>
                    <button
                      onClick={() => setServings(servings + 1)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-6">
        <div className="border-b dark:border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'ingredients'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Ingredients
            </button>
            <button
              onClick={() => setActiveTab('instructions')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'instructions'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Instructions
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'nutrition'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Nutrition
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'ingredients' && (
            <div className="space-y-3">
              {adjustedIngredients.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <input type="checkbox" className="w-5 h-5 text-primary-600 rounded" />
                  <span className="text-gray-900 dark:text-white">
                    {ingredient.amount} {ingredient.unit} {ingredient.name}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'instructions' && (
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 pt-1">{instruction}</p>
                </li>
              ))}
            </ol>
          )}

          {activeTab === 'nutrition' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Calories</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {adjustedNutrition.calories} kcal
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Protein</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {adjustedNutrition.protein}g
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Carbohydrates</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {adjustedNutrition.carbs}g
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Fat</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {adjustedNutrition.fat}g
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {adjustedNutrition.fiber && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">Fiber</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {adjustedNutrition.fiber}g
                    </span>
                  </div>
                )}
                {adjustedNutrition.sugar && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">Sugar</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {adjustedNutrition.sugar}g
                    </span>
                  </div>
                )}
                {adjustedNutrition.sodium && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">Sodium</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {adjustedNutrition.sodium}mg
                    </span>
                  </div>
                )}
              </div>

              <div className="md:col-span-2 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> Nutrition values are automatically adjusted based on the number of servings ({servings} {servings === 1 ? 'serving' : 'servings'}).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rating Section */}
      <RatingSection recipe={recipe} />
    </div>
  );
}

