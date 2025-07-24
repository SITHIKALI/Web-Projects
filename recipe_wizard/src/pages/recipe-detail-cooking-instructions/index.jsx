import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import TabNavigation from '../../components/ui/TabNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RecipeHero from './components/RecipeHero';
import IngredientsList from './components/IngredientsList';
import CookingInstructions from './components/CookingInstructions';
import NutritionInfo from './components/NutritionInfo';
import RecipeReviews from './components/RecipeReviews';
import RelatedRecipes from './components/RelatedRecipes';
import CookingModeToggle from './components/CookingModeToggle';

const RecipeDetailCookingInstructions = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recipeId = searchParams.get('id') || '1';
  
  const [recipe, setRecipe] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentServings, setCurrentServings] = useState(4);
  const [isCookingMode, setIsCookingMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState('instructions');

  // Mock user ingredients (would come from user's pantry)
  const userIngredients = [
    "chicken breast", "olive oil", "garlic", "onion", "salt", "pepper",
    "tomatoes", "basil", "parmesan cheese", "pasta"
  ];

  // Mock recipe data
  const mockRecipe = {
    id: recipeId,
    title: "Creamy Garlic Parmesan Chicken",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&h=600&fit=crop",
    description: `A rich and creamy chicken dish with garlic, parmesan, and herbs. This restaurant-quality meal comes together in just 30 minutes and is perfect for weeknight dinners or special occasions.`,
    prepTime: "15 min",
    cookTime: "25 min",
    totalTime: "40 min",
    servings: 4,
    difficulty: "Medium",
    rating: 4.8,
    reviewCount: 342,
    tags: ["Quick", "Comfort Food", "High Protein", "Gluten-Free"],
    cuisine: "Italian-American",
    ingredients: [
      {
        id: 1,
        name: "chicken breast",
        quantity: "2",
        unit: "lbs",
        notes: "boneless, skinless, cut into strips",
        substitutes: ["chicken thighs", "turkey breast"]
      },
      {
        id: 2,
        name: "heavy cream",
        quantity: "1",
        unit: "cup",
        notes: "room temperature",
        substitutes: ["half and half", "coconut cream"]
      },
      {
        id: 3,
        name: "parmesan cheese",
        quantity: "1",
        unit: "cup",
        notes: "freshly grated",
        substitutes: ["pecorino romano", "asiago cheese"]
      },
      {
        id: 4,
        name: "garlic",
        quantity: "4",
        unit: "cloves",
        notes: "minced",
        substitutes: ["garlic powder (1 tsp)"]
      },
      {
        id: 5,
        name: "olive oil",
        quantity: "2",
        unit: "tbsp",
        notes: "extra virgin",
        substitutes: ["vegetable oil", "avocado oil"]
      },
      {
        id: 6,
        name: "butter",
        quantity: "2",
        unit: "tbsp",
        notes: "unsalted",
        substitutes: ["ghee", "margarine"]
      },
      {
        id: 7,
        name: "italian seasoning",
        quantity: "1",
        unit: "tsp",
        notes: "dried",
        substitutes: ["herbs de provence", "oregano + basil"]
      },
      {
        id: 8,
        name: "salt",
        quantity: "1",
        unit: "tsp",
        notes: "to taste",
        substitutes: []
      },
      {
        id: 9,
        name: "black pepper",
        quantity: "1/2",
        unit: "tsp",
        notes: "freshly ground",
        substitutes: ["white pepper"]
      },
      {
        id: 10,
        name: "fresh parsley",
        quantity: "2",
        unit: "tbsp",
        notes: "chopped, for garnish",
        substitutes: ["dried parsley", "fresh basil"]
      }
    ],
    instructions: [
      {
        id: 1,
        instruction: "Season chicken strips with salt, pepper, and Italian seasoning. Let rest for 5 minutes to allow flavors to penetrate.",
        tip: "Pat chicken dry with paper towels for better searing",
        equipment: ["cutting board", "knife"],
        temperature: null,
        image: "https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=400&h=300&fit=crop"
      },
      {
        id: 2,
        instruction: "Heat olive oil and butter in a large skillet over medium-high heat until butter is melted and foaming.",
        tip: "The pan is ready when a drop of water sizzles immediately",
        equipment: ["large skillet"],
        temperature: "Medium-high heat",
        image: null
      },
      {
        id: 3,
        instruction: "Add chicken strips to the hot pan and cook for 6-7 minutes per side until golden brown and cooked through (internal temperature 165°F).",
        tip: "Don't overcrowd the pan - cook in batches if needed",
        equipment: ["meat thermometer"],
        temperature: "165°F internal",
        image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop"
      },
      {
        id: 4,
        instruction: "Remove chicken from pan and set aside. In the same pan, add minced garlic and sauté for 30 seconds until fragrant.",
        tip: "Don\'t let the garlic burn or it will become bitter",
        equipment: [],
        temperature: null,
        image: null
      },
      {
        id: 5,
        instruction: "Pour in heavy cream and bring to a gentle simmer. Cook for 2-3 minutes, stirring constantly.",
        tip: "Keep the heat at medium to prevent the cream from curdling",
        equipment: [],
        temperature: "Gentle simmer",
        image: null
      },
      {
        id: 6,
        instruction: "Add grated Parmesan cheese and stir until melted and sauce is smooth. Season with additional salt and pepper to taste.",
        tip: "Add cheese gradually to prevent clumping",
        equipment: [],
        temperature: null,
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop"
      },
      {
        id: 7,
        instruction: "Return chicken to the pan and toss to coat with the creamy sauce. Cook for 2 minutes to heat through.",
        tip: "Spoon sauce over chicken for even coating",
        equipment: [],
        temperature: null,
        image: null
      },
      {
        id: 8,
        instruction: "Remove from heat and garnish with fresh chopped parsley. Serve immediately while hot.",
        tip: "Serve over pasta, rice, or with crusty bread",
        equipment: [],
        temperature: null,
        image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop"
      }
    ],
    nutrition: {
      calories: 520,
      protein: 42,
      carbs: 8,
      fat: 36,
      fiber: 1,
      sugar: 4,
      sodium: 680,
      cholesterol: 145,
      saturatedFat: 18,
      transFat: 0,
      vitaminA: 15,
      vitaminC: 8,
      calcium: 25,
      iron: 12
    }
  };

  const mockReviews = [
    {
      id: 1,
      userName: "Sarah Johnson",
      userAvatar: "https://randomuser.me/api/portraits/women/32.jpg",
      rating: 5,
      date: "2025-01-05",
      comment: `This recipe is absolutely amazing! The chicken was so tender and the sauce was incredibly creamy. I served it over pasta and my family couldn't stop raving about it. Will definitely make this again!`,
      verified: true,
      helpfulCount: 24,
      images: ["https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200&h=200&fit=crop"]
    },
    {
      id: 2,
      userName: "Mike Chen",
      userAvatar: "https://randomuser.me/api/portraits/men/45.jpg",
      rating: 4,
      date: "2025-01-03",
      comment: `Great recipe! I substituted heavy cream with coconut cream for a dairy-free version and it worked perfectly. The flavors were rich and satisfying. Only suggestion would be to add a bit more garlic next time.`,
      verified: true,
      helpfulCount: 18,
      images: []
    },
    {
      id: 3,
      userName: "Emily Rodriguez",
      userAvatar: "https://randomuser.me/api/portraits/women/28.jpg",
      rating: 5,
      date: "2024-12-28",
      comment: `Perfect weeknight dinner! Ready in 40 minutes as promised and tastes like restaurant quality. The step-by-step instructions were very clear and easy to follow. My husband said it's better than our favorite Italian restaurant!`,
      verified: false,
      helpfulCount: 31,
      images: []
    },
    {
      id: 4,
      userName: "David Thompson",
      userAvatar: null,
      rating: 4,
      date: "2024-12-25",
      comment: `Delicious recipe! I made a few modifications - used chicken thighs instead of breast and added some mushrooms. The sauce was creamy and flavorful. Great for special occasions.`,
      verified: true,
      helpfulCount: 12,
      images: ["https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=200&h=200&fit=crop"]
    }
  ];

  const relatedRecipes = [
    {
      id: "2",
      title: "Lemon Herb Grilled Chicken",
      image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop",
      cookTime: "25 min",
      difficulty: "Easy",
      rating: 4.6,
      reviewCount: 189,
      description: "Light and flavorful grilled chicken with fresh herbs",
      tags: ["Healthy", "Grilled", "Low Carb"],
      ingredients: ["chicken", "lemon", "herbs", "olive oil"]
    },
    {
      id: "3",
      title: "Creamy Mushroom Risotto",
      image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop",
      cookTime: "35 min",
      difficulty: "Medium",
      rating: 4.7,
      reviewCount: 256,
      description: "Rich and creamy risotto with wild mushrooms",
      tags: ["Vegetarian", "Comfort Food", "Italian"],
      ingredients: ["arborio rice", "mushrooms", "parmesan", "broth"]
    },
    {
      id: "4",
      title: "Garlic Butter Shrimp Pasta",
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop",
      cookTime: "20 min",
      difficulty: "Easy",
      rating: 4.8,
      reviewCount: 412,
      description: "Quick and delicious shrimp pasta with garlic butter sauce",
      tags: ["Quick", "Seafood", "Pasta"],
      ingredients: ["shrimp", "pasta", "garlic", "butter"]
    },
    {
      id: "5",
      title: "Herb-Crusted Salmon",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
      cookTime: "22 min",
      difficulty: "Medium",
      rating: 4.5,
      reviewCount: 178,
      description: "Perfectly baked salmon with a crispy herb crust",
      tags: ["Healthy", "Seafood", "Baked"],
      ingredients: ["salmon", "herbs", "breadcrumbs", "lemon"]
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setRecipe(mockRecipe);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [recipeId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Recipe link copied to clipboard!');
    }
  };

  const handleAddToShoppingList = (missingIngredients) => {
    console.log('Adding to shopping list:', missingIngredients);
    alert(`Added ${missingIngredients.length} ingredients to shopping list!`);
  };

  const handleServingsChange = (newServings) => {
    setCurrentServings(newServings);
  };

  const handleTimerStart = (stepId, duration) => {
    console.log(`Starting timer for step ${stepId}: ${duration} minutes`);
    alert(`Timer started: ${duration} minutes`);
  };

  const handleAddReview = () => {
    alert('Review form would open here');
  };

  const handleCookingModeToggle = () => {
    setIsCookingMode(!isCookingMode);
    if (!isCookingMode) {
      setCurrentStep(0);
    }
  };

  const handleNextStep = () => {
    if (currentStep < recipe.instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleExitCookingMode = () => {
    setIsCookingMode(false);
    setCurrentStep(0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <TabNavigation />
        <div className="pt-32 pb-8">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="animate-pulse-slow space-y-6">
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="aspect-[16/9] bg-muted rounded-lg"></div>
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 bg-muted rounded-lg"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-96 bg-muted rounded-lg"></div>
                </div>
                <div className="space-y-6">
                  <div className="h-64 bg-muted rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <TabNavigation />
        <div className="pt-32 pb-8">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="text-center py-12">
              <Icon name="AlertCircle" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-heading font-semibold text-foreground mb-2">
                Recipe Not Found
              </h2>
              <p className="text-muted-foreground mb-6">
                The recipe you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={handleBack}>
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TabNavigation />
      
      <div className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="mb-4"
            >
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Back to Recipes
            </Button>
          </div>

          {/* Recipe Hero */}
          <div className="mb-8">
            <RecipeHero
              recipe={recipe}
              onSave={handleSave}
              onShare={handleShare}
              isSaved={isSaved}
            />
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="flex space-x-1 bg-muted p-1 rounded-lg">
              {[
                { id: 'instructions', label: 'Instructions', icon: 'List' },
                { id: 'ingredients', label: 'Ingredients', icon: 'ShoppingCart' },
                { id: 'nutrition', label: 'Nutrition', icon: 'Activity' },
                { id: 'reviews', label: 'Reviews', icon: 'MessageSquare' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors
                    ${activeTab === tab.id 
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  <Icon name={tab.icon} size={16} className="mr-2" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Instructions/Content */}
            <div className="lg:col-span-2 space-y-8">
              {activeTab === 'instructions' && (
                <CookingInstructions
                  instructions={recipe.instructions}
                  onTimerStart={handleTimerStart}
                />
              )}
              
              {activeTab === 'ingredients' && (
                <IngredientsList
                  ingredients={recipe.ingredients}
                  userIngredients={userIngredients}
                  onAddToShoppingList={handleAddToShoppingList}
                  servings={currentServings}
                  onServingsChange={handleServingsChange}
                />
              )}
              
              {activeTab === 'nutrition' && (
                <NutritionInfo
                  nutrition={recipe.nutrition}
                  servings={currentServings}
                />
              )}
              
              {activeTab === 'reviews' && (
                <RecipeReviews
                  reviews={mockReviews}
                  averageRating={recipe.rating}
                  totalReviews={recipe.reviewCount}
                  onAddReview={handleAddReview}
                />
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Ingredients Summary (always visible) */}
              {activeTab !== 'ingredients' && (
                <IngredientsList
                  ingredients={recipe.ingredients}
                  userIngredients={userIngredients}
                  onAddToShoppingList={handleAddToShoppingList}
                  servings={currentServings}
                  onServingsChange={handleServingsChange}
                />
              )}
              
              {/* Nutrition Summary (when not active) */}
              {activeTab !== 'nutrition' && (
                <NutritionInfo
                  nutrition={recipe.nutrition}
                  servings={currentServings}
                />
              )}
            </div>
          </div>

          {/* Related Recipes */}
          <div className="mt-12">
            <RelatedRecipes
              recipes={relatedRecipes}
              title="You Might Also Like"
            />
          </div>
        </div>
      </div>

      {/* Cooking Mode Toggle */}
      <CookingModeToggle
        isActive={isCookingMode}
        onToggle={handleCookingModeToggle}
        currentStep={currentStep}
        totalSteps={recipe.instructions.length}
        onNextStep={handleNextStep}
        onPrevStep={handlePrevStep}
        onExitMode={handleExitCookingMode}
      />
    </div>
  );
};

export default RecipeDetailCookingInstructions;