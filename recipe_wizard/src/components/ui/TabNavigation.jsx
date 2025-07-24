import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const TabNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    {
      id: 'discover',
      label: 'Discover',
      icon: 'Search',
      paths: ['/ingredient-input-recipe-discovery', '/recipe-search-browse', '/recipe-detail-cooking-instructions'],
      defaultPath: '/ingredient-input-recipe-discovery',
      tooltip: 'Find recipes by ingredients or browse collections'
    },
    {
      id: 'plan',
      label: 'Plan',
      icon: 'Calendar',
      paths: ['/meal-planning-calendar'],
      defaultPath: '/meal-planning-calendar',
      tooltip: 'Plan your meals and create shopping lists'
    },
    {
      id: 'saved',
      label: 'Saved',
      icon: 'Heart',
      paths: ['/saved-recipes'], // This would be a future route for saved recipes
      defaultPath: '/saved-recipes',
      tooltip: 'Your favorite recipes and collections'
    }
  ];

  const getActiveTab = () => {
    const currentPath = location.pathname;
    return tabs.find(tab => tab.paths.includes(currentPath))?.id || 'discover';
  };

  const handleTabClick = (tab) => {
    if (tab.id === 'saved') {
      // For now, redirect to discover since saved recipes isn't implemented
      navigate('/ingredient-input-recipe-discovery');
      return;
    }
    navigate(tab.defaultPath);
  };

  const activeTab = getActiveTab();

  return (
    <nav className="sticky top-16 z-40 bg-background border-b border-border">
      <div className="flex">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`
                flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium transition-colors duration-200
                ${isActive 
                  ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
              title={tab.tooltip}
            >
              <Icon 
                name={tab.icon} 
                size={18} 
                className={`mr-2 ${isActive ? 'text-primary' : ''}`}
              />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default TabNavigation;