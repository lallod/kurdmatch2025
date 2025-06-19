
import React from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

interface AccordionSectionItemProps {
  value: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
}

const AccordionSectionItem = ({ value, title, icon, color, children }: AccordionSectionItemProps) => {
  return (
    <AccordionItem 
      value={value} 
      className="border border-white/20 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-2 hover:bg-white/10 transition-all duration-200"
    >
      <AccordionTrigger className="text-white hover:text-purple-200 py-3 hover:no-underline">
        <div className="flex items-center gap-3">
          <div className={`${color} flex-shrink-0`}>
            {icon}
          </div>
          <span className="text-base font-medium">{title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-2 pt-2 pb-1">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
};

export default AccordionSectionItem;
