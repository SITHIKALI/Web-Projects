import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ShoppingListGenerator = ({ plannedMeals, onClose }) => {
  const [checkedItems, setCheckedItems] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({
    'Produce': true,
    'Proteins': true,
    'Dairy & Eggs': true,
    'Pantry': true,
    'Spices & Seasonings': true,
    'Other': true
  });

  // Generate shopping list from planned meals
  const generateShoppingList = () => {
    const ingredientMap = {};
    
    Object.values(plannedMeals).forEach(meal => {
      if (meal && meal.recipe && meal.recipe.ingredients) {
        meal.recipe.ingredients.forEach(ingredient => {
          const key = ingredient.toLowerCase();
          if (ingredientMap[key]) {
            ingredientMap[key].quantity += meal.servings || 1;
            ingredientMap[key].recipes.add(meal.recipe.title);
          } else {
            ingredientMap[key] = {
              name: ingredient,
              quantity: meal.servings || 1,
              recipes: new Set([meal.recipe.title]),
              category: categorizeIngredient(ingredient)
            };
          }
        });
      }
    });

    return Object.values(ingredientMap).map(item => ({
      ...item,
      recipes: Array.from(item.recipes)
    }));
  };

  const categorizeIngredient = (ingredient) => {
    const produce = ['avocado', 'tomatoes', 'cucumber', 'bell peppers', 'broccoli', 'berries', 'banana', 'lemon', 'onion', 'garlic'];
    const proteins = ['chicken breast', 'eggs', 'pancetta', 'salmon', 'beef', 'tofu', 'beans'];
    const dairy = ['greek yogurt', 'feta', 'parmesan', 'milk', 'cheese', 'butter', 'almond milk'];
    const pantry = ['quinoa', 'bread', 'spaghetti', 'rice', 'granola', 'olive oil', 'teriyaki sauce', 'honey'];
    const spices = ['salt', 'pepper', 'black pepper', 'herbs', 'spices'];

    const lowerIngredient = ingredient.toLowerCase();
    
    if (produce.some(item => lowerIngredient.includes(item))) return 'Produce';
    if (proteins.some(item => lowerIngredient.includes(item))) return 'Proteins';
    if (dairy.some(item => lowerIngredient.includes(item))) return 'Dairy & Eggs';
    if (pantry.some(item => lowerIngredient.includes(item))) return 'Pantry';
    if (spices.some(item => lowerIngredient.includes(item))) return 'Spices & Seasonings';
    
    return 'Other';
  };

  const shoppingList = generateShoppingList();
  
  const groupedList = shoppingList.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const handleItemCheck = (itemName, checked) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemName]: checked
    }));
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getCheckedCount = () => {
    return Object.values(checkedItems).filter(Boolean).length;
  };

  const getTotalCount = () => {
    return shoppingList.length;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Produce': 'Apple',
      'Proteins': 'Beef',
      'Dairy & Eggs': 'Milk',
      'Pantry': 'Package',
      'Spices & Seasonings': 'Pepper',
      'Other': 'ShoppingCart'
    };
    return icons[category] || 'ShoppingCart';
  };

  const exportList = () => {
    const listText = Object.entries(groupedList)
      .map(([category, items]) => {
        const categoryItems = items
          .map(item => `• ${item.name} (for ${item.recipes.join(', ')})`)
          .join('\n');
        return `${category}:\n${categoryItems}`;
      })
      .join('\n\n');

    const blob = new Blob([listText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shopping-list.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (shoppingList.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-background border border-border rounded-lg shadow-modal w-full max-w-md p-6">
          <div className="text-center">
            <Icon name="ShoppingCart" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading font-semibold text-foreground mb-2">
              No Meals Planned
            </h3>
            <p className="text-muted-foreground mb-4">
              Add some recipes to your meal plan to generate a shopping list.
            </p>
            <Button variant="default" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-background border border-border rounded-lg shadow-modal w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="font-heading font-semibold text-foreground text-lg">
              Shopping List
            </h2>
            <p className="text-sm text-muted-foreground">
              {getCheckedCount()} of {getTotalCount()} items checked
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportList}
              iconName="Download"
              iconPosition="left"
            >
              Export
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 py-2 bg-muted/30">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Shopping Progress</span>
            <span>{Math.round((getCheckedCount() / getTotalCount()) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(getCheckedCount() / getTotalCount()) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Shopping List */}
        <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'calc(90vh - 160px)' }}>
          <div className="space-y-4">
            {Object.entries(groupedList).map(([category, items]) => (
              <div key={category} className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getCategoryIcon(category)} 
                      size={18} 
                      className="text-primary" 
                    />
                    <span className="font-medium text-foreground">{category}</span>
                    <span className="text-sm text-muted-foreground">
                      ({items.length} items)
                    </span>
                  </div>
                  
                  <Icon 
                    name={expandedCategories[category] ? "ChevronUp" : "ChevronDown"} 
                    size={16} 
                    className="text-muted-foreground"
                  />
                </button>
                
                {expandedCategories[category] && (
                  <div className="p-3 space-y-3 bg-background">
                    {items.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Checkbox
                          checked={checkedItems[item.name] || false}
                          onChange={(e) => handleItemCheck(item.name, e.target.checked)}
                          className="mt-1"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className={`
                            font-medium transition-colors
                            ${checkedItems[item.name] 
                              ? 'text-muted-foreground line-through' 
                              : 'text-foreground'
                            }
                          `}>
                            {item.name}
                          </div>
                          
                          <div className="text-sm text-muted-foreground mt-1">
                            For: {item.recipes.join(', ')}
                          </div>
                          
                          {item.quantity > 1 && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Needed for {item.quantity} servings
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {getTotalCount()} total ingredients from your meal plan
            </div>
            
            <Button
              variant="default"
              onClick={onClose}
              iconName="Check"
              iconPosition="left"
            >
              Done Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingListGenerator;