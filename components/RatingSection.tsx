import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Star, StarHalf } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface RatingSectionProps {
  recipeId: string;
  averageRating?: number;
  totalRatings?: number;
}

export default function RatingSection({ 
  recipeId, 
  averageRating = 0, 
  totalRatings = 0 
}: RatingSectionProps) {
  const { data: session } = useSession();
  const [userRating, setUserRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch user's existing rating if they're logged in
    if (session?.user) {
      const fetchUserRating = async () => {
        try {
          const response = await axios.get(`/api/recipes/${recipeId}/rate`);
          setUserRating(response.data.rating);
        } catch (error) {
          // It's okay if there's no rating yet
          if (axios.isAxiosError(error) && error.response?.status !== 404) {
            console.error('Error fetching rating:', error);
          }
        }
      };
      fetchUserRating();
    }
  }, [recipeId, session]);

  const handleRating = async (rating: number) => {
    if (!session?.user) {
      toast.error('Please sign in to rate recipes');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`/api/recipes/${recipeId}/rate`, {
        rating,
      });
      setUserRating(response.data.rating);
      toast.success('Rating saved!');
    } catch (error) {
      console.error('Rating error:', error);
      toast.error('Failed to save rating');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star;
          const half = rating + 0.5 >= star && rating < star;
          
          return (
            <button
              key={star}
              disabled={isLoading || !interactive}
              onClick={() => interactive && handleRating(star)}
              onMouseEnter={() => interactive && setHoveredRating(star)}
              onMouseLeave={() => interactive && setHoveredRating(0)}
              className={clsx(
                'transition-transform hover:scale-110',
                interactive && 'cursor-pointer',
                isLoading && 'opacity-50'
              )}
            >
              <Star
                className={clsx(
                  'h-6 w-6',
                  filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300',
                  interactive && 'hover:fill-yellow-400 hover:text-yellow-400'
                )}
              />
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">Your Rating</span>
          {renderStars(hoveredRating || userRating, true)}
        </div>
        
        {(averageRating > 0 || totalRatings > 0) && (
          <div className="flex flex-col border-l pl-4 ml-4">
            <span className="text-sm font-medium text-gray-700">
              Average Rating ({totalRatings} {totalRatings === 1 ? 'review' : 'reviews'})
            </span>
            <div className="flex items-center gap-2">
              {renderStars(averageRating)}
              <span className="text-sm text-gray-600">
                {averageRating.toFixed(1)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}