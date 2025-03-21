
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, X, Edit, Check, Save } from 'lucide-react';
import { Field, ListItems, NewItems, FieldEditState } from './types';

interface ListModeFieldProps {
  field: Field;
  listItems: ListItems;
  newItems: NewItems;
  fieldEditStates: FieldEditState;
  editMode: boolean;
  onAddItem: (fieldName: string) => void;
  onRemoveItem: (fieldName: string, index: number) => void;
  onNewItemChange: (fieldName: string, value: string) => void;
  onSaveField: (fieldName: string) => void;
  onToggleFieldEdit: (fieldName: string) => void;
}

const ListModeField: React.FC<ListModeFieldProps> = ({
  field,
  listItems,
  newItems,
  fieldEditStates,
  editMode,
  onAddItem,
  onRemoveItem,
  onNewItemChange,
  onSaveField,
  onToggleFieldEdit
}) => {
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
      
      <div className="flex flex-wrap gap-2 mb-2">
        {listItems[field.name].map((item, index) => (
          <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1.5">
            {item}
            {(editMode || fieldEditStates[field.name]) && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 ml-1 -mr-1 text-muted-foreground hover:text-foreground"
                onClick={() => onRemoveItem(field.name, index)}
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
            onChange={(e) => onNewItemChange(field.name, e.target.value)}
            placeholder={`Add new ${field.label.toLowerCase()}`}
            className="flex-1"
          />
          <Button size="sm" onClick={() => onAddItem(field.name)}>
            <PlusCircle size={16} className="mr-1" /> Add
          </Button>
        </div>
      )}
      
      {fieldEditStates[field.name] && !editMode && (
        <div className="flex justify-end mt-2">
          <Button size="sm" onClick={() => onSaveField(field.name)}>
            <Check size={16} className="mr-1" /> Save {field.label}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ListModeField;
