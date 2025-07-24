import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CookingModeToggle = ({ 
  isActive, 
  onToggle, 
  currentStep = 0, 
  totalSteps = 0,
  onNextStep,
  onPrevStep,
  onExitMode 
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wakeLock, setWakeLock] = useState(null);

  useEffect(() => {
    if (isActive) {
      // Request wake lock to keep screen on
      requestWakeLock();
      
      // Add keyboard listeners for navigation
      const handleKeyPress = (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
          e.preventDefault();
          onNextStep?.();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          onPrevStep?.();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          onExitMode?.();
        }
      };

      document.addEventListener('keydown', handleKeyPress);
      
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
        releaseWakeLock();
      };
    }
  }, [isActive, onNextStep, onPrevStep, onExitMode]);

  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        const lock = await navigator.wakeLock.request('screen');
        setWakeLock(lock);
      }
    } catch (err) {
      console.log('Wake lock request failed:', err);
    }
  };

  const releaseWakeLock = () => {
    if (wakeLock) {
      wakeLock.release();
      setWakeLock(null);
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.log('Fullscreen request failed:', err);
    }
  };

  const handleToggle = () => {
    if (isActive) {
      releaseWakeLock();
      if (document.fullscreenElement) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
    onToggle?.();
  };

  if (!isActive) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          variant="default"
          size="lg"
          onClick={handleToggle}
          className="shadow-modal rounded-full px-6"
        >
          <Icon name="ChefHat" size={20} className="mr-2" />
          Cooking Mode
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Cooking Mode Overlay */}
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggle}
            >
              <Icon name="X" size={20} />
            </Button>
            
            <div className="flex items-center space-x-2">
              <Icon name="ChefHat" size={20} className="text-primary" />
              <span className="font-heading font-semibold text-foreground">
                Cooking Mode
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
            >
              <Icon 
                name={isFullscreen ? "Minimize2" : "Maximize2"} 
                size={20} 
              />
            </Button>
            
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {totalSteps}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted h-1">
          <div
            className="bg-primary h-1 transition-all duration-300"
            style={{
              width: `${totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0}%`
            }}
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-4xl w-full text-center">
            <div className="bg-card border border-border rounded-lg p-8 shadow-modal">
              <div className="mb-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-foreground">
                    {currentStep + 1}
                  </span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-heading font-semibold text-foreground mb-4">
                  Current Cooking Step
                </h2>
                
                <p className="text-lg md:text-xl text-foreground leading-relaxed">
                  This is where the current cooking instruction would be displayed in large, easy-to-read text.
                </p>
              </div>

              {/* Timer Display (if applicable) */}
              <div className="mb-6">
                <div className="inline-flex items-center space-x-2 bg-warning/10 border border-warning/20 rounded-lg px-4 py-2">
                  <Icon name="Timer" size={20} className="text-warning" />
                  <span className="text-warning-foreground font-medium">
                    Timer: 5:00 minutes
                  </span>
                </div>
              </div>

              {/* Voice Commands Hint */}
              <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Mic" size={16} />
                  <span>Say "Next" or "Previous" to navigate, or use arrow keys</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="p-6 border-t border-border bg-card">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <Button
              variant="outline"
              size="lg"
              onClick={onPrevStep}
              disabled={currentStep === 0}
            >
              <Icon name="ChevronLeft" size={20} className="mr-2" />
              Previous
            </Button>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="lg"
              >
                <Icon name="Pause" size={20} className="mr-2" />
                Pause Timer
              </Button>
              
              <Button
                variant="ghost"
                size="lg"
              >
                <Icon name="RotateCcw" size={20} className="mr-2" />
                Restart Step
              </Button>
            </div>

            <Button
              variant="default"
              size="lg"
              onClick={onNextStep}
              disabled={currentStep >= totalSteps - 1}
            >
              Next
              <Icon name="ChevronRight" size={20} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookingModeToggle;