import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeCard from '../../../components/ui/RecipeCard';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecipeGrid = ({ 
  recipes = [], 
  loading = false, 
  hasMore = true, 
  onLoadMore,
  ingredients = [],
  filters = {}
}) => {
  const navigate = useNavigate();
  const [savedRecipes, setSavedRecipes] = useState(new Set());

  // Mock recipe data with ingredient matching
  const mockRecipes = [
    {
      id: '1',
      title: 'Chicken Stir Fry with Bell Peppers',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
      cookTime: '25 min',
      difficulty: 'Easy',
      rating: 4.6,
      reviewCount: 234,
      description: 'A quick and healthy stir fry packed with colorful vegetables and tender chicken.',
      tags: ['Quick', 'Healthy', 'Asian'],
      ingredients: ['Chicken breast', 'Bell peppers', 'Onions', 'Garlic', 'Soy sauce', 'Ginger'],
      matchPercentage: 85,
      missingIngredients: 2,
      cuisine: 'asian',
      mealType: 'dinner',
      dietary: []
    },
    {
      id: '2',
      title: 'Creamy Mushroom Pasta',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?auto=format&fit=crop&w=800&q=80',
      cookTime: '20 min',
      difficulty: 'Easy',
      rating: 4.4,
      reviewCount: 189,
      description: 'Rich and creamy pasta with sautéed mushrooms and fresh herbs.',
      tags: ['Comfort Food', 'Vegetarian', 'Italian'],
      ingredients: ['Pasta', 'Mushrooms', 'Cream', 'Garlic', 'Parmesan', 'Herbs'],
      matchPercentage: 60,
      missingIngredients: 4,
      cuisine: 'italian',
      mealType: 'dinner',
      dietary: ['vegetarian']
    },
    {
      id: '3',
      title: 'Mediterranean Quinoa Bowl',
      image: 'https://images.pixabay.com/photos/2017/05/11/19/44/fresh-fruits-2305192_1280.jpg',
      cookTime: '15 min',
      difficulty: 'Easy',
      rating: 4.7,
      reviewCount: 156,
      description: 'Fresh and nutritious bowl with quinoa, vegetables, and Mediterranean flavors.',
      tags: ['Healthy', 'Vegan', 'Mediterranean'],
      ingredients: ['Quinoa', 'Tomatoes', 'Cucumber', 'Olives', 'Feta', 'Olive oil'],
      matchPercentage: 70,
      missingIngredients: 3,
      cuisine: 'mediterranean',
      mealType: 'lunch',
      dietary: ['vegetarian', 'gluten-free']
    },
    {
      id: '4',
      title: 'Spicy Thai Basil Chicken',
      image: 'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg?auto=compress&cs=tinysrgb&w=800',
      cookTime: '30 min',
      difficulty: 'Medium',
      rating: 4.8,
      reviewCount: 298,
      description: 'Authentic Thai dish with aromatic basil and perfectly balanced spices.',
      tags: ['Spicy', 'Asian', 'Authentic'],
      ingredients: ['Chicken', 'Thai basil', 'Chilies', 'Garlic', 'Fish sauce', 'Rice'],
      matchPercentage: 55,
      missingIngredients: 4,
      cuisine: 'asian',
      mealType: 'dinner',
      dietary: []
    },
    {
      id: '5',
      title: 'Avocado Toast with Poached Egg',
      image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=800&q=80',
      cookTime: '10 min',
      difficulty: 'Easy',
      rating: 4.3,
      reviewCount: 167,
      description: 'Simple yet delicious breakfast with creamy avocado and perfectly poached egg.',
      tags: ['Breakfast', 'Healthy', 'Quick'],
      ingredients: ['Avocado', 'Eggs', 'Bread', 'Lemon', 'Salt', 'Pepper'],
      matchPercentage: 90,
      missingIngredients: 1,
      cuisine: 'american',
      mealType: 'breakfast',
      dietary: ['vegetarian']
    },
    {
      id: '6',
      title: 'Classic Beef Tacos',
      image: 'https://images.pixabay.com/photos/2017/01/11/11/33/cake-1971552_1280.jpg',
      cookTime: '35 min',
      difficulty: 'Medium',
      rating: 4.5,
      reviewCount: 203,
      description: 'Traditional Mexican tacos with seasoned ground beef and fresh toppings.',
      tags: ['Mexican', 'Comfort Food', 'Family'],
      ingredients: ['Ground beef', 'Tortillas', 'Onions', 'Tomatoes', 'Cheese', 'Lettuce'],
      matchPercentage: 75,
      missingIngredients: 2,
      cuisine: 'mexican',
      mealType: 'dinner',
      dietary: []
    }
  ];

  // Calculate ingredient match for recipes
  const calculateMatch = (recipeIngredients) => {
    if (ingredients.length === 0) return 100;
    
    const userIngredients = ingredients.map(ing => ing.name.toLowerCase());
    const matches = recipeIngredients.filter(ing => 
      userIngredients.some(userIng => 
        userIng.includes(ing.toLowerCase()) || ing.toLowerCase().includes(userIng)
      )
    );
    
    return Math.round((matches.length / recipeIngredients.length) * 100);
  };

  // Filter recipes based on active filters and ingredients
  const getFilteredRecipes = () => {
    let filtered = mockRecipes;

    // Filter by ingredients if any are provided
    if (ingredients.length > 0) {
      filtered = filtered.map(recipe => ({
        ...recipe,
        matchPercentage: calculateMatch(recipe.ingredients),
        missingIngredients: recipe.ingredients.length - recipe.ingredients.filter(ing => 
          ingredients.some(userIng => 
            userIng.name.toLowerCase().includes(ing.toLowerCase()) || 
            ing.toLowerCase().includes(userIng.name.toLowerCase())
          )
        ).length
      })).sort((a, b) => b.matchPercentage - a.matchPercentage);
    }

    // Apply filters
    if (filters.mealType && filters.mealType.length > 0) {
      filtered = filtered.filter(recipe => filters.mealType.includes(recipe.mealType));
    }

    if (filters.cuisine && filters.cuisine.length > 0) {
      filtered = filtered.filter(recipe => filters.cuisine.includes(recipe.cuisine));
    }

    if (filters.dietary && filters.dietary.length > 0) {
      filtered = filtered.filter(recipe => 
        filters.dietary.some(diet => recipe.dietary.includes(diet))
      );
    }

    return filtered;
  };

  const filteredRecipes = recipes.length > 0 ? recipes : getFilteredRecipes();

  const handleSaveRecipe = async (recipeId) => {
    setSavedRecipes(prev => new Set([...prev, recipeId]));
  };

  const handleUnsaveRecipe = async (recipeId) => {
    setSavedRecipes(prev => {
      const newSet = new Set(prev);
      newSet.delete(recipeId);
      return newSet;
    });
  };

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe-detail-cooking-instructions?id=${recipeId}`);
  };

  if (loading && filteredRecipes.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-card border border-border rounded-lg overflow-hidden animate-pulse-slow">
            <div className="aspect-[4/3] bg-muted"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
              <div className="flex space-x-2">
                <div className="h-6 bg-muted rounded-full w-16"></div>
                <div className="h-6 bg-muted rounded-full w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredRecipes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Search" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
          No recipes found
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {ingredients.length > 0 
            ? "Try adjusting your ingredients or filters to find more recipes." :"Add some ingredients to discover personalized recipe recommendations."
          }
        </p>
        {ingredients.length === 0 && (
          <Button
            variant="outline"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Add Ingredients
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-heading font-semibold text-foreground">
            Recipe Suggestions
          </h2>
          <span className="text-sm text-muted-foreground">
            ({filteredRecipes.length} found)
          </span>
        </div>
        
        {ingredients.length > 0 && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Target" size={16} />
            <span>Sorted by ingredient match</span>
          </div>
        )}
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="relative">
            <RecipeCard
              recipe={recipe}
              onSave={handleSaveRecipe}
              onUnsave={handleUnsaveRecipe}
              isSaved={savedRecipes.has(recipe.id)}
              showDescription={true}
            />
            
            {/* Match Percentage Badge */}
            {ingredients.length > 0 && recipe.matchPercentage && (
              <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                {recipe.matchPercentage}% match
              </div>
            )}
            
            {/* Missing Ingredients Badge */}
            {ingredients.length > 0 && recipe.missingIngredients > 0 && (
              <div className="absolute top-12 left-3 bg-warning/90 text-warning-foreground px-2 py-1 rounded-full text-xs">
                {recipe.missingIngredients} missing
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && filteredRecipes.length > 0 && (
        <div className="text-center pt-6">
          <Button
            variant="outline"
            onClick={onLoadMore}
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More Recipes'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecipeGrid;