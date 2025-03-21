
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';

interface ProfileSectionButtonProps {
  icon: React.ReactElement;
  title: string;
  description: string;
  children: React.ReactNode;
}

const ProfileSectionButton: React.FC<ProfileSectionButtonProps> = ({
  icon,
  title,
  description,
  children
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full justify-between h-auto p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary/10">
              {React.cloneElement(icon, { className: "h-5 w-5 text-primary" })}
            </div>
            <div className="text-left">
              <h3 className="font-medium">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <Pencil size={16} className="text-muted-foreground" />
        </Button>
      </SheetTrigger>
      {children}
    </Sheet>
  );
};

export default ProfileSectionButton;
