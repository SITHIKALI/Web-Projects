import React from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FeaturedCollections = () => {
  const navigate = useNavigate();

  const collections = [
    {
      id: 'quick-weeknight',
      title: 'Quick Weeknight Dinners',
      description: 'Delicious meals ready in 30 minutes or less',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=400&h=300&fit=crop',
      recipeCount: 24,
      icon: 'Clock',
      color: 'bg-primary/10 text-primary'
    },
    {
      id: 'healthy-options',
      title: 'Healthy Options',
      description: 'Nutritious recipes for a balanced lifestyle',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
      recipeCount: 32,
      icon: 'Heart',
      color: 'bg-success/10 text-success'
    },
    {
      id: 'comfort-food',
      title: 'Comfort Food',
      description: 'Soul-warming dishes for cozy moments',
      image: 'https://images.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg?w=400&h=300&fit=crop',
      recipeCount: 18,
      icon: 'Home',
      color: 'bg-warning/10 text-warning'
    }
  ];

  const handleCollectionClick = (collectionId) => {
    // Navigate to search with collection filter
    navigate(`/recipe-search-browse?collection=${collectionId}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-semibold text-foreground text-xl">
          Featured Collections
        </h2>
        <Button
          variant="ghost"
          onClick={() => navigate('/recipe-search-browse?view=collections')}
          className="text-primary hover:text-primary/80"
        >
          View All
          <Icon name="ArrowRight" size={16} className="ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((collection) => (
          <div
            key={collection.id}
            className="bg-card border border-border rounded-lg overflow-hidden shadow-recipe-card hover:shadow-modal transition-all duration-200 cursor-pointer group"
            onClick={() => handleCollectionClick(collection.id)}
          >
            {/* Collection Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={collection.image}
                alt={collection.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Recipe Count Badge */}
              <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1">
                <span className="text-xs font-medium text-foreground">
                  {collection.recipeCount} recipes
                </span>
              </div>
            </div>

            {/* Collection Content */}
            <div className="p-4">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${collection.color}`}>
                  <Icon name={collection.icon} size={20} />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-heading font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {collection.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {collection.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCollections;