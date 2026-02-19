import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Briefcase, ChevronDown, Check } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

interface SimpleOccupationSelectorProps {
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

const SimpleOccupationSelector = ({ value, onChange }: SimpleOccupationSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslations();

  // Ensure value is always a string
  const currentValue = value || '';

  // Safely flatten occupations array with defensive checks
  const allOccupations = occupations && occupations.length > 0 
    ? occupations.flatMap(category => 
        category && category.jobs && Array.isArray(category.jobs)
          ? category.jobs.map(job => ({ name: job, category: category.category }))
          : []
      )
    : [];

  const filteredOccupations = allOccupations.filter(occ => 
    occ && occ.name && occ.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOccupation = allOccupations.find(occ => occ && occ.name === currentValue);

  const handleSelect = (selectedValue: string) => {
    if (!onChange) return;
    onChange(selectedValue === currentValue ? "" : selectedValue);
    setOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Briefcase className="w-4 h-4 text-purple-400" />
        <Label className="text-white">{t('career.occupation', 'Occupation')}</Label>
      </div>
      
      {/* Occupation selector */}
      <div className="relative">
        <Button
          variant="outline"
          className="w-full justify-between bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20"
          onClick={() => setOpen(!open)}
        >
          <span className={selectedOccupation ? "text-white" : "text-purple-300"}>
            {selectedOccupation ? selectedOccupation.name : t('occupation.select', 'Select occupation...')}
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </Button>
        
        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50 max-h-60 overflow-hidden">
            <div className="p-2 border-b border-gray-700">
              <input
                type="text"
                placeholder={t('occupation.search', 'Search occupations...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filteredOccupations.length === 0 ? (
                <div className="p-4 text-center text-gray-400">{t('occupation.not_found', 'No occupations found')}</div>
              ) : (
                <>
                  {occupations.map((category) => {
                    const categoryJobs = filteredOccupations.filter(occ => occ.category === category.category);
                    if (categoryJobs.length === 0) return null;
                    
                    return (
                      <div key={category.category}>
                        <div className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 border-b border-gray-700">
                          {category.category}
                        </div>
                        {categoryJobs.map((occupation) => (
                          <button
                            key={occupation.name}
                            className="w-full px-4 py-2 text-left text-white hover:bg-gray-800 flex items-center justify-between"
                            onClick={() => handleSelect(occupation.name)}
                          >
                            <span className="text-white">{occupation.name}</span>
                            {currentValue === occupation.name && (
                              <Check className="h-4 w-4 text-purple-400" />
                            )}
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleOccupationSelector;