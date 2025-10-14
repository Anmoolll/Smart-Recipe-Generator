'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import RecipeCard from '@/components/RecipeCard';
import SkeletonCard from '@/components/SkeletonCard';
import FiltersPanel from '@/components/FiltersPanel';
import IngredientInputModal from '@/components/IngredientInputModal';
import { Recipe, SearchFilters } from '@/types';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Filter, Edit2 } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const [recipes, setRecipes] = useState<(Recipe & { matchPercentage?: number })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    dietary: [],
    difficulty: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const ingredientsParam = searchParams?.get('ingredients');
    if (ingredientsParam) {
      const ingredientList = ingredientsParam.split(',').filter((i) => i.trim());
      setIngredients(ingredientList);
      searchRecipes(ingredientList, filters);
    }
  }, [searchParams]);

  const searchRecipes = async (ingredientList: string[], currentFilters: SearchFilters) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/recipes/match', {
        ingredients: ingredientList,
        filters: currentFilters,
      });
      setRecipes(response.data.recipes);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search recipes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    if (ingredients.length > 0) {
      searchRecipes(ingredients, newFilters);
    }
  };

  const handleUpdateIngredients = (newIngredients: string[]) => {
    setIngredients(newIngredients);
    searchRecipes(newIngredients, filters);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Recipe Search Results
          </h1>

          {/* Ingredients Display */}
          {ingredients.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Your Ingredients ({ingredients.length})
                </h3>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside className={`lg:block w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden'}`}>
            <div className="sticky top-20">
              <FiltersPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClose={() => setShowFilters(false)}
              />
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : recipes.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No recipes found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your filters or ingredients
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Update Ingredients
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 text-gray-600 dark:text-gray-400">
                  Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recipes.map((recipe) => (
                    <RecipeCard key={recipe._id} recipe={recipe} showMatchPercentage />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Ingredient Input Modal */}
      <IngredientInputModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUpdateIngredients}
        initialIngredients={ingredients}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}

