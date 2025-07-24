import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilterChips = ({ 
  activeFilters = {}, 
  onFilterChange, 
  onClearAll 
}) => {
  const filterCategories = [
    {
      key: 'mealType',
      label: 'Meal Type',
      icon: 'Clock',
      options: [
        { value: 'breakfast', label: 'Breakfast' },
        { value: 'lunch', label: 'Lunch' },
        { value: 'dinner', label: 'Dinner' },
        { value: 'snack', label: 'Snack' },
        { value: 'dessert', label: 'Dessert' }
      ]
    },
    {
      key: 'cuisine',
      label: 'Cuisine',
      icon: 'Globe',
      options: [
        { value: 'italian', label: 'Italian' },
        { value: 'mexican', label: 'Mexican' },
        { value: 'asian', label: 'Asian' },
        { value: 'american', label: 'American' },
        { value: 'mediterranean', label: 'Mediterranean' },
        { value: 'indian', label: 'Indian' }
      ]
    },
    {
      key: 'dietary',
      label: 'Dietary',
      icon: 'Leaf',
      options: [
        { value: 'vegetarian', label: 'Vegetarian' },
        { value: 'vegan', label: 'Vegan' },
        { value: 'gluten-free', label: 'Gluten Free' },
        { value: 'dairy-free', label: 'Dairy Free' },
        { value: 'keto', label: 'Keto' },
        { value: 'paleo', label: 'Paleo' }
      ]
    }
  ];

  const getActiveFilterCount = () => {
    let count = 0;
    Object.values(activeFilters).forEach(filterArray => {
      if (Array.isArray(filterArray)) {
        count += filterArray.length;
      }
    });
    return count;
  };

  const handleFilterToggle = (category, value) => {
    const currentFilters = activeFilters[category] || [];
    const isActive = currentFilters.includes(value);
    
    let newFilters;
    if (isActive) {
      newFilters = currentFilters.filter(f => f !== value);
    } else {
      newFilters = [...currentFilters, value];
    }
    
    onFilterChange(category, newFilters);
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="space-y-3">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-muted-foreground hover:text-foreground h-6 px-2 text-xs"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Filter Categories */}
      <div className="space-y-3">
        {filterCategories.map((category) => {
          const activeValues = activeFilters[category.key] || [];
          
          return (
            <div key={category.key} className="space-y-2">
              <div className="flex items-center space-x-2">
                <Icon name={category.icon} size={14} className="text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {category.label}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {category.options.map((option) => {
                  const isActive = activeValues.includes(option.value);
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleFilterToggle(category.key, option.value)}
                      className={`
                        px-3 py-1 text-xs rounded-full transition-all duration-200 border
                        ${isActive 
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm' 
                          : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FilterChips;