import React from 'react';
import Button from '../../../components/ui/Button';


const ActionButtons = ({ 
  ingredients = [], 
  onFindRecipes, 
  onSurpriseMe, 
  loading = false,
  surpriseLoading = false 
}) => {
  const hasIngredients = ingredients.length > 0;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Find Recipes Button */}
      <Button
        variant="default"
        size="lg"
        onClick={onFindRecipes}
        loading={loading}
        disabled={loading || surpriseLoading}
        className="flex-1 sm:flex-none"
        iconName="Search"
        iconPosition="left"
      >
        {hasIngredients ? `Find Recipes (${ingredients.length})` : 'Browse All Recipes'}
      </Button>

      {/* Surprise Me Button */}
      <Button
        variant="secondary"
        size="lg"
        onClick={onSurpriseMe}
        loading={surpriseLoading}
        disabled={loading || surpriseLoading}
        className="flex-1 sm:flex-none"
        iconName="Shuffle"
        iconPosition="left"
      >
        Surprise Me!
      </Button>
    </div>
  );
};

export default ActionButtons;