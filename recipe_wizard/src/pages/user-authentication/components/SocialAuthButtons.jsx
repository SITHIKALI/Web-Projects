import React from 'react';
import Button from '../../../components/ui/Button';


const SocialAuthButtons = ({ onSocialAuth, loading }) => {
  const socialProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: 'Chrome',
      bgColor: 'bg-white hover:bg-gray-50',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-300'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'Facebook',
      bgColor: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-white',
      borderColor: 'border-blue-600'
    }
  ];

  return (
    <div className="space-y-3 mb-6">
      {socialProviders.map((provider) => (
        <Button
          key={provider.id}
          variant="outline"
          fullWidth
          onClick={() => onSocialAuth(provider.id)}
          loading={loading === provider.id}
          disabled={loading}
          className={`
            ${provider.bgColor} ${provider.textColor} ${provider.borderColor}
            border-2 py-3 font-medium
          `}
          iconName={provider.icon}
          iconPosition="left"
          iconSize={20}
        >
          Continue with {provider.name}
        </Button>
      ))}
      
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-muted-foreground">Or continue with email</span>
        </div>
      </div>
    </div>
  );
};

export default SocialAuthButtons;