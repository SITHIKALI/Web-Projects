import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../AppImage';
import Icon from '../AppIcon';
import Button from './Button';

const RecipeCard = ({ 
  recipe = {
    id: '1',
    title: 'Sample Recipe',
    image: '/assets/images/recipe-placeholder.jpg',
    cookTime: '30 min',
    difficulty: 'Easy',
    rating: 4.5,
    reviewCount: 128,
    description: 'A delicious and easy recipe perfect for any occasion.',
    tags: ['Quick', 'Healthy'],
    ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3']
  },
  onSave,
  onUnsave,
  isSaved = false,
  showDescription = true,
  className = ''
}) => {
  const navigate = useNavigate();
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  const handleCardClick = () => {
    navigate(`/recipe-detail-cooking-instructions?id=${recipe.id}`);
  };

  const handleSaveClick = async (e) => {
    e.stopPropagation();
    setSaveLoading(true);
    
    try {
      if (isSaved && onUnsave) {
        await onUnsave(recipe.id);
      } else if (!isSaved && onSave) {
        await onSave(recipe.id);
      }
    } catch (error) {
      console.error('Error saving/unsaving recipe:', error);
    } finally {
      setSaveLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-success bg-success/10';
      case 'medium':
        return 'text-warning bg-warning/10';
      case 'hard':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

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

  return (
    <div 
      className={`
        bg-card border border-border rounded-lg shadow-recipe-card hover:shadow-modal 
        transition-all duration-200 cursor-pointer group overflow-hidden
        ${className}
      `}
      onClick={handleCardClick}
    >
      {/* Recipe Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {isImageLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse-slow flex items-center justify-center">
            <Icon name="ImageIcon" size={32} className="text-muted-foreground" />
          </div>
        )}
        <Image
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onLoad={() => setIsImageLoading(false)}
        />
        
        {/* Save Button Overlay */}
        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 hover:bg-background backdrop-blur-sm rounded-full"
            onClick={handleSaveClick}
            loading={saveLoading}
            disabled={saveLoading}
          >
            <Icon 
              name={isSaved ? "Heart" : "Heart"} 
              size={18} 
              className={isSaved ? "text-error fill-current" : "text-muted-foreground"} 
            />
          </Button>
        </div>

        {/* Difficulty Badge */}
        <div className="absolute top-3 left-3">
          <span className={`
            px-2 py-1 text-xs font-medium rounded-full
            ${getDifficultyColor(recipe.difficulty)}
          `}>
            {recipe.difficulty}
          </span>
        </div>
      </div>

      {/* Recipe Content */}
      <div className="p-4">
        {/* Title and Rating */}
        <div className="mb-2">
          <h3 className="font-heading font-semibold text-foreground text-lg mb-1 line-clamp-2 group-hover:text-primary transition-colors">
            {recipe.title}
          </h3>
          
          {/* Rating and Reviews */}
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex items-center space-x-1">
              {renderStars(recipe.rating)}
            </div>
            <span className="text-sm text-muted-foreground">
              {recipe.rating} ({recipe.reviewCount} reviews)
            </span>
          </div>
        </div>

        {/* Description */}
        {showDescription && recipe.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {recipe.description}
          </p>
        )}

        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-accent/20 text-accent-foreground rounded-full"
              >
                {tag}
              </span>
            ))}
            {recipe.tags.length > 3 && (
              <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
                +{recipe.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Recipe Meta */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} />
              <span>{recipe.cookTime}</span>
            </div>
            
            {recipe.ingredients && (
              <div className="flex items-center space-x-1">
                <Icon name="Users" size={14} />
                <span>{recipe.ingredients.length} ingredients</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;