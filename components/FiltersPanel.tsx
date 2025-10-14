'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { SearchFilters, DietaryInfo } from '@/types';

interface FiltersPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClose?: () => void;
}

export default function FiltersPanel({ filters, onFiltersChange, onClose }: FiltersPanelProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  const dietaryOptions: { key: keyof DietaryInfo; label: string }[] = [
    { key: 'vegetarian', label: 'Vegetarian' },
    { key: 'vegan', label: 'Vegan' },
    { key: 'glutenFree', label: 'Gluten Free' },
    { key: 'dairyFree', label: 'Dairy Free' },
    { key: 'nutFree', label: 'Nut Free' },
    { key: 'keto', label: 'Keto' },
    { key: 'paleo', label: 'Paleo' },
  ];

  const difficultyOptions = ['Easy', 'Medium', 'Hard'];

  const handleDietaryToggle = (option: string) => {
    const currentDietary = localFilters.dietary || [];
    const newDietary = currentDietary.includes(option)
      ? currentDietary.filter((d) => d !== option)
      : [...currentDietary, option];

    setLocalFilters({ ...localFilters, dietary: newDietary });
  };

  const handleDifficultyToggle = (option: string) => {
    const currentDifficulty = localFilters.difficulty || [];
    const newDifficulty = currentDifficulty.includes(option)
      ? currentDifficulty.filter((d) => d !== option)
      : [...currentDifficulty, option];

    setLocalFilters({ ...localFilters, difficulty: newDifficulty });
  };

  const handleTimeChange = (value: number) => {
    setLocalFilters({ ...localFilters, maxCookTime: value });
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose?.();
  };

  const handleReset = () => {
    const resetFilters: SearchFilters = {
      dietary: [],
      difficulty: [],
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Dietary Preferences */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Dietary Preferences
          </h4>
          <div className="space-y-2">
            {dietaryOptions.map((option) => (
              <label key={option.key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.dietary?.includes(option.key) || false}
                  onChange={() => handleDietaryToggle(option.key)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Difficulty Level
          </h4>
          <div className="space-y-2">
            {difficultyOptions.map((option) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.difficulty?.includes(option) || false}
                  onChange={() => handleDifficultyToggle(option)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Cook Time */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Max Cook Time: {localFilters.maxCookTime || 120} minutes
          </h4>
          <input
            type="range"
            min="15"
            max="240"
            step="15"
            value={localFilters.maxCookTime || 120}
            onChange={(e) => handleTimeChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>15 min</span>
            <span>240 min</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6 pt-6 border-t dark:border-gray-700">
        <button
          onClick={handleReset}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 bg-white dark:bg-transparent"
        >
          Reset
        </button>
        <button
          onClick={handleApply}
          className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
}

