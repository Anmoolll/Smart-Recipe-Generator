'use client';

export default function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full flex flex-col animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-shimmer" />

      <div className="p-4 flex-1 flex flex-col">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1 w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-5/6" />

        <div className="flex items-center gap-3 mb-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
        </div>

        <div className="flex gap-2 mb-3">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24" />
        </div>

        <div className="mt-auto pt-3 border-t dark:border-gray-700">
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

