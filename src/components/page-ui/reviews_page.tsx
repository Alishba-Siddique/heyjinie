// src/components/page-ui/reviews_page.tsx

'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { fetchReviews } from '@/services/api.service';
import RatingStars from './rating_stars';

interface CustomerInfo {
  _id: string;
  full_name: string;
  user_image: string;
}

interface Review {
  _id: string;
  customer_id: CustomerInfo;
  rating: number;
  review: string;
  created_at: string;
}

const ReviewsPage = ({ productId }: { productId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCounts, setRatingCounts] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // State for error handling

  useEffect(() => {
    const getReviews = async () => {
      try {
        const reviewData = await fetchReviews(productId);
        setReviews(reviewData);
        setSelectedReview(reviewData[0] || null); // Set the first review as the default
        calculateStats(reviewData);
      } catch (error: any) {
        console.error(error.message);
        setError('Failed to load reviews. Please try again later.'); // Set error message
      } finally {
        setIsLoading(false);
      }
    };

    getReviews();
  }, [productId]);

  const calculateStats = (reviewData: Review[]) => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let total = 0;

    reviewData.forEach((review) => {
      const roundedRating = Math.round(review.rating);
      counts[roundedRating] = (counts[roundedRating] || 0) + 1;
      total += review.rating;
    });

    setRatingCounts(counts);
    setAverageRating(reviewData.length > 0 ? total / reviewData.length : 0); // Avoid NaN
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  };

  // Placeholder image path
  const placeholderImage = '/images/placeholder.png';

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = placeholderImage;
  };

  const SkeletonCard = () => (
    <Card className="p-4 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-gray-300 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-1/2" />
          <div className="h-4 bg-gray-300 rounded w-1/3" />
        </div>
      </div>
      <div className="mt-2 h-3 bg-gray-300 rounded w-full" />
    </Card>
  );

  const SkeletonDetails = () => (
    <Card className="p-6 animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 bg-gray-300 rounded-full" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-2/3" />
          <div className="h-4 bg-gray-300 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-3 bg-gray-300 rounded w-full" />
        <div className="h-3 bg-gray -300 rounded w-3/4" />
        <div className="h-3 bg-gray-300 rounded w-4/5" />
      </div>
    </Card>
  );

  const SkeletonAverageRating = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-300 rounded w-1/2 mb-4" />
      <div className="flex items-center space-x-2">
        <div className="h-10 bg-gray-300 rounded w-16" />
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <div key={star} className="w-4 h-4 bg-gray-300 rounded" />
          ))}
        </div>
      </div>
      <div className="h-4 bg-gray-300 rounded w-1/3 mt-2" />
    </div>
  );

  const SkeletonRatingDistribution = () => (
    <div className="animate-pulse space-y-2">
      {[1, 2, 3, 4, 5].map((rating) => (
        <div key={rating} className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-300 rounded" />
          <div className="w-4 h-4 bg-gray-300 rounded" />
          <div className="flex-1 h-2 bg-gray-300 rounded-full" />
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Section: Total Rating and All Reviews */}
        <div className="md:col-span-1 space-y-6">
          {/* Total Rating */}
          <div className="text-start">
            <h2 className="text-2xl font-semibold">Total Reviews</h2>
            {isLoading ? (
              <div className="mt-4 space-y-2 animate-pulse">
                <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto" />
                <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto" />
              </div>
            ) : (
              <>
                <p className="text-4xl font-bold mt-2">{reviews.length}</p>
                <p className="text-gray-500">This year reviews</p>
              </>
            )}
          </div>

          {/* All Reviews List */}
          <div className="space-y-4">
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))
              : reviews.map((review) => (
                  <Card
                    key={review._id}
                    className={`p-6 mt-14 cursor-pointer ${
                      selectedReview?._id === review._id
                        ? 'border-green-500'
                        : ''
                    }`}
                    onClick={() => setSelectedReview(review)}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={review.customer_id.user_image || placeholderImage} // Use placeholder if no user image
                        alt={review.customer_id.full_name}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={handleImageError}
                      />
                      <div>
                        <h3 className="text-lg font-semibold">
                          {review.customer_id.full_name}
                        </h3>
                        <RatingStars rating={Math.round(review.rating)} />
                        <p className="text-sm text-gray-500">
                          {formatTime(review.created_at)}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-2 line-clamp-2">
                      {review.review}
                    </p>
                  </Card>
                ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Average Rating */}
            {isLoading ? (
              <SkeletonAverageRating />
            ) : (
              <div className="text-start">
                <h2 className="text-2xl font-semibold">Average Rating</h2>
                <div className="flex justify-start items-center mt-2">
                  <p className="text-4xl font-bold mr-2">
                    {averageRating.toFixed(1)}
                  </p>
                  <RatingStars rating={Math.round(averageRating)} />
                </div>
                <p className="text-gray-500">Average rating this year</p>
              </div>
            )}

            {/* Rating Distribution */}
            {isLoading ? (
              <SkeletonRatingDistribution />
            ) : (
              <div>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div
                    key={rating}
                    className="flex items-center space-x-2 mb-1"
                  >
                    <span className="w-4">{rating}</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-green-500 rounded-full"
                        style={{
                          width: `${
                            ((ratingCounts[rating] || 0) / reviews.length) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Section: Selected Review Details */}
          <div className="mt-8">
            {isLoading ? (
              <SkeletonDetails />
            ) : selectedReview ? (
              <Card className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={
                      selectedReview.customer_id.user_image || placeholderImage
                    } // Use placeholder if no user image
                    alt={selectedReview.customer_id.full_name}
                    onError={handleImageError}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">
                      {selectedReview.customer_id.full_name}
                    </h3>
                    <RatingStars rating={Math.round(selectedReview.rating)} />
                    <p className="text-sm text-gray-500">
                      {formatTime(selectedReview.created_at)}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 break-words">
                  {selectedReview.review}
                </p>
              </Card>
            ) : (
              <p className="text-gray-500">Select a review to view details.</p>
            )}
            {error && <p className="text-red-500">{error}</p>}{' '}
            {/* Display error message */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewsPage;
