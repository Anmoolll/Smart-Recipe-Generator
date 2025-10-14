import Link from 'next/link';
import { ChefHat } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary-100 dark:bg-primary-900 rounded-full">
            <ChefHat className="w-16 h-16 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Recipe Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Oops! Looks like this recipe has gone missing from our kitchen. Let's get you back to
          cooking!
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

