import { notFound } from 'next/navigation';
import RecipeDetailView from '@/components/RecipeDetailView';
import connectDB from '@/lib/mongodb';
import Recipe from '@/models/Recipe';

export const dynamic = 'force-dynamic';

async function getRecipe(id: string) {
  try {
    await connectDB();
    const recipe = await Recipe.findById(id).lean();
    
    if (!recipe) {
      return null;
    }

    return JSON.parse(JSON.stringify(recipe));
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
}

export default async function RecipePage({ params }: { params: { id: string } }) {
  const recipe = await getRecipe(params.id);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RecipeDetailView recipe={recipe} />
      </div>
    </div>
  );
}

