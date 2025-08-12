import React from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
interface AccordionSectionItemProps {
  value: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
}
const AccordionSectionItem = ({
  value,
  title,
  icon,
  color,
  children
}: AccordionSectionItemProps) => {
  return <AccordionItem value={value} className="border-purple-400/20">
      <AccordionTrigger className="text-white hover:text-purple-200 mx-[5px] my-[10px] px-[5px] py-[10px]">
        <div className="flex items-center gap-2">
          <div className={`h-4 w-4 ${color}`}>
            {icon}
          </div>
          <span className="text-sm font-medium">{title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-1 pt-2">
        {children}
      </AccordionContent>
    </AccordionItem>;
};
export default AccordionSectionItem;