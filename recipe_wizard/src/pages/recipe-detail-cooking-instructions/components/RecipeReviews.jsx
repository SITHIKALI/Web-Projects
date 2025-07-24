import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecipeReviews = ({ reviews, averageRating, totalReviews, onAddReview }) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon key={i} name="Star" size={14} className="text-secondary fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Icon key="half" name="StarHalf" size={14} className="text-secondary fill-current" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon key={`empty-${i}`} name="Star" size={14} className="text-muted-foreground" />
      );
    }

    return stars;
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[Math.floor(review.rating)]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const sortedReviews = [...displayedReviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date) - new Date(a.date);
      case 'oldest':
        return new Date(a.date) - new Date(b.date);
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-heading font-semibold text-foreground">
            Reviews & Ratings
          </h3>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onAddReview}
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Write Review
          </Button>
        </div>

        {/* Rating Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overall Rating */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
              <span className="text-3xl font-bold text-foreground">
                {averageRating.toFixed(1)}
              </span>
              <div className="flex items-center space-x-1">
                {renderStars(averageRating)}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingDistribution[rating];
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

              return (
                <div key={rating} className="flex items-center space-x-2 text-sm">
                  <span className="text-muted-foreground w-8">
                    {rating}★
                  </span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-secondary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-muted-foreground w-8 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <div className="flex space-x-2">
            {[
              { value: 'newest', label: 'Newest' },
              { value: 'oldest', label: 'Oldest' },
              { value: 'highest', label: 'Highest Rated' },
              { value: 'lowest', label: 'Lowest Rated' }
            ].map((option) => (
              <Button
                key={option.value}
                variant={sortBy === option.value ? "default" : "ghost"}
                size="sm"
                onClick={() => setSortBy(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="p-4">
        {sortedReviews.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="MessageSquare" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No reviews yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Be the first to share your experience!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedReviews.map((review) => (
              <div key={review.id} className="border-b border-border last:border-b-0 pb-6 last:pb-0">
                <div className="flex items-start space-x-4">
                  {/* User Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      {review.userAvatar ? (
                        <Image
                          src={review.userAvatar}
                          alt={review.userName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-primary-foreground font-medium text-sm">
                          {review.userName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-foreground">
                          {review.userName}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center space-x-1">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(review.date)}
                          </span>
                        </div>
                      </div>
                      
                      {review.verified && (
                        <span className="inline-flex items-center px-2 py-1 text-xs bg-success/20 text-success-foreground rounded-full">
                          <Icon name="CheckCircle" size={12} className="mr-1" />
                          Verified
                        </span>
                      )}
                    </div>

                    <p className="text-foreground mb-3 leading-relaxed">
                      {review.comment}
                    </p>

                    {/* Review Images */}
                    {review.images && review.images.length > 0 && (
                      <div className="flex space-x-2 mb-3">
                        {review.images.slice(0, 3).map((image, index) => (
                          <div key={index} className="w-16 h-16 rounded-lg overflow-hidden">
                            <Image
                              src={image}
                              alt={`Review image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {review.images.length > 3 && (
                          <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">
                              +{review.images.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Review Actions */}
                    <div className="flex items-center space-x-4 text-sm">
                      <button className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors">
                        <Icon name="ThumbsUp" size={14} />
                        <span>Helpful ({review.helpfulCount || 0})</span>
                      </button>
                      
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Show More/Less Button */}
        {reviews.length > 3 && (
          <div className="text-center mt-6">
            <Button
              variant="outline"
              onClick={() => setShowAllReviews(!showAllReviews)}
            >
              {showAllReviews ? 'Show Less' : `Show All ${reviews.length} Reviews`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeReviews;