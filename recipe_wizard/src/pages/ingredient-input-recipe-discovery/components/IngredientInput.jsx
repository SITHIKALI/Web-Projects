import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const IngredientInput = ({ 
  ingredients = [], 
  onAddIngredient, 
  onRemoveIngredient, 
  onUpdateQuantity,
  isVoiceRecording = false,
  onVoiceToggle 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [quantityValue, setQuantityValue] = useState('');
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Mock ingredient suggestions for autocomplete
  const mockSuggestions = [
    "Chicken breast", "Tomatoes", "Onions", "Garlic", "Bell peppers", "Mushrooms",
    "Spinach", "Carrots", "Potatoes", "Rice", "Pasta", "Olive oil", "Salt", "Pepper",
    "Basil", "Oregano", "Cheese", "Milk", "Eggs", "Flour", "Butter", "Lemon",
    "Broccoli", "Zucchini", "Salmon", "Ground beef", "Beans", "Corn", "Avocado",
    "Cilantro", "Ginger", "Soy sauce", "Honey", "Vinegar", "Paprika", "Cumin"
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim()) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase()) &&
        !ingredients.some(ing => ing.name.toLowerCase() === suggestion.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 8));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleAddIngredient = (ingredientName) => {
    if (ingredientName.trim() && !ingredients.some(ing => 
      ing.name.toLowerCase() === ingredientName.toLowerCase()
    )) {
      onAddIngredient({
        id: Date.now(),
        name: ingredientName.trim(),
        quantity: '1',
        unit: 'piece'
      });
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        handleAddIngredient(inputValue);
      }
    }
  };

  const handleQuantityEdit = (ingredient) => {
    setEditingIngredient(ingredient.id);
    setQuantityValue(ingredient.quantity);
  };

  const handleQuantityUpdate = (ingredientId) => {
    if (quantityValue.trim()) {
      onUpdateQuantity(ingredientId, quantityValue.trim());
    }
    setEditingIngredient(null);
    setQuantityValue('');
  };

  const handleQuantityKeyPress = (e, ingredientId) => {
    if (e.key === 'Enter') {
      handleQuantityUpdate(ingredientId);
    } else if (e.key === 'Escape') {
      setEditingIngredient(null);
      setQuantityValue('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Input Field with Voice */}
      <div className="relative" ref={suggestionsRef}>
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Add ingredients (e.g., chicken, tomatoes, onions...)"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="pr-12"
          />
          
          {/* Voice Input Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onVoiceToggle}
            className={`absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 ${
              isVoiceRecording ? 'text-error bg-error/10' : 'text-muted-foreground'
            }`}
            title="Voice input"
          >
            <Icon 
              name={isVoiceRecording ? "MicOff" : "Mic"} 
              size={16} 
            />
          </Button>
        </div>

        {/* Autocomplete Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-modal z-50 max-h-64 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleAddIngredient(suggestion)}
                className="w-full px-4 py-2 text-left hover:bg-muted transition-colors text-sm text-foreground"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Voice Recording Indicator */}
      {isVoiceRecording && (
        <div className="flex items-center justify-center space-x-2 p-3 bg-error/10 border border-error/20 rounded-lg">
          <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
          <span className="text-sm text-error font-medium">Listening...</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onVoiceToggle}
            className="text-error hover:bg-error/20"
          >
            Stop
          </Button>
        </div>
      )}

      {/* Added Ingredients */}
      {ingredients.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground">
            Added Ingredients ({ingredients.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className="flex items-center space-x-2 bg-accent/20 text-accent-foreground px-3 py-2 rounded-full text-sm border border-accent/30"
              >
                {editingIngredient === ingredient.id ? (
                  <input
                    type="text"
                    value={quantityValue}
                    onChange={(e) => setQuantityValue(e.target.value)}
                    onBlur={() => handleQuantityUpdate(ingredient.id)}
                    onKeyPress={(e) => handleQuantityKeyPress(e, ingredient.id)}
                    className="w-12 bg-transparent border-none outline-none text-center"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => handleQuantityEdit(ingredient)}
                    className="font-medium hover:underline"
                    title="Click to edit quantity"
                  >
                    {ingredient.quantity}
                  </button>
                )}
                
                <span>{ingredient.name}</span>
                
                <button
                  onClick={() => onRemoveIngredient(ingredient.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  title="Remove ingredient"
                >
                  <Icon name="X" size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popular Ingredients Suggestions */}
      {ingredients.length === 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Popular ingredients:
          </h3>
          <div className="flex flex-wrap gap-2">
            {mockSuggestions.slice(0, 8).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleAddIngredient(suggestion)}
                className="px-3 py-1 text-xs bg-muted text-muted-foreground hover:bg-accent/20 hover:text-accent-foreground rounded-full transition-colors"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientInput;