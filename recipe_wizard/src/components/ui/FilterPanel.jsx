import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import { Checkbox } from './Checkbox';

const FilterPanel = ({ 
  onFiltersChange,
  initialFilters = {},
  className = '',
  collapsible = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(!collapsible);
  const [filters, setFilters] = useState({
    cuisine: [],
    dietary: [],
    mealType: [],
    cookTime: '',
    difficulty: [],
    ...initialFilters
  });

  const filterOptions = {
    cuisine: [
      { value: 'italian', label: 'Italian' },
      { value: 'mexican', label: 'Mexican' },
      { value: 'asian', label: 'Asian' },
      { value: 'american', label: 'American' },
      { value: 'mediterranean', label: 'Mediterranean' },
      { value: 'indian', label: 'Indian' },
      { value: 'french', label: 'French' },
      { value: 'thai', label: 'Thai' }
    ],
    dietary: [
      { value: 'vegetarian', label: 'Vegetarian' },
      { value: 'vegan', label: 'Vegan' },
      { value: 'gluten-free', label: 'Gluten Free' },
      { value: 'dairy-free', label: 'Dairy Free' },
      { value: 'keto', label: 'Keto' },
      { value: 'paleo', label: 'Paleo' },
      { value: 'low-carb', label: 'Low Carb' },
      { value: 'high-protein', label: 'High Protein' }
    ],
    mealType: [
      { value: 'breakfast', label: 'Breakfast' },
      { value: 'lunch', label: 'Lunch' },
      { value: 'dinner', label: 'Dinner' },
      { value: 'snack', label: 'Snack' },
      { value: 'dessert', label: 'Dessert' },
      { value: 'appetizer', label: 'Appetizer' }
    ],
    cookTime: [
      { value: '15', label: 'Under 15 min' },
      { value: '30', label: 'Under 30 min' },
      { value: '60', label: 'Under 1 hour' },
      { value: '120', label: 'Under 2 hours' },
      { value: '120+', label: '2+ hours' }
    ],
    difficulty: [
      { value: 'easy', label: 'Easy' },
      { value: 'medium', label: 'Medium' },
      { value: 'hard', label: 'Hard' }
    ]
  };

  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [filters, onFiltersChange]);

  const handleFilterChange = (category, value, checked) => {
    setFilters(prev => {
      if (category === 'cookTime') {
        return {
          ...prev,
          [category]: checked ? value : ''
        };
      } else {
        const currentValues = prev[category] || [];
        const newValues = checked
          ? [...currentValues, value]
          : currentValues.filter(v => v !== value);
        
        return {
          ...prev,
          [category]: newValues
        };
      }
    });
  };

  const clearAllFilters = () => {
    setFilters({
      cuisine: [],
      dietary: [],
      mealType: [],
      cookTime: '',
      difficulty: []
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        count += value.length;
      } else if (value) {
        count += 1;
      }
    });
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  const FilterSection = ({ title, category, options, isSingleSelect = false }) => (
    <div className="space-y-3">
      <h4 className="font-heading font-medium text-foreground text-sm">{title}</h4>
      <div className="space-y-2">
        {options.map((option) => {
          const isChecked = isSingleSelect 
            ? filters[category] === option.value
            : filters[category]?.includes(option.value);
            
          return (
            <Checkbox
              key={option.value}
              label={option.label}
              checked={isChecked}
              onChange={(e) => handleFilterChange(category, option.value, e.target.checked)}
              size="sm"
            />
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={18} className="text-muted-foreground" />
          <h3 className="font-heading font-medium text-foreground">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          )}
          
          {collapsible && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8"
            >
              <Icon 
                name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                size={16} 
              />
            </Button>
          )}
        </div>
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          <FilterSection
            title="Cuisine Type"
            category="cuisine"
            options={filterOptions.cuisine}
          />
          
          <FilterSection
            title="Dietary Preferences"
            category="dietary"
            options={filterOptions.dietary}
          />
          
          <FilterSection
            title="Meal Type"
            category="mealType"
            options={filterOptions.mealType}
          />
          
          <FilterSection
            title="Cooking Time"
            category="cookTime"
            options={filterOptions.cookTime}
            isSingleSelect={true}
          />
          
          <FilterSection
            title="Difficulty Level"
            category="difficulty"
            options={filterOptions.difficulty}
          />
        </div>
      )}

      {/* Mobile Apply Button */}
      <div className="md:hidden p-4 border-t border-border">
        <Button 
          variant="default" 
          fullWidth
          onClick={() => collapsible && setIsExpanded(false)}
        >
          Apply Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;