import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import RecipeCard from '../../../components/ui/RecipeCard';

const RecipeSelectionModal = ({ 
  isOpen, 
  onClose, 
  onSelectRecipe, 
  selectedDate, 
  selectedMealType 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedDietary, setSelectedDietary] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock recipe data
  const mockRecipes = [
    {
      id: '1',
      title: 'Avocado Toast with Poached Egg',
      image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400',
      cookTime: '15 min',
      difficulty: 'Easy',
      rating: 4.6,
      reviewCount: 234,
      description: 'A healthy and delicious breakfast option with creamy avocado and perfectly poached egg.',
      tags: ['Healthy', 'Quick', 'Vegetarian'],
      cuisine: 'american',
      dietary: ['vegetarian'],
      mealType: ['breakfast'],
      servings: 2,
      ingredients: ['Avocado', 'Eggs', 'Bread', 'Lemon', 'Salt', 'Pepper']
    },
    {
      id: '2',
      title: 'Mediterranean Quinoa Bowl',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
      cookTime: '25 min',
      difficulty: 'Easy',
      rating: 4.8,
      reviewCount: 189,
      description: 'Fresh and nutritious quinoa bowl with Mediterranean flavors and vegetables.',
      tags: ['Healthy', 'Vegan', 'Mediterranean'],
      cuisine: 'mediterranean',
      dietary: ['vegan', 'gluten-free'],
      mealType: ['lunch', 'dinner'],
      servings: 4,
      ingredients: ['Quinoa', 'Cucumber', 'Tomatoes', 'Olives', 'Feta', 'Olive Oil']
    },
    {
      id: '3',
      title: 'Chicken Teriyaki Stir Fry',
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
      cookTime: '20 min',
      difficulty: 'Medium',
      rating: 4.7,
      reviewCount: 156,
      description: 'Quick and flavorful stir fry with tender chicken and fresh vegetables.',
      tags: ['Quick', 'Asian', 'High Protein'],
      cuisine: 'asian',
      dietary: ['high-protein'],
      mealType: ['lunch', 'dinner'],
      servings: 4,
      ingredients: ['Chicken Breast', 'Broccoli', 'Bell Peppers', 'Teriyaki Sauce', 'Rice']
    },
    {
      id: '4',
      title: 'Greek Yogurt Parfait',
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
      cookTime: '5 min',
      difficulty: 'Easy',
      rating: 4.5,
      reviewCount: 98,
      description: 'Light and refreshing parfait perfect for breakfast or snack.',
      tags: ['Quick', 'Healthy', 'No Cook'],
      cuisine: 'american',
      dietary: ['vegetarian', 'high-protein'],
      mealType: ['breakfast', 'snack'],
      servings: 2,
      ingredients: ['Greek Yogurt', 'Berries', 'Granola', 'Honey']
    },
    {
      id: '5',
      title: 'Spaghetti Carbonara',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400',
      cookTime: '30 min',
      difficulty: 'Medium',
      rating: 4.9,
      reviewCount: 312,
      description: 'Classic Italian pasta dish with creamy egg sauce and crispy pancetta.',
      tags: ['Italian', 'Comfort Food', 'Classic'],
      cuisine: 'italian',
      dietary: [],
      mealType: ['lunch', 'dinner'],
      servings: 4,
      ingredients: ['Spaghetti', 'Eggs', 'Pancetta', 'Parmesan', 'Black Pepper']
    },
    {
      id: '6',
      title: 'Mixed Berry Smoothie',
      image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400',
      cookTime: '5 min',
      difficulty: 'Easy',
      rating: 4.4,
      reviewCount: 67,
      description: 'Refreshing and nutritious smoothie packed with antioxidants.',
      tags: ['Quick', 'Healthy', 'Vegan'],
      cuisine: 'american',
      dietary: ['vegan', 'gluten-free'],
      mealType: ['breakfast', 'snack'],
      servings: 2,
      ingredients: ['Mixed Berries', 'Banana', 'Almond Milk', 'Chia Seeds']
    }
  ];

  const cuisineOptions = [
    { value: '', label: 'All Cuisines' },
    { value: 'american', label: 'American' },
    { value: 'italian', label: 'Italian' },
    { value: 'asian', label: 'Asian' },
    { value: 'mediterranean', label: 'Mediterranean' },
    { value: 'mexican', label: 'Mexican' },
    { value: 'indian', label: 'Indian' }
  ];

  const dietaryOptions = [
    { value: '', label: 'All Dietary' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'gluten-free', label: 'Gluten Free' },
    { value: 'high-protein', label: 'High Protein' },
    { value: 'keto', label: 'Keto' },
    { value: 'paleo', label: 'Paleo' }
  ];

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setRecipes(mockRecipes);
        setLoading(false);
      }, 500);
    }
  }, [isOpen]);

  useEffect(() => {
    let filtered = recipes;

    // Filter by meal type
    if (selectedMealType) {
      filtered = filtered.filter(recipe => 
        recipe.mealType.includes(selectedMealType)
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Filter by cuisine
    if (selectedCuisine) {
      filtered = filtered.filter(recipe => recipe.cuisine === selectedCuisine);
    }

    // Filter by dietary
    if (selectedDietary) {
      filtered = filtered.filter(recipe => 
        recipe.dietary.includes(selectedDietary)
      );
    }

    setFilteredRecipes(filtered);
  }, [recipes, searchQuery, selectedCuisine, selectedDietary, selectedMealType]);

  const handleSelectRecipe = (recipe) => {
    if (onSelectRecipe) {
      onSelectRecipe(selectedDate, selectedMealType, recipe);
    }
    onClose();
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getMealTypeLabel = (mealType) => {
    return mealType?.charAt(0).toUpperCase() + mealType?.slice(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-background border border-border rounded-lg shadow-modal w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="font-heading font-semibold text-foreground text-lg">
              Select Recipe
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {formatDate(selectedDate)} • {getMealTypeLabel(selectedMealType)}
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="search"
              placeholder="Search recipes or ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="md:col-span-1"
            />
            
            <Select
              placeholder="Filter by cuisine"
              options={cuisineOptions}
              value={selectedCuisine}
              onChange={setSelectedCuisine}
            />
            
            <Select
              placeholder="Filter by dietary"
              options={dietaryOptions}
              value={selectedDietary}
              onChange={setSelectedDietary}
            />
          </div>
        </div>

        {/* Recipe List */}
        <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
                <span className="text-muted-foreground">Loading recipes...</span>
              </div>
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-2">No recipes found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters to find more recipes.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecipes.map((recipe) => (
                <div key={recipe.id} className="cursor-pointer">
                  <RecipeCard
                    recipe={recipe}
                    showDescription={false}
                    className="h-full hover:border-primary transition-colors"
                    onClick={() => handleSelectRecipe(recipe)}
                  />
                  
                  <div className="mt-2">
                    <Button
                      variant="default"
                      fullWidth
                      onClick={() => handleSelectRecipe(recipe)}
                      iconName="Plus"
                      iconPosition="left"
                    >
                      Add to Plan
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeSelectionModal;