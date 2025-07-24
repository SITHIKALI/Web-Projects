import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NutritionInfo = ({ nutrition, servings = 4 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const calculatePerServing = (value) => {
    return Math.round((value / servings) * 10) / 10;
  };

  const getNutrientColor = (nutrient, value) => {
    const perServing = calculatePerServing(value);
    
    switch (nutrient) {
      case 'calories':
        if (perServing < 200) return 'text-success';
        if (perServing < 400) return 'text-warning';
        return 'text-error';
      case 'protein':
        if (perServing >= 20) return 'text-success';
        if (perServing >= 10) return 'text-warning';
        return 'text-muted-foreground';
      case 'fiber':
        if (perServing >= 5) return 'text-success';
        if (perServing >= 3) return 'text-warning';
        return 'text-muted-foreground';
      case 'sodium':
        if (perServing < 600) return 'text-success';
        if (perServing < 1200) return 'text-warning';
        return 'text-error';
      case 'sugar':
        if (perServing < 10) return 'text-success';
        if (perServing < 20) return 'text-warning';
        return 'text-error';
      default:
        return 'text-foreground';
    }
  };

  const mainNutrients = [
    { key: 'calories', label: 'Calories', unit: '', icon: 'Zap' },
    { key: 'protein', label: 'Protein', unit: 'g', icon: 'Dumbbell' },
    { key: 'carbs', label: 'Carbs', unit: 'g', icon: 'Wheat' },
    { key: 'fat', label: 'Fat', unit: 'g', icon: 'Droplet' }
  ];

  const detailedNutrients = [
    { key: 'fiber', label: 'Dietary Fiber', unit: 'g' },
    { key: 'sugar', label: 'Sugar', unit: 'g' },
    { key: 'sodium', label: 'Sodium', unit: 'mg' },
    { key: 'cholesterol', label: 'Cholesterol', unit: 'mg' },
    { key: 'saturatedFat', label: 'Saturated Fat', unit: 'g' },
    { key: 'transFat', label: 'Trans Fat', unit: 'g' },
    { key: 'vitaminA', label: 'Vitamin A', unit: '%' },
    { key: 'vitaminC', label: 'Vitamin C', unit: '%' },
    { key: 'calcium', label: 'Calcium', unit: '%' },
    { key: 'iron', label: 'Iron', unit: '%' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Activity" size={20} className="text-primary" />
            <h3 className="font-heading font-semibold text-foreground">
              Nutrition Information
            </h3>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span className="text-sm text-muted-foreground mr-2">
              {isExpanded ? 'Show Less' : 'Show More'}
            </span>
            <Icon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              size={16} 
            />
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mt-1">
          Per serving (serves {servings})
        </p>
      </div>

      {/* Main Nutrients */}
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {mainNutrients.map((nutrient) => {
            const value = nutrition[nutrient.key] || 0;
            const perServing = calculatePerServing(value);
            const colorClass = getNutrientColor(nutrient.key, value);

            return (
              <div key={nutrient.key} className="text-center">
                <div className="bg-muted/50 rounded-lg p-3">
                  <Icon 
                    name={nutrient.icon} 
                    size={24} 
                    className={`mx-auto mb-2 ${colorClass}`} 
                  />
                  <div className={`text-lg font-semibold ${colorClass}`}>
                    {perServing}{nutrient.unit}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {nutrient.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Macronutrient Breakdown */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-foreground mb-3">
            Macronutrient Breakdown
          </h4>
          
          <div className="space-y-2">
            {['protein', 'carbs', 'fat'].map((macro) => {
              const value = nutrition[macro] || 0;
              const perServing = calculatePerServing(value);
              const calories = perServing * (macro === 'fat' ? 9 : 4);
              const totalCalories = calculatePerServing(nutrition.calories || 0);
              const percentage = totalCalories > 0 ? Math.round((calories / totalCalories) * 100) : 0;

              const getBarColor = (macroType) => {
                switch (macroType) {
                  case 'protein': return 'bg-success';
                  case 'carbs': return 'bg-warning';
                  case 'fat': return 'bg-error';
                  default: return 'bg-muted';
                }
              };

              return (
                <div key={macro} className="flex items-center space-x-3">
                  <div className="w-16 text-sm text-muted-foreground capitalize">
                    {macro}
                  </div>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getBarColor(macro)}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-sm text-foreground min-w-[4rem] text-right">
                    {perServing}g ({percentage}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Nutrients (Expandable) */}
        {isExpanded && (
          <div className="border-t border-border pt-4">
            <h4 className="text-sm font-medium text-foreground mb-3">
              Detailed Nutrition
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {detailedNutrients.map((nutrient) => {
                const value = nutrition[nutrient.key] || 0;
                const perServing = calculatePerServing(value);
                const colorClass = getNutrientColor(nutrient.key, value);

                return (
                  <div key={nutrient.key} className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">
                      {nutrient.label}
                    </span>
                    <span className={`text-sm font-medium ${colorClass}`}>
                      {perServing}{nutrient.unit}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Nutrition Notes */}
            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <div className="flex items-start space-x-2">
                <Icon name="Info" size={16} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground">
                  <p className="mb-1">
                    * Percent Daily Values are based on a 2,000 calorie diet.
                  </p>
                  <p>
                    Nutritional information is approximate and may vary based on ingredients and preparation methods.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionInfo;