import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AuthTabs from './components/AuthTabs';
import SocialAuthButtons from './components/SocialAuthButtons';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import WelcomePanel from './components/WelcomePanel';

const UserAuthentication = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store user session (mock)
      localStorage.setItem('userSession', JSON.stringify({
        email: formData.email,
        loginTime: new Date().toISOString(),
        rememberMe: formData.rememberMe
      }));
      
      // Redirect to main app
      navigate('/ingredient-input-recipe-discovery');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (formData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store user session (mock)
      localStorage.setItem('userSession', JSON.stringify({
        email: formData.email,
        dietaryPreferences: formData.dietaryPreferences,
        registrationTime: new Date().toISOString()
      }));
      
      // Redirect to main app
      navigate('/ingredient-input-recipe-discovery');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider) => {
    setSocialLoading(provider);
    try {
      // Simulate social auth
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store user session (mock)
      localStorage.setItem('userSession', JSON.stringify({
        email: `user@${provider}.com`,
        provider: provider,
        loginTime: new Date().toISOString()
      }));
      
      // Redirect to main app
      navigate('/ingredient-input-recipe-discovery');
    } catch (error) {
      console.error('Social auth error:', error);
    } finally {
      setSocialLoading(null);
    }
  };

  const handleForgotPassword = () => {
    // Mock forgot password flow
    alert('Password reset link has been sent to your email address.');
  };

  const handleContinueAsGuest = () => {
    // Store guest session
    localStorage.setItem('guestSession', JSON.stringify({
      isGuest: true,
      sessionStart: new Date().toISOString()
    }));
    
    navigate('/ingredient-input-recipe-discovery');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Welcome Panel - Desktop Only */}
      <WelcomePanel />

      {/* Authentication Panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 lg:px-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Icon name="ChefHat" size={24} color="white" />
              </div>
            </div>
            <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
              Recipe Wizard
            </h1>
            <p className="text-muted-foreground">
              {activeTab === 'login' ?'Welcome back! Sign in to access your recipes and meal plans.' :'Join thousands of home cooks discovering amazing recipes.'
              }
            </p>
          </div>

          {/* Auth Form Container */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-modal">
            {/* Tab Navigation */}
            <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Social Authentication */}
            <SocialAuthButtons 
              onSocialAuth={handleSocialAuth} 
              loading={socialLoading} 
            />

            {/* Forms */}
            {activeTab === 'login' ? (
              <LoginForm
                onSubmit={handleLogin}
                loading={loading}
                onForgotPassword={handleForgotPassword}
              />
            ) : (
              <RegisterForm
                onSubmit={handleRegister}
                loading={loading}
              />
            )}

            {/* Guest Access */}
            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Want to explore without an account?
              </p>
              <Button
                variant="ghost"
                onClick={handleContinueAsGuest}
                className="text-primary hover:text-primary/80"
              >
                Continue as Guest
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our{' '}
              <a href="#" className="text-primary hover:text-primary/80 underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:text-primary/80 underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAuthentication;