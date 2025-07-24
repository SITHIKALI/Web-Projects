import React from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeCard from '../../../components/ui/RecipeCard';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RelatedRecipes = ({ recipes, title = "Related Recipes" }) => {
  const navigate = useNavigate();

  const handleSaveRecipe = async (recipeId) => {
    // Mock save functionality
    console.log('Saving recipe:', recipeId);
  };

  const handleUnsaveRecipe = async (recipeId) => {
    // Mock unsave functionality
    console.log('Unsaving recipe:', recipeId);
  };

  const handleViewAll = () => {
    navigate('/recipe-search-browse');
  };

  if (!recipes || recipes.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="ChefHat" size={20} className="text-primary" />
            <h3 className="text-xl font-heading font-semibold text-foreground">
              {title}
            </h3>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewAll}
          >
            View All
            <Icon name="ArrowRight" size={16} className="ml-2" />
          </Button>
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="p-4">
        {/* Mobile: Horizontal Scroll */}
        <div className="md:hidden">
          <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="flex-shrink-0 w-72">
                <RecipeCard
                  recipe={recipe}
                  onSave={handleSaveRecipe}
                  onUnsave={handleUnsaveRecipe}
                  isSaved={false}
                  showDescription={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.slice(0, 6).map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onSave={handleSaveRecipe}
              onUnsave={handleUnsaveRecipe}
              isSaved={false}
              showDescription={false}
            />
          ))}
        </div>

        {/* Show More Button for Desktop */}
        {recipes.length > 6 && (
          <div className="hidden md:flex justify-center mt-6">
            <Button
              variant="outline"
              onClick={handleViewAll}
            >
              <Icon name="Plus" size={16} className="mr-2" />
              Show More Recipes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatedRecipes;