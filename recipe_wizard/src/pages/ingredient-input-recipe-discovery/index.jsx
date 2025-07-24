import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import TabNavigation from '../../components/ui/TabNavigation';
import IngredientInput from './components/IngredientInput';
import FilterChips from './components/FilterChips';
import ActionButtons from './components/ActionButtons';
import RecipeGrid from './components/RecipeGrid';
import EmptyState from './components/EmptyState';
import Icon from '../../components/AppIcon';

const IngredientInputRecipeDiscovery = () => {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    mealType: [],
    cuisine: [],
    dietary: []
  });
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [surpriseLoading, setSurpriseLoading] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Voice recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const words = transcript.toLowerCase().split(/[,\s]+/).filter(word => word.length > 2);
        
        words.forEach(word => {
          if (!ingredients.some(ing => ing.name.toLowerCase().includes(word))) {
            handleAddIngredient({
              id: Date.now() + Math.random(),
              name: word.charAt(0).toUpperCase() + word.slice(1),
              quantity: '1',
              unit: 'piece'
            });
          }
        });
        
        setIsVoiceRecording(false);
      };

      recognition.onerror = () => {
        setIsVoiceRecording(false);
      };

      recognition.onend = () => {
        setIsVoiceRecording(false);
      };

      if (isVoiceRecording) {
        recognition.start();
      }

      return () => {
        recognition.stop();
      };
    }
  }, [isVoiceRecording, ingredients]);

  const handleAddIngredient = (ingredient) => {
    setIngredients(prev => [...prev, ingredient]);
  };

  const handleRemoveIngredient = (ingredientId) => {
    setIngredients(prev => prev.filter(ing => ing.id !== ingredientId));
  };

  const handleUpdateQuantity = (ingredientId, quantity) => {
    setIngredients(prev => 
      prev.map(ing => 
        ing.id === ingredientId ? { ...ing, quantity } : ing
      )
    );
  };

  const handleVoiceToggle = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsVoiceRecording(!isVoiceRecording);
    } else {
      alert('Voice recognition is not supported in your browser. Please use Chrome or Safari.');
    }
  };

  const handleFilterChange = (category, values) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: values
    }));
  };

  const handleClearAllFilters = () => {
    setActiveFilters({
      mealType: [],
      cuisine: [],
      dietary: []
    });
  };

  const handleFindRecipes = async () => {
    setLoading(true);
    setHasSearched(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // RecipeGrid component will handle filtering based on ingredients and filters
    }, 1500);
  };

  const handleSurpriseMe = async () => {
    setSurpriseLoading(true);
    setHasSearched(true);
    
    // Simulate API call for random recipes
    setTimeout(() => {
      setSurpriseLoading(false);
      // Scroll to results
      const resultsSection = document.getElementById('recipe-results');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1000);
  };

  const handleLoadMore = async () => {
    setLoading(true);
    
    // Simulate loading more recipes
    setTimeout(() => {
      setLoading(false);
      setHasMore(false); // For demo purposes
    }, 1000);
  };

  const showResults = hasSearched || ingredients.length > 0;
  const showEmptyState = !hasSearched && ingredients.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TabNavigation />
      
      <main className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-3">
              Discover Recipes from Your Ingredients
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tell us what you have in your kitchen, and we'll suggest delicious recipes you can make right now.
            </p>
          </div>

          {/* Ingredient Input Section */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-card border border-border rounded-lg p-6 shadow-recipe-card">
              <IngredientInput
                ingredients={ingredients}
                onAddIngredient={handleAddIngredient}
                onRemoveIngredient={handleRemoveIngredient}
                onUpdateQuantity={handleUpdateQuantity}
                isVoiceRecording={isVoiceRecording}
                onVoiceToggle={handleVoiceToggle}
              />
              
              {/* Action Buttons */}
              <div className="mt-6">
                <ActionButtons
                  ingredients={ingredients}
                  onFindRecipes={handleFindRecipes}
                  onSurpriseMe={handleSurpriseMe}
                  loading={loading}
                  surpriseLoading={surpriseLoading}
                />
              </div>
            </div>
          </div>

          {/* Filter Section */}
          {(ingredients.length > 0 || hasSearched) && (
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-card border border-border rounded-lg p-6 shadow-recipe-card">
                <FilterChips
                  activeFilters={activeFilters}
                  onFilterChange={handleFilterChange}
                  onClearAll={handleClearAllFilters}
                />
              </div>
            </div>
          )}

          {/* Results Section */}
          <div id="recipe-results">
            {showEmptyState && (
              <EmptyState onSurpriseMe={handleSurpriseMe} />
            )}

            {showResults && (
              <RecipeGrid
                recipes={recipes}
                loading={loading}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
                ingredients={ingredients}
                filters={activeFilters}
              />
            )}
          </div>

          {/* Loading State for Initial Search */}
          {(loading || surpriseLoading) && !showResults && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
                <Icon name="ChefHat" size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                {surpriseLoading ? 'Finding surprise recipes...' : 'Searching for recipes...'}
              </h3>
              <p className="text-muted-foreground">
                {surpriseLoading 
                  ? 'Preparing some delicious surprises for you!'
                  : 'Matching your ingredients with our recipe database...'
                }
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default IngredientInputRecipeDiscovery;