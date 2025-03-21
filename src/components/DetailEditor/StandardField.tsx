
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save, Edit, Check } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Field, EditedFields, FieldEditState } from './types';
import { OPTIONS, convertHeightToCm } from './constants';

interface StandardFieldProps {
  field: Field;
  editedFields: EditedFields;
  fieldEditStates: FieldEditState;
  editMode: boolean;
  onFieldChange: (name: string, value: string) => void;
  onSaveField: (fieldName: string) => void;
  onToggleFieldEdit: (fieldName: string) => void;
}

const StandardField: React.FC<StandardFieldProps> = ({
  field,
  editedFields,
  fieldEditStates,
  editMode,
  onFieldChange,
  onSaveField,
  onToggleFieldEdit
}) => {
  const getOptions = (field: Field) => {
    if (field.options) return field.options;
    return OPTIONS[field.name as keyof typeof OPTIONS] || [];
  };

  const getFormattedOptions = (field: Field) => {
    const options = getOptions(field);
    if (field.name === 'height') {
      return options.map(option => {
        if (option.includes("'")) {
          return convertHeightToCm(option);
        }
        return option;
      });
    }
    return options;
  };

  const fieldType = field.type || (getOptions(field).length > 0 ? 'select' : 'text');
  const options = field.name === 'height' ? getFormattedOptions(field) : getOptions(field);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={field.name}>{field.label}</Label>
        {!editMode && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onToggleFieldEdit(field.name)}
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
              onChange={(e) => onFieldChange(field.name, e.target.value)}
              rows={3}
            />
          )}
          
          {fieldType === 'text' && (
            <Input
              id={field.name}
              value={editedFields[field.name]}
              onChange={(e) => onFieldChange(field.name, e.target.value)}
            />
          )}
          
          {fieldType === 'select' && options.length > 0 && (
            <Select
              value={editedFields[field.name]}
              onValueChange={(value) => onFieldChange(field.name, value)}
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
              onValueChange={(value) => onFieldChange(field.name, value)}
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
              <Button size="sm" onClick={() => onSaveField(field.name)}>
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
};

export default StandardField;
