import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, X, Edit, Check, Save } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

const OPTIONS = {
  bodyType: ['Athletic', 'Average', 'Slim', 'Muscular', 'Curvy', 'Full Figured'],
  height: ['5\'0"', '5\'1"', '5\'2"', '5\'3"', '5\'4"', '5\'5"', '5\'6"', '5\'7"', '5\'8"', '5\'9"', '5\'10"', '5\'11"', '6\'0"', '6\'1"', '6\'2"', '6\'3"', '6\'4"'],
  ethnicity: ['White', 'Black', 'Hispanic', 'Asian', 'Middle Eastern', 'Mixed', 'Other'],
  zodiacSign: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
  personalityType: ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'],
  relationshipGoals: ['Casual dating', 'Long-term relationship', 'Marriage', 'Not sure yet', 'Just making friends'],
  wantChildren: ['Want children', 'Don\'t want children', 'Have children', 'Open to children'],
  childrenStatus: ['No children', 'Have children', 'Have children and want more'],
  familyCloseness: ['Very close with family', 'Somewhat close with family', 'Not close with family'],
  exerciseHabits: ['Regular - 4-5 times per week', 'Occasional - 1-3 times per week', 'Rarely', 'Never'],
  sleepSchedule: ['Early bird', 'Night owl', 'Regular schedule', 'Irregular schedule'],
  financialHabits: ['Saver', 'Spender', 'Balanced', 'Saver with occasional splurges', 'Financial planner'],
  communicationStyle: ['Direct and thoughtful', 'Emotionally expressive', 'Reserved and thoughtful', 'Open and honest', 'Analytical'],
  workLifeBalance: ['Work focused', 'Life focused', 'Balanced', 'Values boundaries between work and personal life'],
  favoriteSeason: ['Spring', 'Summer', 'Fall', 'Winter'],
  drinking: ['Never', 'Rarely', 'Socially', 'Regularly'],
  smoking: ['Never', 'Socially', 'Regularly', 'Trying to quit'],
  religion: ['Christian', 'Catholic', 'Jewish', 'Muslim', 'Hindu', 'Buddhist', 'Spiritual', 'Agnostic', 'Atheist', 'Other'],
  politicalViews: ['Liberal', 'Moderate', 'Conservative', 'Not political', 'Other'],
  loveLanguage: ['Quality Time', 'Physical Touch', 'Words of Affirmation', 'Acts of Service', 'Receiving Gifts'],
};

interface Field {
  name: string;
  label: string;
  value: string;
  type?: 'text' | 'select' | 'radio' | 'checkbox' | 'textarea' | 'listInput';
  options?: string[];
}

interface DetailEditorProps {
  icon: React.ReactNode;
  title: string;
  fields: Field[];
  listMode?: boolean;
  selectionMode?: boolean;
}

