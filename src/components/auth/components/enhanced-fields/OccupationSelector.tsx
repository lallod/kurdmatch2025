
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Briefcase, ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OccupationSelectorProps {
  value?: string;
  onChange: (value: string) => void;
}

// Top 50 common occupations among Kurdish people
const occupations = [
  { category: 'Business & Trade', jobs: [
    'Business Owner', 'Shop Owner', 'Import/Export Trader', 'Restaurant Owner', 'Real Estate Agent',
    'Sales Manager', 'Marketing Specialist', 'Entrepreneur', 'Consultant', 'Retail Manager'
  ]},
  { category: 'Healthcare', jobs: [
    'Doctor', 'Nurse', 'Dentist', 'Pharmacist', 'Medical Assistant', 'Physiotherapist',
    'Medical Technician', 'Surgeon', 'Pediatrician', 'General Practitioner'
  ]},
  { category: 'Education', jobs: [
    'Teacher', 'Professor', 'School Principal', 'Tutor', 'Education Administrator',
    'Researcher', 'Academic', 'Language Instructor', 'Educational Consultant'
  ]},
  { category: 'Technology', jobs: [
    'Software Engineer', 'IT Specialist', 'Web Developer', 'Data Analyst', 'Network Administrator',
    'Cybersecurity Specialist', 'Database Administrator', 'Mobile App Developer'
  ]},
  { category: 'Government & Public Service', jobs: [
    'Government Employee', 'Civil Servant', 'Police Officer', 'Military Personnel',
    'Social Worker', 'Public Health Officer', 'Municipality Worker'
  ]},
  { category: 'Construction & Engineering', jobs: [
    'Civil Engineer', 'Construction Worker', 'Architect', 'Electrical Engineer',
    'Mechanical Engineer', 'Project Manager', 'Contractor', 'Site Supervisor'
  ]},
  { category: 'Transportation & Logistics', jobs: [
    'Driver', 'Taxi Driver', 'Truck Driver', 'Logistics Coordinator', 'Transportation Manager'
  ]},
  { category: 'Agriculture & Farming', jobs: [
    'Farmer', 'Agricultural Engineer', 'Livestock Farmer', 'Agricultural Consultant'
  ]},
  { category: 'Arts & Media', jobs: [
    'Journalist', 'Artist', 'Musician', 'Writer', 'Photographer', 'Film Producer',
    'TV Presenter', 'Translator', 'Cultural Worker'
  ]},
  { category: 'Other Professional', jobs: [
    'Lawyer', 'Accountant', 'Banker', 'Insurance Agent', 'Security Guard',
    'Chef', 'Hairdresser', 'Electrician', 'Plumber', 'Student', 'Unemployed', 'Retired'
  ]}
];

const OccupationSelector = ({ value, onChange }: OccupationSelectorProps) => {
  const [open, setOpen] = useState(false);

  const allOccupations = occupations.flatMap(category => 
    category.jobs.map(job => ({ name: job, category: category.category }))
  );

  const selectedOccupation = allOccupations.find(occ => occ.name === value);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Briefcase className="w-4 h-4 text-purple-400" />
        <Label className="text-white">Occupation</Label>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20"
          >
            {selectedOccupation ? selectedOccupation.name : "Select occupation..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-gray-900 border-gray-700">
          <Command>
            <CommandInput 
              placeholder="Search occupations..." 
              className="text-white"
            />
            <CommandEmpty>No occupation found.</CommandEmpty>
            <div className="max-h-60 overflow-auto">
              {occupations.map((category) => (
                <CommandGroup key={category.category} heading={category.category} className="text-white">
                  {category.jobs.map((job) => (
                    <CommandItem
                      key={job}
                      value={job}
                      onSelect={(currentValue) => {
                        onChange(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                      className="text-white hover:bg-gray-800"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === job ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {job}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </div>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default OccupationSelector;
