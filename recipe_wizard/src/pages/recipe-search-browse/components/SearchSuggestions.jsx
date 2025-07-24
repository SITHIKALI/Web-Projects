import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SearchSuggestions = ({ searchQuery, onSuggestionClick }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [recentSearches, setRecentSearches] = useState([]);

  const popularSearches = [
    'Chicken breast recipes',
    'Vegetarian pasta',
    'Quick breakfast ideas',
    'Healthy salads',
    'Chocolate desserts',
    'Asian stir fry',
    'Italian cuisine',
    'Gluten-free options'
  ];

  const trendingIngredients = [
    'Avocado',
    'Quinoa',
    'Sweet potato',
    'Salmon',
    'Chickpeas',
    'Coconut milk',
    'Greek yogurt',
    'Spinach'
  ];

  const searchSuggestions = [
    'Creamy garlic pasta',
    'Korean BBQ bowl',
    'Mediterranean salad',
    'Chocolate lava cake',
    'Thai curry chicken',
    'Mexican street tacos',
    'Italian risotto',
    'French onion soup'
  ];

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleSuggestionClick = (suggestion) => {
    // Save to recent searches
    const updated = [suggestion, ...recentSearches.filter(s => s !== suggestion)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    } else {
      navigate(`/recipe-search-browse?q=${encodeURIComponent(suggestion)}`);
    }
  };

  const handleIngredientClick = (ingredient) => {
    navigate(`/ingredient-input-recipe-discovery?ingredient=${encodeURIComponent(ingredient)}`);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const filteredSuggestions = searchQuery 
    ? searchSuggestions.filter(s => 
        s.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-6">
      {/* Live Search Suggestions */}
      {searchQuery && filteredSuggestions.length > 0 && (
        <div>
          <h3 className="font-heading font-medium text-foreground mb-3 flex items-center">
            <Icon name="Search" size={16} className="mr-2 text-muted-foreground" />
            Suggestions
          </h3>
          <div className="space-y-2">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors flex items-center"
              >
                <Icon name="Search" size={14} className="mr-2 text-muted-foreground" />
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent Searches */}
      {!searchQuery && recentSearches.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-medium text-foreground flex items-center">
              <Icon name="History" size={16} className="mr-2 text-muted-foreground" />
              Recent Searches
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearRecentSearches}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
          </div>
          <div className="space-y-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(search)}
                className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors flex items-center"
              >
                <Icon name="Clock" size={14} className="mr-2 text-muted-foreground" />
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popular Searches */}
      {!searchQuery && (
        <div>
          <h3 className="font-heading font-medium text-foreground mb-3 flex items-center">
            <Icon name="TrendingUp" size={16} className="mr-2 text-muted-foreground" />
            Popular Searches
          </h3>
          <div className="flex flex-wrap gap-2">
            {popularSearches.slice(0, 6).map((search, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(search)}
                className="px-3 py-1 text-sm bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground rounded-full transition-colors"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trending Ingredients */}
      {!searchQuery && (
        <div>
          <h3 className="font-heading font-medium text-foreground mb-3 flex items-center">
            <Icon name="Sparkles" size={16} className="mr-2 text-muted-foreground" />
            Trending Ingredients
          </h3>
          <div className="flex flex-wrap gap-2">
            {trendingIngredients.map((ingredient, index) => (
              <button
                key={index}
                onClick={() => handleIngredientClick(ingredient)}
                className="px-3 py-1 text-sm bg-accent/20 text-accent-foreground hover:bg-accent hover:text-accent-foreground rounded-full transition-colors"
              >
                {ingredient}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {!searchQuery && (
        <div className="pt-4 border-t border-border">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/ingredient-input-recipe-discovery')}
              className="flex-1"
            >
              <Icon name="Plus" size={16} className="mr-2" />
              Find by Ingredients
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSuggestionClick('surprise me')}
              className="flex-1"
            >
              <Icon name="Shuffle" size={16} className="mr-2" />
              Surprise Me!
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;