const DetailEditor: React.FC<DetailEditorProps> = ({ 
  icon, 
  title, 
  fields, 
  listMode = false,
  selectionMode = false
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editedFields, setEditedFields] = useState<Record<string, string>>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: field.value }), {})
  );
  
  const [listItems, setListItems] = useState<Record<string, string[]>>(
    fields.reduce((acc, field) => ({ 
      ...acc, 
      [field.name]: field.value.split(', ') 
    }), {})
  );
  
  const [newItems, setNewItems] = useState<Record<string, string>>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  );

  const [fieldEditStates, setFieldEditStates] = useState<Record<string, boolean>>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: false }), {})
  );

  const handleFieldChange = (name: string, value: string) => {
    setEditedFields(prev => ({ ...prev, [name]: value }));
  };

  const handleAddItem = (fieldName: string) => {
    if (newItems[fieldName].trim()) {
      setListItems(prev => ({
        ...prev,
        [fieldName]: [...prev[fieldName], newItems[fieldName].trim()]
      }));
      setNewItems(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const handleRemoveItem = (fieldName: string, index: number) => {
    setListItems(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    setEditMode(false);
  };

  const toggleFieldEditMode = (fieldName: string) => {
    setFieldEditStates(prev => ({ 
      ...prev, 
      [fieldName]: !prev[fieldName] 
    }));
  };

  const saveField = (fieldName: string) => {
    setFieldEditStates(prev => ({ 
      ...prev, 
      [fieldName]: false 
    }));
  };

  const getOptions = (field: Field) => {
    if (field.options) return field.options;
    return OPTIONS[field.name as keyof typeof OPTIONS] || [];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => editMode ? handleSave() : setEditMode(true)}
        >
          {editMode ? (
            <>
              <Check size={16} className="mr-1" /> Save All
            </>
          ) : (
            <>
              <Edit size={16} className="mr-1" /> Edit All
            </>
          )}
        </Button>
      </div>

      {listMode ? (
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={field.name}>{field.label}</Label>
                {!editMode && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleFieldEditMode(field.name)}
                    className="text-primary"
                  >
                    {fieldEditStates[field.name] ? (
                      <>
                        <Save size={16} className="mr-1" /> Save
                      </>
                    ) : (
                      <>
                        <Edit size={16} className="mr-1" /> Edit
                      </>
                    )}
                  </Button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-2">
                {listItems[field.name].map((item, index) => (
                  <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1.5">
                    {item}
                    {(editMode || fieldEditStates[field.name]) && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 ml-1 -mr-1 text-muted-foreground hover:text-foreground"
                        onClick={() => handleRemoveItem(field.name, index)}
                      >
                        <X size={12} />
                      </Button>
                    )}
                  </Badge>
                ))}
              </div>
              
              {(editMode || fieldEditStates[field.name]) && (
                <div className="flex gap-2">
                  <Input
                    id={`new-${field.name}`}
                    value={newItems[field.name]}
                    onChange={(e) => setNewItems(prev => ({ ...prev, [field.name]: e.target.value }))}
                    placeholder={`Add new ${field.label.toLowerCase()}`}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={() => handleAddItem(field.name)}>
                    <PlusCircle size={16} className="mr-1" /> Add
                  </Button>
                </div>
              )}
              
              {fieldEditStates[field.name] && !editMode && (
                <div className="flex justify-end mt-2">
                  <Button size="sm" onClick={() => saveField(field.name)}>
                    <Check size={16} className="mr-1" /> Save {field.label}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field) => {
            const fieldType = field.type || (selectionMode && getOptions(field).length > 0 ? 'select' : 'text');
            const options = getOptions(field);
            
            return (
              <div key={field.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  {!editMode && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleFieldEditMode(field.name)}
                      className="text-primary"
                    >
                      {fieldEditStates[field.name] ? (
                        <>
                          <Save size={16} className="mr-1" /> Save
                        </>
                      ) : (
                        <>
                          <Edit size={16} className="mr-1" /> Edit
                        </>
                      )}
                    </Button>
                  )}
                </div>
                
                {(editMode || fieldEditStates[field.name]) ? (
                  <>
                    {fieldType === 'textarea' && (
                      <Textarea
                        id={field.name}
                        value={editedFields[field.name]}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        rows={3}
                      />
                    )}
                    
                    {fieldType === 'text' && (
                      <Input
                        id={field.name}
                        value={editedFields[field.name]}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      />
                    )}
                    
                    {fieldType === 'select' && options.length > 0 && (
                      <Select
                        value={editedFields[field.name]}
                        onValueChange={(value) => handleFieldChange(field.name, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={`Select ${field.label}`} />
                        </SelectTrigger>
                        <SelectContent className="max-h-72">
                          {options.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    
                    {fieldType === 'radio' && options.length > 0 && (
                      <RadioGroup
                        value={editedFields[field.name]}
                        onValueChange={(value) => handleFieldChange(field.name, value)}
                        className="flex flex-col space-y-1"
                      >
                        {options.map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`${field.name}-${option}`} />
                            <Label htmlFor={`${field.name}-${option}`}>{option}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                    
                    {fieldEditStates[field.name] && !editMode && (
                      <div className="flex justify-end mt-2">
                        <Button size="sm" onClick={() => saveField(field.name)}>
                          <Check size={16} className="mr-1" /> Save {field.label}
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-2 rounded-md bg-secondary/50">
                    <span>{editedFields[field.name]}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DetailEditor;
