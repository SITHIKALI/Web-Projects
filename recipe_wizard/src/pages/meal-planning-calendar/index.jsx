import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import TabNavigation from '../../components/ui/TabNavigation';
import WeeklyCalendar from './components/WeeklyCalendar';
import RecipeSelectionModal from './components/RecipeSelectionModal';
import ShoppingListGenerator from './components/ShoppingListGenerator';
import MealPlanSidebar from './components/MealPlanSidebar';

const MealPlanningCalendar = () => {
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    return startOfWeek;
  });
  
  const [plannedMeals, setPlannedMeals] = useState({});
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState(null);

  // Mock planned meals data
  useEffect(() => {
    const mockPlannedMeals = {
      [`${new Date().toDateString()}-breakfast`]: {
        recipe: {
          id: '1',
          title: 'Avocado Toast with Poached Egg',
          image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400',
          cookTime: '15 min',
          difficulty: 'Easy',
          rating: 4.6,
          reviewCount: 234,
          servings: 2,
          ingredients: ['Avocado', 'Eggs', 'Bread', 'Lemon', 'Salt', 'Pepper']
        },
        servings: 2,
        mealType: 'breakfast'
      },
      [`${new Date(Date.now() + 86400000).toDateString()}-lunch`]: {
        recipe: {
          id: '2',
          title: 'Mediterranean Quinoa Bowl',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
          cookTime: '25 min',
          difficulty: 'Easy',
          rating: 4.8,
          reviewCount: 189,
          servings: 4,
          ingredients: ['Quinoa', 'Cucumber', 'Tomatoes', 'Olives', 'Feta', 'Olive Oil']
        },
        servings: 3,
        mealType: 'lunch'
      }
    };
    
    setPlannedMeals(mockPlannedMeals);
  }, []);

  const handleWeekChange = (newWeek) => {
    setCurrentWeek(newWeek);
  };

  const handleAddMeal = (date, mealType) => {
    setSelectedDate(date);
    setSelectedMealType(mealType);
    setIsRecipeModalOpen(true);
  };

  const handleSelectRecipe = (date, mealType, recipe) => {
    const key = `${date.toDateString()}-${mealType}`;
    setPlannedMeals(prev => ({
      ...prev,
      [key]: {
        recipe,
        servings: recipe.servings || 2,
        mealType
      }
    }));
  };

  const handleRemoveMeal = (date, mealType) => {
    const key = `${date.toDateString()}-${mealType}`;
    setPlannedMeals(prev => {
      const newMeals = { ...prev };
      delete newMeals[key];
      return newMeals;
    });
  };

  const handleUpdateServings = (date, mealType, servings) => {
    const key = `${date.toDateString()}-${mealType}`;
    setPlannedMeals(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        servings
      }
    }));
  };

  const handleViewRecipe = (recipe) => {
    navigate(`/recipe-detail-cooking-instructions?id=${recipe.id}`);
  };

  const handleGenerateShoppingList = () => {
    setIsShoppingListOpen(true);
  };

  const handleQuickAdd = (recipe) => {
    // For demo purposes, add to today's lunch
    const today = new Date();
    const key = `${today.toDateString()}-lunch`;
    
    setPlannedMeals(prev => ({
      ...prev,
      [key]: {
        recipe,
        servings: recipe.servings || 2,
        mealType: 'lunch'
      }
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TabNavigation />
      
      <main className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground mb-2">
              Meal Planning Calendar
            </h1>
            <p className="text-muted-foreground">
              Plan your weekly meals and generate shopping lists to stay organized and reduce food waste.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Calendar */}
            <div className="lg:col-span-3">
              <WeeklyCalendar
                currentWeek={currentWeek}
                onWeekChange={handleWeekChange}
                plannedMeals={plannedMeals}
                onAddMeal={handleAddMeal}
                onRemoveMeal={handleRemoveMeal}
                onUpdateServings={handleUpdateServings}
                onViewRecipe={handleViewRecipe}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <MealPlanSidebar
                onGenerateShoppingList={handleGenerateShoppingList}
                plannedMeals={plannedMeals}
                onQuickAdd={handleQuickAdd}
                className="sticky top-36"
              />
            </div>
          </div>

          {/* Floating Action Button - Mobile */}
          <div className="fixed bottom-6 right-6 lg:hidden">
            <button
              onClick={handleGenerateShoppingList}
              disabled={Object.keys(plannedMeals).length === 0}
              className={`
                w-14 h-14 rounded-full shadow-lg flex items-center justify-center
                transition-all duration-200 transform hover:scale-105
                ${Object.keys(plannedMeals).length === 0
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }
              `}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                />
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* Recipe Selection Modal */}
      <RecipeSelectionModal
        isOpen={isRecipeModalOpen}
        onClose={() => setIsRecipeModalOpen(false)}
        onSelectRecipe={handleSelectRecipe}
        selectedDate={selectedDate}
        selectedMealType={selectedMealType}
      />

      {/* Shopping List Generator */}
      {isShoppingListOpen && (
        <ShoppingListGenerator
          plannedMeals={plannedMeals}
          onClose={() => setIsShoppingListOpen(false)}
        />
      )}
    </div>
  );
};

export default MealPlanningCalendar;