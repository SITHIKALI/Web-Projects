import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox, CheckboxGroup } from '../../../components/ui/Checkbox';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

const RegisterForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    dietaryPreferences: [],
    acceptTerms: false
  });
  const [errors, setErrors] = useState({});

  const dietaryOptions = [
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'gluten-free', label: 'Gluten-Free' },
    { value: 'dairy-free', label: 'Dairy-Free' },
    { value: 'keto', label: 'Keto' },
    { value: 'paleo', label: 'Paleo' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDietaryChange = (value, checked) => {
    setFormData(prev => ({
      ...prev,
      dietaryPreferences: checked
        ? [...prev.dietaryPreferences, value]
        : prev.dietaryPreferences.filter(pref => pref !== value)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        error={errors.email}
        required
      />

      <div>
        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          error={errors.password}
          required
        />
        {formData.password && (
          <div className="mt-2">
            <PasswordStrengthIndicator password={formData.password} />
          </div>
        )}
      </div>

      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        value={formData.confirmPassword}
        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
        error={errors.confirmPassword}
        required
      />

      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Dietary Preferences (Optional)
        </label>
        <CheckboxGroup>
          <div className="grid grid-cols-2 gap-2">
            {dietaryOptions.map((option) => (
              <Checkbox
                key={option.value}
                label={option.label}
                checked={formData.dietaryPreferences.includes(option.value)}
                onChange={(e) => handleDietaryChange(option.value, e.target.checked)}
                size="sm"
              />
            ))}
          </div>
        </CheckboxGroup>
      </div>

      <div>
        <Checkbox
          label={
            <span className="text-sm">
              I agree to the{' '}
              <a href="#" className="text-primary hover:text-primary/80 underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:text-primary/80 underline">
                Privacy Policy
              </a>
            </span>
          }
          checked={formData.acceptTerms}
          onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
          error={errors.acceptTerms}
          required
        />
      </div>

      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={loading}
        disabled={loading}
        className="py-3"
      >
        Create Account
      </Button>
    </form>
  );
};

export default RegisterForm;