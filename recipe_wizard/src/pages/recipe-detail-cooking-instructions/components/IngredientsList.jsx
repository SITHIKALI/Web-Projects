import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const IngredientsList = ({ 
  ingredients, 
  userIngredients = [], 
  onAddToShoppingList,
  servings = 4,
  onServingsChange 
}) => {
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());
  const [currentServings, setCurrentServings] = useState(servings);

  const handleIngredientCheck = (ingredientId) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(ingredientId)) {
      newChecked.delete(ingredientId);
    } else {
      newChecked.add(ingredientId);
    }
    setCheckedIngredients(newChecked);
  };

  const handleServingsChange = (newServings) => {
    if (newServings >= 1 && newServings <= 20) {
      setCurrentServings(newServings);
      if (onServingsChange) {
        onServingsChange(newServings);
      }
    }
  };

  const adjustQuantity = (quantity, originalServings) => {
    const ratio = currentServings / originalServings;
    const adjusted = parseFloat(quantity) * ratio;
    
    // Format the adjusted quantity nicely
    if (adjusted < 1) {
      return (Math.round(adjusted * 8) / 8).toString(); // Round to nearest 1/8
    } else if (adjusted < 10) {
      return (Math.round(adjusted * 4) / 4).toString(); // Round to nearest 1/4
    } else {
      return Math.round(adjusted).toString();
    }
  };

  const getMissingIngredients = () => {
    return ingredients.filter(ingredient => 
      !userIngredients.some(userIng => 
        userIng.toLowerCase().includes(ingredient.name.toLowerCase()) ||
        ingredient.name.toLowerCase().includes(userIng.toLowerCase())
      )
    );
  };

  const missingIngredients = getMissingIngredients();
  const hasAllIngredients = missingIngredients.length === 0;

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Ingredients
          </h2>
          
          {/* Servings Adjuster */}
          <div className="flex items-center space-x-3">
            <span className="text-sm text-muted-foreground">Servings:</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleServingsChange(currentServings - 1)}
                disabled={currentServings <= 1}
              >
                <Icon name="Minus" size={14} />
              </Button>
              <span className="font-semibold text-foreground min-w-[2rem] text-center">
                {currentServings}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleServingsChange(currentServings + 1)}
                disabled={currentServings >= 20}
              >
                <Icon name="Plus" size={14} />
              </Button>
            </div>
          </div>
        </div>

        {/* Missing Ingredients Alert */}
        {!hasAllIngredients && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mb-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-warning flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-warning-foreground">
                  Missing {missingIngredients.length} ingredient{missingIngredients.length > 1 ? 's' : ''}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Add missing ingredients to your shopping list
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddToShoppingList(missingIngredients)}
                className="flex-shrink-0"
              >
                <Icon name="ShoppingCart" size={16} className="mr-2" />
                Add to List
              </Button>
            </div>
          </div>
        )}

        {/* All Ingredients Available */}
        {hasAllIngredients && (
          <div className="bg-success/10 border border-success/20 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-3">
              <Icon name="CheckCircle" size={20} className="text-success" />
              <p className="text-sm font-medium text-success-foreground">
                You have all ingredients! Ready to cook.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Ingredients List */}
      <div className="p-4">
        <div className="space-y-3">
          {ingredients.map((ingredient) => {
            const isAvailable = userIngredients.some(userIng => 
              userIng.toLowerCase().includes(ingredient.name.toLowerCase()) ||
              ingredient.name.toLowerCase().includes(userIng.toLowerCase())
            );
            const isChecked = checkedIngredients.has(ingredient.id);
            const adjustedQuantity = adjustQuantity(ingredient.quantity, servings);

            return (
              <div
                key={ingredient.id}
                className={`
                  flex items-center space-x-3 p-3 rounded-lg transition-colors
                  ${isChecked ? 'bg-muted/50' : 'hover:bg-muted/30'}
                  ${!isAvailable ? 'border-l-4 border-l-warning' : ''}
                `}
              >
                <Checkbox
                  checked={isChecked}
                  onChange={() => handleIngredientCheck(ingredient.id)}
                  className="flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`
                        font-medium
                        ${isChecked ? 'line-through text-muted-foreground' : 'text-foreground'}
                        ${!isAvailable ? 'text-warning-foreground' : ''}
                      `}>
                        {adjustedQuantity} {ingredient.unit} {ingredient.name}
                      </span>
                      
                      {!isAvailable && (
                        <span className="inline-flex items-center px-2 py-1 text-xs bg-warning/20 text-warning-foreground rounded-full">
                          <Icon name="AlertCircle" size={12} className="mr-1" />
                          Missing
                        </span>
                      )}
                    </div>
                    
                    {ingredient.notes && (
                      <span className="text-xs text-muted-foreground italic">
                        {ingredient.notes}
                      </span>
                    )}
                  </div>
                  
                  {ingredient.substitutes && ingredient.substitutes.length > 0 && (
                    <div className="mt-1">
                      <span className="text-xs text-muted-foreground">
                        Substitute: {ingredient.substitutes.join(' or ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Preparation Progress</span>
            <span>{checkedIngredients.size} of {ingredients.length} ready</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(checkedIngredients.size / ingredients.length) * 100}%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientsList;