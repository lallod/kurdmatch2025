
import React from 'react';
import { Button as ShadcnButton } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  icon,
  variant = 'default',
  onClick,
  className,
}) => {
  return (
    <ShadcnButton
      variant={variant}
      onClick={onClick}
      className={className}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </ShadcnButton>
  );
};

export default Button;
