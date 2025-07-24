import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VoiceSearch = ({ onVoiceResult, onVoiceStateChange }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
        if (onVoiceStateChange) onVoiceStateChange(true);
      };
      
      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(finalTranscript || interimTranscript);
        
        if (finalTranscript && onVoiceResult) {
          onVoiceResult(finalTranscript.trim());
        }
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
        setTranscript('');
        if (onVoiceStateChange) onVoiceStateChange(false);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setTranscript('');
        if (onVoiceStateChange) onVoiceStateChange(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, [onVoiceResult, onVoiceStateChange]);

  const startListening = () => {
    if (recognition && !isListening) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="relative">
      <Button
        variant={isListening ? "default" : "ghost"}
        size="icon"
        onClick={handleVoiceToggle}
        className={`
          transition-all duration-200
          ${isListening 
            ? 'bg-primary text-primary-foreground animate-pulse' 
            : 'hover:bg-muted'
          }
        `}
        title={isListening ? 'Stop voice search' : 'Start voice search'}
      >
        <Icon 
          name={isListening ? "MicOff" : "Mic"} 
          size={18} 
        />
      </Button>
      
      {/* Voice Input Indicator */}
      {isListening && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-popover border border-border rounded-lg p-3 shadow-modal min-w-48 z-50">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-foreground">Listening...</span>
          </div>
          
          {transcript && (
            <div className="text-sm text-muted-foreground">
              "{transcript}"
            </div>
          )}
          
          <div className="text-xs text-muted-foreground mt-2">
            Try saying: "Find pasta recipes" or "Show me healthy meals"
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceSearch;