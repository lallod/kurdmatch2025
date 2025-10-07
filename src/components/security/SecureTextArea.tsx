/**
 * SecureTextArea Component
 * 
 * A textarea component with built-in XSS protection and validation
 * Automatically sanitizes input and enforces character limits
 */

import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { sanitizeInput } from '@/utils/security/xss-protection';
import { AlertCircle } from 'lucide-react';

interface SecureTextAreaProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  minLength?: number;
  placeholder?: string;
  required?: boolean;
  sanitizationLevel?: 'strict' | 'basic' | 'rich';
  showCharCount?: boolean;
  error?: string;
  className?: string;
}

export const SecureTextArea: React.FC<SecureTextAreaProps> = ({
  label,
  value,
  onChange,
  maxLength,
  minLength = 0,
  placeholder,
  required = false,
  sanitizationLevel = 'strict',
  showCharCount = true,
  error,
  className = '',
}) => {
  const [localError, setLocalError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const rawValue = e.target.value;
    
    // Sanitize input
    const sanitized = sanitizeInput(rawValue, sanitizationLevel);
    
    // Validate length
    if (sanitized.length > maxLength) {
      setLocalError(`Maximum ${maxLength} characters allowed`);
      return;
    }
    
    if (required && minLength > 0 && sanitized.length < minLength && sanitized.length > 0) {
      setLocalError(`Minimum ${minLength} characters required`);
    } else {
      setLocalError('');
    }
    
    onChange(sanitized);
  };

  const charCount = value.length;
  const isNearLimit = charCount > maxLength * 0.9;
  const displayError = error || localError;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label className="flex items-center justify-between">
          <span>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </span>
          {showCharCount && (
            <span className={`text-sm ${isNearLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
              {charCount}/{maxLength}
            </span>
          )}
        </Label>
      )}
      
      <Textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`${displayError ? 'border-destructive' : ''}`}
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
