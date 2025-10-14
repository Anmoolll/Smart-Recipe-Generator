'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Heart, Loader2 } from 'lucide-react';
import RecipeCard from '@/components/RecipeCard';
import SkeletonCard from '@/components/SkeletonCard';
import { Recipe } from '@/types';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function SavedRecipesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchSavedRecipes();
    }
  }, [status, router]);

  const fetchSavedRecipes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/user/profile');
      setRecipes(response.data.user.savedRecipes);
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
      toast.error('Failed to load saved recipes');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Saved Recipes
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Saved Recipes
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Your collection of favorite recipes
          </p>
        </div>

        {recipes.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No saved recipes yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start saving recipes you love to see them here
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Browse Recipes
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600 dark:text-gray-400">
              {recipes.length} saved recipe{recipes.length !== 1 ? 's' : ''}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

