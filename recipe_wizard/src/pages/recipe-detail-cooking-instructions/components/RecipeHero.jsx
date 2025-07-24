import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecipeHero = ({ recipe, onSave, onShare, isSaved = false }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-success text-success-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'hard':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon key={i} name="Star" size={16} className="text-secondary fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Icon key="half" name="StarHalf" size={16} className="text-secondary fill-current" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon key={`empty-${i}`} name="Star" size={16} className="text-muted-foreground" />
      );
    }

    return stars;
  };

  return (
    <div className="relative">
      {/* Hero Image */}
      <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-lg">
        {isImageLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse-slow flex items-center justify-center">
            <Icon name="ImageIcon" size={48} className="text-muted-foreground" />
          </div>
        )}
        <Image
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
          onLoad={() => setIsImageLoading(false)}
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 hover:bg-background backdrop-blur-sm"
            onClick={onSave}
          >
            <Icon 
              name="Heart" 
              size={20} 
              className={isSaved ? "text-error fill-current" : "text-muted-foreground"} 
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 hover:bg-background backdrop-blur-sm"
            onClick={onShare}
          >
            <Icon name="Share2" size={20} className="text-muted-foreground" />
          </Button>
        </div>

        {/* Recipe Title and Basic Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </span>
            {recipe.tags?.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm bg-background/20 text-white rounded-full backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-2xl md:text-4xl font-heading font-bold text-white mb-2">
            {recipe.title}
          </h1>
          
          <div className="flex items-center space-x-4 text-white/90">
            <div className="flex items-center space-x-1">
              {renderStars(recipe.rating)}
              <span className="ml-2 text-sm">
                {recipe.rating} ({recipe.reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <Icon name="Clock" size={24} className="text-primary mx-auto mb-2" />
          <div className="text-sm text-muted-foreground">Prep Time</div>
          <div className="font-semibold text-foreground">{recipe.prepTime}</div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <Icon name="Timer" size={24} className="text-primary mx-auto mb-2" />
          <div className="text-sm text-muted-foreground">Cook Time</div>
          <div className="font-semibold text-foreground">{recipe.cookTime}</div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <Icon name="Users" size={24} className="text-primary mx-auto mb-2" />
          <div className="text-sm text-muted-foreground">Servings</div>
          <div className="font-semibold text-foreground">{recipe.servings}</div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <Icon name="TrendingUp" size={24} className="text-primary mx-auto mb-2" />
          <div className="text-sm text-muted-foreground">Difficulty</div>
          <div className="font-semibold text-foreground">{recipe.difficulty}</div>
        </div>
      </div>
    </div>
  );
};

export default RecipeHero;