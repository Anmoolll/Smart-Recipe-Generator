import { Recipe, Ingredient } from '@/types';

export interface RecipeMatch extends Recipe {
  matchPercentage: number;
  matchedIngredients: string[];
  missingIngredients: string[];
}

/**
 * Calculate how well a recipe matches the available ingredients
 */
export function calculateRecipeMatch(
  recipe: Recipe,
  availableIngredients: string[]
): RecipeMatch {
  const recipeIngredientNames = recipe.ingredients.map((ing) =>
    ing.name.toLowerCase().trim()
  );

  const availableIngredientsLower = availableIngredients.map((ing) =>
    ing.toLowerCase().trim()
  );

  const matchedIngredients: string[] = [];
  const missingIngredients: string[] = [];

  recipeIngredientNames.forEach((recipeIng) => {
    const isMatched = availableIngredientsLower.some((availIng) => {
      // Check for exact match or partial match
      return (
        recipeIng.includes(availIng) ||
        availIng.includes(recipeIng) ||
        fuzzyMatch(recipeIng, availIng)
      );
    });

    if (isMatched) {
      matchedIngredients.push(recipeIng);
    } else {
      missingIngredients.push(recipeIng);
    }
  });

  const matchPercentage = recipeIngredientNames.length > 0
    ? Math.round((matchedIngredients.length / recipeIngredientNames.length) * 100)
    : 0;

  return {
    ...recipe,
    matchPercentage,
    matchedIngredients,
    missingIngredients,
  };
}

/**
 * Simple fuzzy matching for ingredient names
 */
function fuzzyMatch(str1: string, str2: string, threshold = 0.7): boolean {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return true;

  const editDistance = levenshteinDistance(longer, shorter);
  const similarity = (longer.length - editDistance) / longer.length;

  return similarity >= threshold;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Adjust ingredient quantities based on serving size
 */
export function adjustServingSize(
  ingredients: Ingredient[],
  originalServings: number,
  newServings: number
): Ingredient[] {
  const ratio = newServings / originalServings;

  return ingredients.map((ingredient) => ({
    ...ingredient,
    amount: parseFloat((ingredient.amount * ratio).toFixed(2)),
  }));
}

/**
 * Recalculate nutrition based on serving size
 */
export function recalculateNutrition(
  nutrition: Recipe['nutrition'],
  originalServings: number,
  newServings: number
): Recipe['nutrition'] {
  const ratio = newServings / originalServings;

  return {
    calories: Math.round(nutrition.calories * ratio),
    protein: parseFloat((nutrition.protein * ratio).toFixed(1)),
    carbs: parseFloat((nutrition.carbs * ratio).toFixed(1)),
    fat: parseFloat((nutrition.fat * ratio).toFixed(1)),
    fiber: nutrition.fiber ? parseFloat((nutrition.fiber * ratio).toFixed(1)) : undefined,
    sugar: nutrition.sugar ? parseFloat((nutrition.sugar * ratio).toFixed(1)) : undefined,
    sodium: nutrition.sodium ? parseFloat((nutrition.sodium * ratio).toFixed(1)) : undefined,
  };
}

