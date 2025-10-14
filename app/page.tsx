'use client';

import { useState, useEffect } from 'react';
import { ChefHat, Search as SearchIcon } from 'lucide-react';
import RecipeCard from '@/components/RecipeCard';
import SkeletonCard from '@/components/SkeletonCard';
import IngredientInputModal from '@/components/IngredientInputModal';
import { Recipe } from '@/types';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/recipes');
      setRecipes(response.data.recipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast.error('Failed to load recipes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindRecipes = (ingredients: string[]) => {
    router.push(`/search?ingredients=${ingredients.join(',')}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white bg-opacity-20 rounded-full">
                <ChefHat className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Recipes Based on Your Ingredients
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Upload a photo or enter ingredients you have, and we'll find perfect recipes for you with AI-powered matching
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-primary-700 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              <SearchIcon className="w-6 h-6" />
              Find Recipes Now
            </button>
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Featured Recipes
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Discover our most popular and highly rated recipes
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-16">
            <ChefHat className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No recipes found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Check back later for delicious recipes!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Why Choose RecipeFinder?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <SearchIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                AI-Powered Matching
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Upload photos of your ingredients and let Google Vision AI detect them automatically
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Smart Recipe Suggestions
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get recipes ranked by ingredient match percentage to minimize waste
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Nutrition Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                View detailed nutrition information with automatic recalculation for serving sizes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ingredient Input Modal */}
      <IngredientInputModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFindRecipes}
      />
    </div>
  );
}

