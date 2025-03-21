
import React from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { LucideIcon } from 'lucide-react';

interface AccordionSectionProps {
  value: string;
  title: string;
  icon: React.ReactElement;
  color: string;
  gradientClass: string;
  borderClass: string;
  children: React.ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
  value,
  title,
  icon,
  color,
  gradientClass,
  borderClass,
  children
}) => {
  return (
    <AccordionItem value={value} className={`rounded-xl overflow-hidden border ${borderClass} shadow-md`}>
      <AccordionTrigger className={`px-6 py-4 ${gradientClass} hover:no-underline`}>
        <h3 className={`text-xl font-medium ${color} flex items-center`}>
          {React.cloneElement(icon, { size: 18, className: "mr-2" })}
          {title}
        </h3>
      </AccordionTrigger>
      <AccordionContent className="px-6">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
};

export default AccordionSection;
