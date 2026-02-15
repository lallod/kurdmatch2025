import React, { useState } from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Pencil, X } from 'lucide-react';

interface EditableAccordionSectionProps {
  value: string;
  title: string;
  icon: React.ReactElement;
  color: string;
  gradientClass: string;
  borderClass: string;
  children: React.ReactNode;
  editorContent?: React.ReactNode;
  onEdit?: () => void;
}

const EditableAccordionSection: React.FC<EditableAccordionSectionProps> = ({
  value,
  title,
  icon,
  color,
  gradientClass,
  borderClass,
  children,
  editorContent,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleToggleEdit = () => {
    if (editorContent) {
      setIsEditing(prev => !prev);
    } else if (onEdit) {
      onEdit();
    }
  };

  return (
    <AccordionItem value={value} className={`rounded-xl overflow-hidden border ${borderClass} shadow-sm bg-card`}>
      <AccordionTrigger className={`px-4 py-3 ${gradientClass} hover:no-underline`}>
        <div className="flex items-center justify-between w-full pr-2">
          <h3 className={`text-sm font-semibold ${color} flex items-center`}>
            {React.cloneElement(icon, { size: 16, className: "mr-2" })}
            {title}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleEdit();
            }}
            className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
          >
            {isEditing ? (
              <X className="h-3.5 w-3.5 text-primary" />
            ) : (
              <Pencil className="h-3.5 w-3.5 text-primary" />
            )}
          </button>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-3">
        {isEditing && editorContent ? editorContent : children}
      </AccordionContent>
    </AccordionItem>
  );
};

export default EditableAccordionSection;
