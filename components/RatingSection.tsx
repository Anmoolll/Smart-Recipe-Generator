'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Recipe } from '@/types';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface RatingSectionProps {
  recipe: Recipe;
}

export default function RatingSection({ recipe }: RatingSectionProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitRating = async () => {
    if (!session) {
      toast.error('Please sign in to rate recipes');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(`/api/recipes/${recipe._id}/rate`, {
        rating,
        comment,
      });

      toast.success('Rating submitted successfully!');
      setRating(0);
      setComment('');
      // Optionally refresh the page to show new rating
      window.location.reload();
    } catch (error) {
      console.error('Rating error:', error);
      toast.error('Failed to submit rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Ratings & Reviews
      </h2>

      {/* Submit Rating Form */}
      {session && (
        <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Leave a Rating
          </h3>

          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-gray-700 dark:text-gray-300">
                {rating} star{rating !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this recipe (optional)"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white mb-4"
          />

          <button
            onClick={handleSubmitRating}
            disabled={isSubmitting || rating === 0}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      )}

      {/* Existing Ratings */}
      <div className="space-y-4">
        {recipe.ratings.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No ratings yet. Be the first to rate this recipe!
          </p>
        ) : (
          recipe.ratings.map((ratingItem, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= ratingItem.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(ratingItem.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
              {ratingItem.comment && (
                <p className="text-gray-700 dark:text-gray-300">{ratingItem.comment}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

