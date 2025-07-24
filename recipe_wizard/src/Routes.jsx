import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import UserAuthentication from "pages/user-authentication";
import IngredientInputRecipeDiscovery from "pages/ingredient-input-recipe-discovery";
import RecipeSearchBrowse from "pages/recipe-search-browse";
import MealPlanningCalendar from "pages/meal-planning-calendar";
import RecipeDetailCookingInstructions from "pages/recipe-detail-cooking-instructions";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<RecipeSearchBrowse />} />
        <Route path="/user-authentication" element={<UserAuthentication />} />
        <Route path="/ingredient-input-recipe-discovery" element={<IngredientInputRecipeDiscovery />} />
        <Route path="/recipe-search-browse" element={<RecipeSearchBrowse />} />
        <Route path="/meal-planning-calendar" element={<MealPlanningCalendar />} />
        <Route path="/recipe-detail-cooking-instructions" element={<RecipeDetailCookingInstructions />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;