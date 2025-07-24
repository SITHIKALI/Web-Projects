import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CookingInstructions = ({ instructions, onTimerStart }) => {
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [activeTimers, setActiveTimers] = useState(new Map());

  const handleStepComplete = (stepId) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
  };

  const handleTimerStart = (stepId, duration) => {
    if (onTimerStart) {
      onTimerStart(stepId, duration);
    }
    
    // Start local timer tracking
    const newTimers = new Map(activeTimers);
    newTimers.set(stepId, {
      duration,
      startTime: Date.now()
    });
    setActiveTimers(newTimers);
  };

  const extractTimerFromText = (text) => {
    const timeRegex = /(\d+)\s*(minute|min|hour|hr)s?/gi;
    const matches = text.match(timeRegex);
    if (matches && matches.length > 0) {
      const timeStr = matches[0];
      const number = parseInt(timeStr.match(/\d+/)[0]);
      const unit = timeStr.toLowerCase().includes('hour') || timeStr.toLowerCase().includes('hr') ? 'hours' : 'minutes';
      return { duration: number, unit, text: timeStr };
    }
    return null;
  };

  const formatStepText = (text) => {
    const timer = extractTimerFromText(text);
    if (!timer) return text;
    
    return text.replace(timer.text, `**${timer.text}**`);
  };

  const renderFormattedText = (text) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <span key={index} className="font-semibold text-primary">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-semibold text-foreground">
          Cooking Instructions
        </h2>
        
        {/* Progress Indicator */}
        <div className="text-sm text-muted-foreground">
          {completedSteps.size} of {instructions.length} steps completed
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{
            width: `${(completedSteps.size / instructions.length) * 100}%`
          }}
        />
      </div>

      {/* Instructions List */}
      <div className="space-y-4">
        {instructions.map((step, index) => {
          const isCompleted = completedSteps.has(step.id);
          const timer = extractTimerFromText(step.instruction);
          const hasTimer = activeTimers.has(step.id);

          return (
            <div
              key={step.id}
              className={`
                bg-card border border-border rounded-lg p-4 transition-all duration-200
                ${isCompleted ? 'bg-success/5 border-success/20' : ''}
              `}
            >
              <div className="flex items-start space-x-4">
                {/* Step Number */}
                <div className={`
                  flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                  ${isCompleted 
                    ? 'bg-success text-success-foreground' 
                    : 'bg-primary text-primary-foreground'
                  }
                `}>
                  {isCompleted ? (
                    <Icon name="Check" size={16} />
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className={`
                        text-foreground leading-relaxed
                        ${isCompleted ? 'line-through text-muted-foreground' : ''}
                      `}>
                        {renderFormattedText(formatStepText(step.instruction))}
                      </p>
                      
                      {step.tip && (
                        <div className="mt-2 p-2 bg-accent/10 border border-accent/20 rounded text-sm">
                          <div className="flex items-start space-x-2">
                            <Icon name="Lightbulb" size={14} className="text-accent flex-shrink-0 mt-0.5" />
                            <span className="text-accent-foreground">{step.tip}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Timer Button */}
                    {timer && (
                      <Button
                        variant={hasTimer ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleTimerStart(step.id, timer.duration)}
                        className="ml-4 flex-shrink-0"
                      >
                        <Icon name="Timer" size={16} className="mr-2" />
                        {timer.duration} {timer.unit}
                      </Button>
                    )}
                  </div>

                  {/* Step Image */}
                  {step.image && (
                    <div className="mb-3">
                      <div className="relative aspect-video max-w-md rounded-lg overflow-hidden">
                        <Image
                          src={step.image}
                          alt={`Step ${index + 1} illustration`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Complete Step Button */}
                      <Button
                        variant={isCompleted ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleStepComplete(step.id)}
                      >
                        <Icon 
                          name={isCompleted ? "CheckCircle" : "Circle"} 
                          size={16} 
                          className="mr-2" 
                        />
                        {isCompleted ? "Completed" : "Mark Complete"}
                      </Button>

                      {/* Equipment Info */}
                      {step.equipment && step.equipment.length > 0 && (
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Icon name="Utensils" size={14} />
                          <span>{step.equipment.join(', ')}</span>
                        </div>
                      )}
                    </div>

                    {/* Temperature Info */}
                    {step.temperature && (
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Icon name="Thermometer" size={14} />
                        <span>{step.temperature}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Message */}
      {completedSteps.size === instructions.length && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Icon name="PartyPopper" size={24} className="text-success" />
            <div>
              <p className="font-semibold text-success-foreground">
                Congratulations! You've completed all steps.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Your delicious meal is ready to serve!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CookingInstructions;