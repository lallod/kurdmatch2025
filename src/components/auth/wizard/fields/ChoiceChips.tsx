
import React from 'react';
import { cn } from '@/lib/utils';

interface ChoiceOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

interface ChoiceChipsProps {
  options: ChoiceOption[];
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  columns?: number;
}

export const ChoiceChips: React.FC<ChoiceChipsProps> = ({
  options,
  value,
  onChange,
  className,
  columns = 2
}) => {
  return (
    <div className={cn(
      "grid gap-3",
      columns === 1 && "grid-cols-1",
      columns === 2 && "grid-cols-1 sm:grid-cols-2",
      columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      className
    )}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "p-4 rounded-xl border-2 transition-all duration-200 text-left",
            "hover:border-purple-300 hover:bg-purple-50",
            "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
            value === option.value
              ? "border-purple-500 bg-purple-100 shadow-md"
              : "border-gray-200 bg-white"
          )}
        >
          <div className="flex items-start gap-3">
            {option.icon && (
              <div className={cn(
                "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                value === option.value ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-600"
              )}>
                {option.icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className={cn(
                "font-medium text-sm",
                value === option.value ? "text-purple-900" : "text-gray-900"
              )}>
                {option.label}
              </p>
              {option.description && (
                <p className={cn(
                  "text-xs mt-1",
                  value === option.value ? "text-purple-600" : "text-gray-500"
                )}>
                  {option.description}
                </p>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};
