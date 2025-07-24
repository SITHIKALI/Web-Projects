import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import MealSlot from './MealSlot';

const WeeklyCalendar = ({ 
  currentWeek, 
  onWeekChange, 
  plannedMeals, 
  onAddMeal, 
  onRemoveMeal, 
  onUpdateServings,
  onViewRecipe 
}) => {
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'day'

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

  const getWeekDates = (startDate) => {
    const dates = [];
    const start = new Date(startDate);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates(currentWeek);
  const today = new Date();
  
  const isToday = (date) => {
    return date.toDateString() === today.toDateString();
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getMealTypeLabel = (mealType) => {
    return mealType.charAt(0).toUpperCase() + mealType.slice(1);
  };

  const getMealTypeIcon = (mealType) => {
    const icons = {
      breakfast: 'Coffee',
      lunch: 'Utensils',
      dinner: 'UtensilsCrossed',
      snack: 'Cookie'
    };
    return icons[mealType] || 'Utensils';
  };

  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction * 7));
    onWeekChange(newWeek);
  };

  const goToCurrentWeek = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    onWeekChange(startOfWeek);
  };

  const getWeekRange = () => {
    const start = weekDates[0];
    const end = weekDates[6];
    
    if (start.getMonth() === end.getMonth()) {
      return `${start.toLocaleDateString('en-US', { month: 'long' })} ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`;
    } else {
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${start.getFullYear()}`;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Calendar Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={20} className="text-primary" />
            <h2 className="font-heading font-semibold text-foreground text-lg">
              Meal Planning Calendar
            </h2>
          </div>
          
          {/* View Mode Toggle - Mobile */}
          <div className="md:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'week' ? 'day' : 'week')}
              iconName={viewMode === 'week' ? 'Calendar' : 'CalendarDays'}
              iconPosition="left"
            >
              {viewMode === 'week' ? 'Day' : 'Week'}
            </Button>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateWeek(-1)}
            className="h-8 w-8"
          >
            <Icon name="ChevronLeft" size={16} />
          </Button>
          
          <div className="text-center">
            <h3 className="font-medium text-foreground">
              {getWeekRange()}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToCurrentWeek}
              className="text-xs text-muted-foreground hover:text-foreground mt-1"
            >
              Go to Today
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateWeek(1)}
            className="h-8 w-8"
          >
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>
      </div>

      {/* Calendar Grid - Desktop */}
      <div className="hidden md:block">
        <div className="grid grid-cols-7 border-b border-border">
          {weekDates.map((date, index) => (
            <div
              key={index}
              className={`
                p-3 text-center border-r border-border last:border-r-0
                ${isToday(date) ? 'bg-primary/10' : ''}
              `}
            >
              <div className="font-medium text-foreground text-sm">
                {daysOfWeek[index]}
              </div>
              <div className={`
                text-xs mt-1
                ${isToday(date) ? 'text-primary font-medium' : 'text-muted-foreground'}
              `}>
                {formatDate(date)}
              </div>
            </div>
          ))}
        </div>

        {/* Meal Slots Grid */}
        <div className="grid grid-cols-7">
          {weekDates.map((date, dayIndex) => (
            <div key={dayIndex} className="border-r border-border last:border-r-0">
              {mealTypes.map((mealType, mealIndex) => (
                <div
                  key={`${dayIndex}-${mealType}`}
                  className={`
                    p-2 border-b border-border last:border-b-0 min-h-[120px]
                    ${mealIndex % 2 === 0 ? 'bg-background' : 'bg-muted/20'}
                  `}
                >
                  <div className="flex items-center space-x-1 mb-2">
                    <Icon 
                      name={getMealTypeIcon(mealType)} 
                      size={12} 
                      className="text-muted-foreground" 
                    />
                    <span className="text-xs text-muted-foreground font-medium">
                      {getMealTypeLabel(mealType)}
                    </span>
                  </div>
                  
                  <MealSlot
                    date={date}
                    mealType={mealType}
                    plannedMeal={plannedMeals[`${date.toDateString()}-${mealType}`]}
                    onAddMeal={onAddMeal}
                    onRemoveMeal={onRemoveMeal}
                    onUpdateServings={onUpdateServings}
                    onViewRecipe={onViewRecipe}
                    compact={true}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Calendar View */}
      <div className="md:hidden">
        {viewMode === 'week' ? (
          <div className="overflow-x-auto">
            <div className="flex min-w-max">
              {weekDates.map((date, index) => (
                <div
                  key={index}
                  className={`
                    flex-shrink-0 w-32 border-r border-border last:border-r-0
                    ${isToday(date) ? 'bg-primary/5' : ''}
                  `}
                >
                  <div className="p-3 text-center border-b border-border">
                    <div className="font-medium text-foreground text-sm">
                      {daysOfWeek[index].slice(0, 3)}
                    </div>
                    <div className={`
                      text-xs mt-1
                      ${isToday(date) ? 'text-primary font-medium' : 'text-muted-foreground'}
                    `}>
                      {formatDate(date)}
                    </div>
                  </div>
                  
                  <div className="space-y-1 p-2">
                    {mealTypes.map((mealType) => (
                      <MealSlot
                        key={`${index}-${mealType}`}
                        date={date}
                        mealType={mealType}
                        plannedMeal={plannedMeals[`${date.toDateString()}-${mealType}`]}
                        onAddMeal={onAddMeal}
                        onRemoveMeal={onRemoveMeal}
                        onUpdateServings={onUpdateServings}
                        onViewRecipe={onViewRecipe}
                        compact={true}
                        mobile={true}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Day View for Mobile
          <div className="space-y-4 p-4">
            {weekDates.map((date, index) => (
              <div
                key={index}
                className={`
                  border border-border rounded-lg overflow-hidden
                  ${isToday(date) ? 'border-primary bg-primary/5' : ''}
                `}
              >
                <div className="p-3 bg-muted/30 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">
                        {daysOfWeek[index]}
                      </div>
                      <div className={`
                        text-sm
                        ${isToday(date) ? 'text-primary font-medium' : 'text-muted-foreground'}
                      `}>
                        {formatDate(date)}
                      </div>
                    </div>
                    {isToday(date) && (
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                        Today
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-3 space-y-3">
                  {mealTypes.map((mealType) => (
                    <div key={mealType} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Icon 
                          name={getMealTypeIcon(mealType)} 
                          size={16} 
                          className="text-muted-foreground" 
                        />
                        <span className="text-sm font-medium text-foreground">
                          {getMealTypeLabel(mealType)}
                        </span>
                      </div>
                      
                      <MealSlot
                        date={date}
                        mealType={mealType}
                        plannedMeal={plannedMeals[`${date.toDateString()}-${mealType}`]}
                        onAddMeal={onAddMeal}
                        onRemoveMeal={onRemoveMeal}
                        onUpdateServings={onUpdateServings}
                        onViewRecipe={onViewRecipe}
                        compact={false}
                        mobile={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyCalendar;