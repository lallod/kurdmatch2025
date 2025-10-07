/**
 * SecureInput Component
 * 
 * An input component with built-in XSS protection and validation
 * Automatically sanitizes input and enforces validation rules
 */

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sanitizeString } from '@/utils/security/input-validation';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface SecureInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'url' | 'number';
  maxLength: number;
  pattern?: RegExp;
  placeholder?: string;
  required?: boolean;
  showValidation?: boolean;
  error?: string;
  className?: string;
}

export const SecureInput: React.FC<SecureInputProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  maxLength,
  pattern,
  placeholder,
  required = false,
  showValidation = false,
  error,
  className = '',
}) => {
  const [localError, setLocalError] = useState<string>('');
  const [isValid, setIsValid] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Sanitize input
    const sanitized = sanitizeString(rawValue, maxLength, pattern);
    
    if (sanitized === null) {
      if (rawValue.length > maxLength) {
        setLocalError(`Maximum ${maxLength} characters allowed`);
      } else if (pattern) {
        setLocalError('Invalid format');
      }
      setIsValid(false);
      return;
    }
    
    setLocalError('');
    setIsValid(sanitized.length > 0);
    onChange(sanitized);
  };

  const displayError = error || localError;
  const showSuccess = showValidation && isValid && !displayError && value.length > 0;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label className="flex items-center justify-between">
          <span>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </span>
          {showSuccess && (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          )}
        </Label>
      )}
      
      <Input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`${displayError ? 'border-destructive' : ''} ${showSuccess ? 'border-green-500' : ''}`}
      />
      
      {displayError && (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{displayError}</span>
        </div>
      )}
    </div>
  );
};
