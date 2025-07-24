import React from 'react';
import Icon from '../../../components/AppIcon';

const PasswordStrengthIndicator = ({ password }) => {
  const getPasswordStrength = (password) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[^A-Za-z0-9]/.test(password)
    };

    score = Object.values(checks).filter(Boolean).length;
    
    if (score < 2) return { strength: 'weak', color: 'text-error', bgColor: 'bg-error' };
    if (score < 4) return { strength: 'medium', color: 'text-warning', bgColor: 'bg-warning' };
    return { strength: 'strong', color: 'text-success', bgColor: 'bg-success' };
  };

  const { strength, color, bgColor } = getPasswordStrength(password);
  const strengthPercentage = {
    weak: 33,
    medium: 66,
    strong: 100
  };

  const requirements = [
    { text: 'At least 8 characters', met: password.length >= 8 },
    { text: 'Contains lowercase letter', met: /[a-z]/.test(password) },
    { text: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { text: 'Contains number', met: /\d/.test(password) },
    { text: 'Contains special character', met: /[^A-Za-z0-9]/.test(password) }
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Password strength</span>
        <span className={`text-xs font-medium capitalize ${color}`}>
          {strength}
        </span>
      </div>
      
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${bgColor}`}
          style={{ width: `${strengthPercentage[strength]}%` }}
        ></div>
      </div>

      <div className="space-y-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Icon
              name={req.met ? "CheckCircle" : "Circle"}
              size={14}
              className={req.met ? "text-success" : "text-muted-foreground"}
            />
            <span className={`text-xs ${req.met ? "text-success" : "text-muted-foreground"}`}>
              {req.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;