import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Input from './Input';
import Button from './Button';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isDiscoverTab = location.pathname === '/ingredient-input-recipe-discovery' || 
                       location.pathname === '/recipe-search-browse';

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recipe-search-browse?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleSignOut = () => {
    navigate('/user-authentication');
    setIsUserMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/ingredient-input-recipe-discovery')}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
              <Icon name="ChefHat" size={20} color="white" />
            </div>
            <h1 className="text-xl font-heading font-semibold text-foreground">
              Recipe Wizard
            </h1>
          </div>
        </div>

        {/* Search Bar - Only visible on Discover screens */}
        {isDiscoverTab && (
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search recipes, ingredients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                >
                  <Icon name="Search" size={16} />
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Mobile Search Icon - Only on Discover screens */}
          {isDiscoverTab && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => navigate('/recipe-search-browse')}
            >
              <Icon name="Search" size={20} />
            </Button>
          )}

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleUserMenuToggle}
              className="rounded-full"
            >
              <Icon name="User" size={20} />
            </Button>

            {/* User Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-modal z-50">
                <div className="p-2">
                  <div className="px-3 py-2 text-sm font-medium text-foreground border-b border-border mb-2">
                    My Account
                  </div>
                  <button
                    onClick={() => {
                      navigate('/meal-planning-calendar');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                  >
                    <Icon name="Calendar" size={16} className="mr-2" />
                    Meal Calendar
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                  >
                    <Icon name="Settings" size={16} className="mr-2" />
                    Settings
                  </button>
                  <div className="border-t border-border my-2"></div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center px-3 py-2 text-sm text-destructive hover:bg-muted rounded-md transition-colors"
                  >
                    <Icon name="LogOut" size={16} className="mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar - Only visible on Discover screens */}
      {isDiscoverTab && (
        <div className="md:hidden px-4 pb-3 border-t border-border">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <Input
                type="search"
                placeholder="Search recipes, ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              >
                <Icon name="Search" size={16} />
              </Button>
            </div>
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;