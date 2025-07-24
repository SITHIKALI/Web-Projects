import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ onSurpriseMe }) => {
  const popularIngredients = [
    'Chicken breast', 'Tomatoes', 'Onions', 'Garlic', 'Bell peppers',
    'Mushrooms', 'Spinach', 'Carrots', 'Potatoes', 'Rice'
  ];

  return (
    <div className="text-center py-12 px-4">
      {/* Icon */}
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon name="ChefHat" size={32} className="text-primary" />
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-heading font-semibold text-foreground mb-3">
        What's in your kitchen?
      </h2>

      {/* Description */}
      <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
        Add the ingredients you have available, and we'll suggest delicious recipes you can make right now. 
        No more wondering "what should I cook?"
      </p>

      {/* Popular Ingredients */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
          Popular ingredients to get started:
        </h3>
        <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
          {popularIngredients.map((ingredient, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
            >
              {ingredient}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          variant="outline"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          iconName="Plus"
          iconPosition="left"
        >
          Add Ingredients
        </Button>
        
        <Button
          variant="secondary"
          onClick={onSurpriseMe}
          iconName="Shuffle"
          iconPosition="left"
        >
          Surprise Me!
        </Button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
        <div className="text-center">
          <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Icon name="Target" size={20} className="text-success" />
          </div>
          <h4 className="font-medium text-foreground mb-2">Smart Matching</h4>
          <p className="text-sm text-muted-foreground">
            Get recipes ranked by how many ingredients you already have
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Icon name="Mic" size={20} className="text-warning" />
          </div>
          <h4 className="font-medium text-foreground mb-2">Voice Input</h4>
          <p className="text-sm text-muted-foreground">
            Add ingredients hands-free with voice recognition
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Icon name="Filter" size={20} className="text-accent" />
          </div>
          <h4 className="font-medium text-foreground mb-2">Smart Filters</h4>
          <p className="text-sm text-muted-foreground">
            Filter by cuisine, dietary needs, and cooking time
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;