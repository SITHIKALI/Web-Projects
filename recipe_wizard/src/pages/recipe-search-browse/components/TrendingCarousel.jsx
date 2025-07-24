import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TrendingCarousel = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const trendingRecipes = [
    {
      id: 'trending-1',
      title: 'Creamy Garlic Parmesan Pasta',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800&h=600&fit=crop',
      description: 'Rich and creamy pasta dish perfect for weeknight dinners',
      cookTime: '25 min',
      difficulty: 'Easy',
      rating: 4.8,
      trending: '#1 This Week'
    },
    {
      id: 'trending-2',
      title: 'Korean BBQ Beef Bowl',
      image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?w=800&h=600&fit=crop',
      description: 'Savory marinated beef with fresh vegetables and rice',
      cookTime: '30 min',
      difficulty: 'Medium',
      rating: 4.9,
      trending: '#2 This Week'
    },
    {
      id: 'trending-3',
      title: 'Mediterranean Chickpea Salad',
      image: 'https://images.pixabay.com/photo/2017/05/11/19/44/fresh-fruits-2305192_1280.jpg?w=800&h=600&fit=crop',
      description: 'Fresh and healthy salad with Mediterranean flavors',
      cookTime: '15 min',
      difficulty: 'Easy',
      rating: 4.7,
      trending: '#3 This Week'
    },
    {
      id: 'trending-4',
      title: 'Chocolate Lava Cake',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop',
      description: 'Decadent dessert with molten chocolate center',
      cookTime: '20 min',
      difficulty: 'Medium',
      rating: 4.9,
      trending: '#4 This Week'
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % trendingRecipes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, trendingRecipes.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const handlePrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + trendingRecipes.length) % trendingRecipes.length);
    setIsAutoPlaying(false);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % trendingRecipes.length);
    setIsAutoPlaying(false);
  };

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe-detail-cooking-instructions?id=${recipeId}`);
  };

  return (
    <div className="relative bg-card border border-border rounded-lg overflow-hidden shadow-recipe-card">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          <h2 className="font-heading font-semibold text-foreground text-lg">
            Trending This Week
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            className="h-8 w-8"
          >
            <Icon name="ChevronLeft" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="h-8 w-8"
          >
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>
      </div>

      {/* Carousel Content */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        {trendingRecipes.map((recipe, index) => (
          <div
            key={recipe.id}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out cursor-pointer ${
              index === currentSlide ? 'translate-x-0' : 
              index < currentSlide ? '-translate-x-full' : 'translate-x-full'
            }`}
            onClick={() => handleRecipeClick(recipe.id)}
          >
            <div className="relative h-full">
              <Image
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                    {recipe.trending}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={14} className="text-secondary fill-current" />
                    <span className="text-sm">{recipe.rating}</span>
                  </div>
                </div>
                
                <h3 className="font-heading font-semibold text-xl mb-2">
                  {recipe.title}
                </h3>
                
                <p className="text-white/90 text-sm mb-3 line-clamp-2">
                  {recipe.description}
                </p>
                
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={14} />
                    <span>{recipe.cookTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="ChefHat" size={14} />
                    <span>{recipe.difficulty}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {trendingRecipes.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TrendingCarousel;