import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const MealPlanSidebar = ({ 
  onGenerateShoppingList, 
  plannedMeals, 
  onQuickAdd,
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState('suggestions');

  // Mock suggested recipes based on planning history
  const suggestedRecipes = [
    {
      id: 'suggest-1',
      title: 'Overnight Oats',
      image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300',
      cookTime: '5 min',
      difficulty: 'Easy',
      rating: 4.7,
      reviewCount: 89,
      description: 'Easy make-ahead breakfast that saves time in the morning.',
      tags: ['Quick', 'Healthy', 'Make-ahead'],
      mealType: ['breakfast'],
      reason: 'Popular breakfast choice'
    },
    {
      id: 'suggest-2',
      title: 'Caesar Salad',
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300',
      cookTime: '15 min',
      difficulty: 'Easy',
      rating: 4.5,
      reviewCount: 156,
      description: 'Classic Caesar salad with homemade dressing.',
      tags: ['Quick', 'Vegetarian', 'Light'],
      mealType: ['lunch'],
      reason: 'Quick lunch option'
    },
    {
      id: 'suggest-3',
      title: 'Beef Tacos',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300',
      cookTime: '25 min',
      difficulty: 'Medium',
      rating: 4.8,
      reviewCount: 203,
      description: 'Flavorful beef tacos with fresh toppings.',
      tags: ['Mexican', 'Family-friendly', 'Protein'],
      mealType: ['dinner'],
      reason: 'Family favorite'
    }
  ];

  const getPlannedMealsCount = () => {
    return Object.keys(plannedMeals).length;
  };

  const getWeeklyStats = () => {
    const stats = {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snack: 0
    };

    Object.values(plannedMeals).forEach(meal => {
      if (meal && meal.mealType) {
        stats[meal.mealType] = (stats[meal.mealType] || 0) + 1;
      }
    });

    return stats;
  };

  const stats = getWeeklyStats();

  const StatCard = ({ icon, label, count, color = 'primary' }) => (
    <div className="bg-background border border-border rounded-lg p-3">
      <div className="flex items-center space-x-2">
        <div className={`p-2 rounded-lg bg-${color}/10`}>
          <Icon name={icon} size={16} className={`text-${color}`} />
        </div>
        <div>
          <div className="text-sm font-medium text-foreground">{count}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`bg-card border border-border rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="font-heading font-semibold text-foreground mb-2">
          Meal Planning
        </h3>
        <p className="text-sm text-muted-foreground">
          {getPlannedMealsCount()} meals planned this week
        </p>
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-b border-border">
        <h4 className="font-medium text-foreground text-sm mb-3">This Week</h4>
        <div className="grid grid-cols-2 gap-2">
          <StatCard icon="Coffee" label="Breakfast" count={stats.breakfast} color="secondary" />
          <StatCard icon="Utensils" label="Lunch" count={stats.lunch} color="accent" />
          <StatCard icon="UtensilsCrossed" label="Dinner" count={stats.dinner} color="primary" />
          <StatCard icon="Cookie" label="Snacks" count={stats.snack} color="success" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-b border-border space-y-2">
        <Button
          variant="default"
          fullWidth
          onClick={onGenerateShoppingList}
          iconName="ShoppingCart"
          iconPosition="left"
          disabled={getPlannedMealsCount() === 0}
        >
          Generate Shopping List
        </Button>
        
        <Button
          variant="outline"
          fullWidth
          iconName="Copy"
          iconPosition="left"
        >
          Copy This Week
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex">
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`
              flex-1 px-4 py-3 text-sm font-medium transition-colors
              ${activeTab === 'suggestions' ?'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            Suggestions
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`
              flex-1 px-4 py-3 text-sm font-medium transition-colors
              ${activeTab === 'favorites' ?'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            Favorites
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto" style={{ maxHeight: '400px' }}>
        {activeTab === 'suggestions' ? (
          <div className="p-4 space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <Icon name="Sparkles" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">
                Recommended for You
              </span>
            </div>
            
            {suggestedRecipes.map((recipe) => (
              <div key={recipe.id} className="space-y-2">
                <div className="bg-background border border-border rounded-lg p-3">
                  <div className="flex space-x-3">
                    <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-foreground text-sm line-clamp-1">
                        {recipe.title}
                      </h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        {recipe.reason}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1">
                          <Icon name="Clock" size={10} />
                          <span className="text-xs text-muted-foreground">
                            {recipe.cookTime}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="Star" size={10} className="text-secondary fill-current" />
                          <span className="text-xs text-muted-foreground">
                            {recipe.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    className="mt-3"
                    onClick={() => onQuickAdd && onQuickAdd(recipe)}
                    iconName="Plus"
                    iconPosition="left"
                  >
                    Quick Add
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4">
            <div className="text-center py-8">
              <Icon name="Heart" size={32} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Your favorite recipes will appear here
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Tips */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-start space-x-2">
          <Icon name="Lightbulb" size={14} className="text-primary mt-0.5" />
          <div>
            <p className="text-xs text-muted-foreground">
              <strong>Tip:</strong> Plan similar meals together to optimize your shopping list and reduce food waste.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlanSidebar;