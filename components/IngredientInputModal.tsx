'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { X, Upload, Camera, Plus, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface IngredientInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ingredients: string[]) => void;
  initialIngredients?: string[];
}

export default function IngredientInputModal({
  isOpen,
  onClose,
  onSubmit,
  initialIngredients = [],
}: IngredientInputModalProps) {
  const [ingredients, setIngredients] = useState<string[]>(initialIngredients);
  const [inputValue, setInputValue] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddIngredient = () => {
    if (inputValue.trim()) {
      setIngredients([...ingredients, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setIsUploading(true);
    setIsDetecting(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('/api/vision/detect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const detectedIngredients = response.data.ingredients.map(
        (ing: { description: string }) => ing.description
      );

      if (detectedIngredients.length === 0) {
        toast.error('No ingredients detected. Please try another image or add manually.');
      } else {
        // Add detected ingredients that aren't already in the list
        const newIngredients = detectedIngredients.filter(
          (ing: string) => !ingredients.includes(ing)
        );
        setIngredients([...ingredients, ...newIngredients]);
        toast.success(`Detected ${newIngredients.length} ingredient(s)!`);
      }
    } catch (error) {
      console.error('Image detection error:', error);
      toast.error('Failed to analyze image. Please try adding ingredients manually.');
    } finally {
      setIsUploading(false);
      setIsDetecting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = () => {
    if (ingredients.length === 0) {
      toast.error('Please add at least one ingredient');
      return;
    }
    onSubmit(ingredients);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Add Your Ingredients
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Upload Image Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Image (Optional)
            </label>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isDetecting}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isDetecting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDetecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing image...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Upload Photo</span>
                  </>
                )}
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Upload a photo and we'll detect ingredients using AI
            </p>
          </div>

          {/* Manual Input Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Add Manually
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddIngredient()}
                placeholder="e.g., tomatoes, chicken, rice"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={handleAddIngredient}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          {/* Ingredients List */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Ingredients ({ingredients.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {ingredients.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No ingredients added yet
                </p>
              ) : (
                ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full"
                  >
                    <span>{ingredient}</span>
                    <button
                      onClick={() => handleRemoveIngredient(index)}
                      className="hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full p-1 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 bg-white dark:bg-transparent"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Find Recipes
          </button>
        </div>
      </div>
    </div>
  );
}

