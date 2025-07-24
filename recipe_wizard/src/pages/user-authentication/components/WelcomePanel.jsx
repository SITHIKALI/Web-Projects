import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const WelcomePanel = () => {
  const features = [
    {
      icon: 'Search',
      title: 'Smart Recipe Discovery',
      description: 'Find recipes based on ingredients you already have at home'
    },
    {
      icon: 'Calendar',
      title: 'Meal Planning',
      description: 'Plan your weekly meals and generate shopping lists automatically'
    },
    {
      icon: 'Heart',
      title: 'Save Favorites',
      description: 'Build your personal collection of favorite recipes and rate dishes'
    },
    {
      icon: 'Users',
      title: 'Community Sharing',
      description: 'Share your culinary creations and discover recipes from other home cooks'
    }
  ];

  return (
    <div className="hidden lg:flex lg:flex-col lg:justify-center lg:px-8 lg:py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-md mx-auto">
        {/* Hero Image */}
        <div className="mb-8 text-center">
          <div className="relative">
            <Image
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="Delicious home-cooked meal with fresh ingredients"
              className="w-full h-64 object-cover rounded-2xl shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
        </div>

        {/* Welcome Content */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
            Welcome to Recipe Wizard
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Transform your cooking experience with personalized recipe discovery, 
            smart meal planning, and a community of passionate home cooks.
          </p>
        </div>

        {/* Features List */}
        <div className="space-y-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={feature.icon} size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-foreground mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">50K+</div>
              <div className="text-xs text-muted-foreground">Recipes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">25K+</div>
              <div className="text-xs text-muted-foreground">Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">4.8★</div>
              <div className="text-xs text-muted-foreground">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePanel;