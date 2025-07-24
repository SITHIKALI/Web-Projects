import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MealSlot = ({ 
  date, 
  mealType, 
  plannedMeal, 
  onAddMeal, 
  onRemoveMeal, 
  onUpdateServings, 
  onViewRecipe,
  compact = false,
  mobile = false 
}) => {
  const [servings, setServings] = useState(plannedMeal?.servings || 2);

  const handleServingsChange = (newServings) => {
    if (newServings < 1 || newServings > 12) return;
    setServings(newServings);
    if (onUpdateServings && plannedMeal) {
      onUpdateServings(date, mealType, newServings);
    }
  };

  const handleAddMeal = () => {
    if (onAddMeal) {
      onAddMeal(date, mealType);
    }
  };

  const handleRemoveMeal = (e) => {
    e.stopPropagation();
    if (onRemoveMeal && plannedMeal) {
      onRemoveMeal(date, mealType);
    }
  };

  const handleViewRecipe = () => {
    if (onViewRecipe && plannedMeal) {
      onViewRecipe(plannedMeal.recipe);
    }
  };

  if (!plannedMeal) {
    return (
      <div className={`
        ${compact ? 'min-h-[80px]' : 'min-h-[100px]'} 
        flex items-center justify-center
      `}>
        <Button
          variant="ghost"
          size={compact ? "sm" : "default"}
          onClick={handleAddMeal}
          className={`
            border-2 border-dashed border-muted-foreground/30 
            hover:border-primary hover:bg-primary/5 transition-colors
            ${compact ? 'h-16 w-full text-xs' : 'h-20 w-full'}
            ${mobile ? 'text-xs' : ''}
          `}
          iconName="Plus"
          iconPosition="left"
          iconSize={compact ? 14 : 16}
        >
          {compact ? 'Add' : 'Add Recipe'}
        </Button>
      </div>
    );
  }

  return (
    <div className={`
      bg-background border border-border rounded-lg overflow-hidden
      hover:shadow-sm transition-shadow cursor-pointer
      ${compact ? 'min-h-[80px]' : 'min-h-[100px]'}
    `}>
      <div onClick={handleViewRecipe} className="p-2">
        {/* Recipe Image and Info */}
        <div className="flex space-x-2">
          <div className={`
            flex-shrink-0 rounded overflow-hidden
            ${compact ? 'w-12 h-12' : 'w-16 h-16'}
          `}>
            <Image
              src={plannedMeal.recipe.image}
              alt={plannedMeal.recipe.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className={`
              font-medium text-foreground line-clamp-2
              ${compact ? 'text-xs' : 'text-sm'}
            `}>
              {plannedMeal.recipe.title}
            </h4>
            
            <div className={`
              flex items-center space-x-2 mt-1
              ${compact ? 'text-xs' : 'text-sm'}
              text-muted-foreground
            `}>
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={compact ? 10 : 12} />
                <span>{plannedMeal.recipe.cookTime}</span>
              </div>
              
              {!compact && (
                <div className="flex items-center space-x-1">
                  <Icon name="Users" size={12} />
                  <span>{plannedMeal.recipe.servings || 4}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Servings Control */}
        {!compact && (
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">Servings:</span>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleServingsChange(servings - 1);
                  }}
                  className="h-6 w-6"
                  disabled={servings <= 1}
                >
                  <Icon name="Minus" size={12} />
                </Button>
                
                <span className="text-sm font-medium text-foreground min-w-[20px] text-center">
                  {servings}
                </span>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleServingsChange(servings + 1);
                  }}
                  className="h-6 w-6"
                  disabled={servings >= 12}
                >
                  <Icon name="Plus" size={12} />
                </Button>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemoveMeal}
              className="h-6 w-6 text-muted-foreground hover:text-destructive"
            >
              <Icon name="X" size={12} />
            </Button>
          </div>
        )}
      </div>

      {/* Compact Actions */}
      {compact && (
        <div className="flex items-center justify-between px-2 py-1 bg-muted/30 border-t border-border">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleServingsChange(servings - 1);
              }}
              className="h-5 w-5"
              disabled={servings <= 1}
            >
              <Icon name="Minus" size={10} />
            </Button>
            
            <span className="text-xs font-medium text-foreground min-w-[16px] text-center">
              {servings}
            </span>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleServingsChange(servings + 1);
              }}
              className="h-5 w-5"
              disabled={servings >= 12}
            >
              <Icon name="Plus" size={10} />
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemoveMeal}
            className="h-5 w-5 text-muted-foreground hover:text-destructive"
          >
            <Icon name="X" size={10} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default MealSlot;