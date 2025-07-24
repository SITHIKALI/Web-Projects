import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import RecipeCard from '../../../components/ui/RecipeCard';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const SearchResults = ({ searchQuery, filters, onLoadMore }) => {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('relevance');
  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' },
    { value: 'cook-time', label: 'Shortest Cook Time' },
    { value: 'popularity', label: 'Most Popular' }
  ];

  // Mock recipe data
  const mockRecipes = [
    {
      id: 'recipe-1',
      title: 'Creamy Garlic Parmesan Pasta',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
      cookTime: '25 min',
      difficulty: 'Easy',
      rating: 4.8,
      reviewCount: 342,
      description: 'Rich and creamy pasta dish with garlic and parmesan cheese, perfect for a quick weeknight dinner.',
      tags: ['Quick', 'Comfort Food', 'Italian'],
      ingredients: ['Pasta', 'Garlic', 'Parmesan', 'Heavy Cream', 'Butter']
    },
    {
      id: 'recipe-2',
      title: 'Korean BBQ Beef Bowl',
      image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?w=400&h=300&fit=crop',
      cookTime: '30 min',
      difficulty: 'Medium',
      rating: 4.9,
      reviewCount: 256,
      description: 'Savory marinated beef with fresh vegetables served over steamed rice.',
      tags: ['Asian', 'Healthy', 'Protein-Rich'],
      ingredients: ['Beef', 'Soy Sauce', 'Rice', 'Vegetables', 'Sesame Oil']
    },
    {
      id: 'recipe-3',
      title: 'Mediterranean Chickpea Salad',
      image: 'https://images.pixabay.com/photo/2017/05/11/19/44/fresh-fruits-2305192_1280.jpg?w=400&h=300&fit=crop',
      cookTime: '15 min',
      difficulty: 'Easy',
      rating: 4.7,
      reviewCount: 189,
      description: 'Fresh and healthy salad with Mediterranean flavors, perfect for lunch.',
      tags: ['Healthy', 'Vegetarian', 'Quick'],
      ingredients: ['Chickpeas', 'Cucumber', 'Tomatoes', 'Feta', 'Olive Oil']
    },
    {
      id: 'recipe-4',
      title: 'Thai Green Curry Chicken',
      image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop',
      cookTime: '35 min',
      difficulty: 'Medium',
      rating: 4.6,
      reviewCount: 298,
      description: 'Aromatic Thai curry with tender chicken and vegetables in coconut milk.',
      tags: ['Thai', 'Spicy', 'Coconut'],
      ingredients: ['Chicken', 'Green Curry Paste', 'Coconut Milk', 'Vegetables']
    },
    {
      id: 'recipe-5',
      title: 'Classic Chocolate Chip Cookies',
      image: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?w=400&h=300&fit=crop',
      cookTime: '20 min',
      difficulty: 'Easy',
      rating: 4.9,
      reviewCount: 567,
      description: 'Soft and chewy chocolate chip cookies that are perfect for any occasion.',
      tags: ['Dessert', 'Baking', 'Sweet'],
      ingredients: ['Flour', 'Butter', 'Sugar', 'Chocolate Chips', 'Eggs']
    },
    {
      id: 'recipe-6',
      title: 'Grilled Salmon with Lemon',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
      cookTime: '18 min',
      difficulty: 'Medium',
      rating: 4.8,
      reviewCount: 234,
      description: 'Perfectly grilled salmon with fresh lemon and herbs.',
      tags: ['Healthy', 'Seafood', 'Grilled'],
      ingredients: ['Salmon', 'Lemon', 'Herbs', 'Olive Oil', 'Garlic']
    }
  ];

  const loadRecipes = useCallback(async (reset = false) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let filteredRecipes = [...mockRecipes];
    
    // Apply search filter
    if (searchQuery) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply filters
    if (filters.cuisine && filters.cuisine.length > 0) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        filters.cuisine.some(cuisine => 
          recipe.tags.some(tag => tag.toLowerCase().includes(cuisine.toLowerCase()))
        )
      );
    }
    
    if (filters.difficulty && filters.difficulty.length > 0) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        filters.difficulty.includes(recipe.difficulty.toLowerCase())
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'rating':
        filteredRecipes.sort((a, b) => b.rating - a.rating);
        break;
      case 'cook-time':
        filteredRecipes.sort((a, b) => parseInt(a.cookTime) - parseInt(b.cookTime));
        break;
      case 'popularity':
        filteredRecipes.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        // Keep original order for relevance
        break;
    }
    
    setTotalResults(filteredRecipes.length);
    
    if (reset) {
      setRecipes(filteredRecipes);
      setHasMore(filteredRecipes.length > 6);
    } else {
      setRecipes(prev => [...prev, ...filteredRecipes.slice(prev.length, prev.length + 6)]);
      setHasMore(recipes.length + 6 < filteredRecipes.length);
    }
    
    setIsLoading(false);
  }, [searchQuery, filters, sortBy, recipes.length]);

  useEffect(() => {
    loadRecipes(true);
  }, [searchQuery, filters, sortBy]);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      loadRecipes(false);
      if (onLoadMore) onLoadMore();
    }
  };

  const handleSaveRecipe = async (recipeId) => {
    // Mock save functionality
    console.log('Saving recipe:', recipeId);
  };

  const handleUnsaveRecipe = async (recipeId) => {
    // Mock unsave functionality
    console.log('Unsaving recipe:', recipeId);
  };

  if (isLoading && recipes.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-muted rounded animate-pulse w-32"></div>
          <div className="h-10 bg-muted rounded animate-pulse w-40"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="aspect-[4/3] bg-muted animate-pulse"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded animate-pulse"></div>
                <div className="h-3 bg-muted rounded animate-pulse w-3/4"></div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-muted rounded-full animate-pulse w-16"></div>
                  <div className="h-6 bg-muted rounded-full animate-pulse w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recipes.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="font-heading font-semibold text-foreground text-lg mb-2">
          No recipes found
        </h3>
        <p className="text-muted-foreground mb-6">
          Try adjusting your search terms or filters to find more recipes.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/ingredient-input-recipe-discovery'}
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Find by Ingredients
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/recipe-search-browse'}
          >
            <Icon name="Home" size={16} className="mr-2" />
            Browse All Recipes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <h2 className="font-heading font-semibold text-foreground text-lg">
            {searchQuery ? `Results for "${searchQuery}"` : 'All Recipes'}
          </h2>
          <span className="text-sm text-muted-foreground">
            ({totalResults} recipes)
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            className="w-40"
          />
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onSave={handleSaveRecipe}
            onUnsave={handleUnsaveRecipe}
            isSaved={false} // This would come from user's saved recipes
          />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center pt-6">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load More Recipes'}
          </Button>
        </div>
      )}

      {/* End of Results */}
      {!hasMore && recipes.length > 0 && (
        <div className="text-center py-6 border-t border-border">
          <p className="text-muted-foreground">
            You've seen all {totalResults} recipes. Try a new search to discover more!
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;