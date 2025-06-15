
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';
import { UseFormReturn } from 'react-hook-form';
import { getCategoryIcon } from '../utils/categoryIcons';
import { cn } from '@/lib/utils';

interface MultiSelectFieldProps {
  question: QuestionItem;
  form: UseFormReturn<any>;
}

const MultiSelectField = ({ question, form }: MultiSelectFieldProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <FormField
      key={question.id}
      control={form.control}
      name={question.id}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="flex items-center space-x-2 text-gray-200">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-900/50 text-purple-400">
              {getCategoryIcon(question.category)}
            </span>
            <span>{question.text}</span>
            {question.required && <span className="text-red-400 text-sm">*</span>}
          </FormLabel>
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between bg-indigo-900/20 border-indigo-800 hover:bg-indigo-900/30 text-white"
                >
                  <div className="flex flex-wrap gap-1 max-w-full">
                    {field.value && field.value.length > 0 ? (
                      field.value.slice(0, 2).map((item: string) => (
                        <Badge key={item} variant="secondary" className="text-xs">
                          {item}
                          <button
                            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                const newValue = field.value.filter((v: string) => v !== item);
                                field.onChange(newValue);
                              }
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              const newValue = field.value.filter((v: string) => v !== item);
                              field.onChange(newValue);
                            }}
                          >
                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">{question.placeholder || "Select options..."}</span>
                    )}
                    {field.value && field.value.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{field.value.length - 2} more
                      </Badge>
                    )}
                  </div>
                  <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-gray-800 border-gray-700">
                <Command className="bg-gray-800">
                  <CommandInput placeholder="Search options..." className="text-white" />
                  <CommandList>
                    <CommandEmpty>No options found.</CommandEmpty>
                    <CommandGroup>
                      {question.fieldOptions.map((option) => (
                        <CommandItem
                          key={option}
                          value={option}
                          onSelect={() => {
                            const currentValue = field.value || [];
                            const isSelected = currentValue.includes(option);
                            
                            if (isSelected) {
                              field.onChange(currentValue.filter((item: string) => item !== option));
                            } else {
                              field.onChange([...currentValue, option]);
                            }
                          }}
                          className="text-white hover:bg-gray-700"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value && field.value.includes(option) ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {option}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  );
};

export default MultiSelectField;
