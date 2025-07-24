import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActiveFilters = ({ filters, onRemoveFilter, onClearAll }) => {
  const getActiveFilters = () => {
    const active = [];
    
    Object.entries(filters).forEach(([category, values]) => {
      if (Array.isArray(values)) {
        values.forEach(value => {
          active.push({
            category,
            value,
            label: formatFilterLabel(category, value)
          });
        });
      } else if (values) {
        active.push({
          category,
          value: values,
          label: formatFilterLabel(category, values)
        });
      }
    });
    
    return active;
  };

  const formatFilterLabel = (category, value) => {
    const categoryLabels = {
      cuisine: 'Cuisine',
      dietary: 'Diet',
      mealType: 'Meal',
      cookTime: 'Time',
      difficulty: 'Level'
    };
    
    const valueLabels = {
      'gluten-free': 'Gluten Free',
      'dairy-free': 'Dairy Free',
      'low-carb': 'Low Carb',
      'high-protein': 'High Protein',
      'mealType': {
        breakfast: 'Breakfast',
        lunch: 'Lunch',
        dinner: 'Dinner',
        snack: 'Snack',
        dessert: 'Dessert',
        appetizer: 'Appetizer'
      },
      'cookTime': {
        '15': 'Under 15 min',
        '30': 'Under 30 min',
        '60': 'Under 1 hour',
        '120': 'Under 2 hours',
        '120+': '2+ hours'
      }
    };
    
    // Handle special cases
    if (category === 'cookTime' && valueLabels.cookTime[value]) {
      return valueLabels.cookTime[value];
    }
    
    if (category === 'mealType' && valueLabels.mealType[value]) {
      return valueLabels.mealType[value];
    }
    
    // Handle hyphenated values
    if (valueLabels[value]) {
      return valueLabels[value];
    }
    
    // Capitalize first letter
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const handleRemoveFilter = (category, value) => {
    if (onRemoveFilter) {
      onRemoveFilter(category, value);
    }
  };

  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll();
    }
  };

  const activeFilters = getActiveFilters();

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading font-medium text-foreground text-sm flex items-center">
          <Icon name="Filter" size={16} className="mr-2 text-muted-foreground" />
          Active Filters ({activeFilters.length})
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearAll}
          className="text-muted-foreground hover:text-foreground"
        >
          Clear All
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter, index) => (
          <div
            key={`${filter.category}-${filter.value}-${index}`}
            className="inline-flex items-center bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1 text-sm"
          >
            <span>{filter.label}</span>
            <button
              onClick={() => handleRemoveFilter(filter.category, filter.value)}
              className="ml-2 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
            >
              <Icon name="X" size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveFilters;