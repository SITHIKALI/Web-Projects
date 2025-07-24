import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import TabNavigation from '../../components/ui/TabNavigation';
import FilterPanel from '../../components/ui/FilterPanel';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import TrendingCarousel from './components/TrendingCarousel';
import FeaturedCollections from './components/FeaturedCollections';
import SearchSuggestions from './components/SearchSuggestions';
import SearchResults from './components/SearchResults';
import ActiveFilters from './components/ActiveFilters';
import VoiceSearch from './components/VoiceSearch';

const RecipeSearchBrowse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [filters, setFilters] = useState({
    cuisine: [],
    dietary: [],
    mealType: [],
    cookTime: '',
    difficulty: []
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const query = searchParams.get('q');
    const collection = searchParams.get('collection');
    
    if (query) {
      setSearchQuery(query);
      setIsSearching(true);
      setShowSuggestions(false);
    } else if (collection) {
      // Handle collection filtering
      setIsSearching(true);
      setShowSuggestions(false);
    } else {
      setIsSearching(false);
    }
  }, [searchParams]);

  const handleSearch = (query) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      setSearchQuery(trimmedQuery);
      setSearchParams({ q: trimmedQuery });
      setIsSearching(true);
      setShowSuggestions(false);
    } else {
      setSearchParams({});
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length > 0 || (!value && !isSearching));
  };

  const handleSearchFocus = () => {
    setShowSuggestions(true);
  };

  const handleSearchBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleVoiceResult = (transcript) => {
    setSearchQuery(transcript);
    handleSearch(transcript);
  };

  const handleVoiceStateChange = (isActive) => {
    setIsVoiceActive(isActive);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleRemoveFilter = (category, value) => {
    setFilters(prev => {
      if (category === 'cookTime') {
        return { ...prev, [category]: '' };
      } else {
        const currentValues = prev[category] || [];
        return {
          ...prev,
          [category]: currentValues.filter(v => v !== value)
        };
      }
    });
  };

  const handleClearAllFilters = () => {
    setFilters({
      cuisine: [],
      dietary: [],
      mealType: [],
      cookTime: '',
      difficulty: []
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
    setIsSearching(false);
    setShowSuggestions(false);
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(value => 
      Array.isArray(value) ? value.length > 0 : Boolean(value)
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TabNavigation />
      
      <main className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          {/* Search Section */}
          <div className="mb-8">
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Search recipes, ingredients, cuisines..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    className="pr-20 text-lg h-12"
                  />
                  
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                    <VoiceSearch
                      onVoiceResult={handleVoiceResult}
                      onVoiceStateChange={handleVoiceStateChange}
                    />
                    
                    {searchQuery && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={clearSearch}
                        className="h-8 w-8"
                      >
                        <Icon name="X" size={16} />
                      </Button>
                    )}
                    
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Icon name="Search" size={16} />
                    </Button>
                  </div>
                </div>
                
                {/* Search Suggestions Dropdown */}
                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-50">
                    <SearchSuggestions
                      searchQuery={searchQuery}
                      onSuggestionClick={handleSuggestionClick}
                    />
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Content Layout */}
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-36 space-y-6">
                <FilterPanel
                  onFiltersChange={handleFiltersChange}
                  initialFilters={filters}
                  collapsible={false}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-6">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="flex items-center space-x-2"
                  >
                    <Icon name="Filter" size={16} />
                    <span>Filters</span>
                    {hasActiveFilters() && (
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                        {Object.values(filters).flat().filter(Boolean).length}
                      </span>
                    )}
                  </Button>
                </div>
                
                {showMobileFilters && (
                  <div className="mt-4">
                    <FilterPanel
                      onFiltersChange={handleFiltersChange}
                      initialFilters={filters}
                      collapsible={true}
                    />
                  </div>
                )}
              </div>

              {/* Active Filters */}
              {hasActiveFilters() && (
                <div className="mb-6">
                  <ActiveFilters
                    filters={filters}
                    onRemoveFilter={handleRemoveFilter}
                    onClearAll={handleClearAllFilters}
                  />
                </div>
              )}

              {/* Content Based on Search State */}
              {!isSearching ? (
                <div className="space-y-8">
                  {/* Trending Carousel */}
                  <TrendingCarousel />
                  
                  {/* Featured Collections */}
                  <FeaturedCollections />
                  
                  {/* Quick Actions */}
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h2 className="font-heading font-semibold text-foreground text-lg mb-4">
                      Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Button
                        variant="outline"
                        onClick={() => navigate('/ingredient-input-recipe-discovery')}
                        className="h-auto p-4 flex flex-col items-center space-y-2"
                      >
                        <Icon name="Plus" size={24} className="text-primary" />
                        <div className="text-center">
                          <div className="font-medium">Find by Ingredients</div>
                          <div className="text-xs text-muted-foreground">
                            Use what you have
                          </div>
                        </div>
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => handleSearch('surprise me')}
                        className="h-auto p-4 flex flex-col items-center space-y-2"
                      >
                        <Icon name="Shuffle" size={24} className="text-secondary" />
                        <div className="text-center">
                          <div className="font-medium">Surprise Me!</div>
                          <div className="text-xs text-muted-foreground">
                            Random recipe discovery
                          </div>
                        </div>
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => navigate('/meal-planning-calendar')}
                        className="h-auto p-4 flex flex-col items-center space-y-2"
                      >
                        <Icon name="Calendar" size={24} className="text-accent" />
                        <div className="text-center">
                          <div className="font-medium">Meal Planning</div>
                          <div className="text-xs text-muted-foreground">
                            Plan your week
                          </div>
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <SearchResults
                  searchQuery={searchQuery}
                  filters={filters}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecipeSearchBrowse;