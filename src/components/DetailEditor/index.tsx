
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ListModeField from './ListModeField';
import StandardField from './StandardField';
import { DetailEditorProps, Field } from './types';
import { convertHeightToCm } from './constants';

const DetailEditor: React.FC<DetailEditorProps> = ({ 
  icon, 
  title, 
  fields, 
  listMode = false,
  selectionMode = false
}) => {
  const [editMode, setEditMode] = useState(false);
  
  const processedFields = fields.map(field => {
    if (field.name === 'height' && field.value.includes("'")) {
      return {
        ...field,
        value: convertHeightToCm(field.value)
      };
    }
    return field;
  });

  const [editedFields, setEditedFields] = useState<Record<string, string>>(
    processedFields.reduce((acc, field) => ({ ...acc, [field.name]: field.value }), {})
  );
  
  const [listItems, setListItems] = useState<Record<string, string[]>>(
    processedFields.reduce((acc, field) => ({ 
      ...acc, 
      [field.name]: field.value.split(', ') 
    }), {})
  );
  
  const [newItems, setNewItems] = useState<Record<string, string>>(
    processedFields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  );

  const [fieldEditStates, setFieldEditStates] = useState<Record<string, boolean>>(
    processedFields.reduce((acc, field) => ({ ...acc, [field.name]: false }), {})
  );

  const handleFieldChange = (name: string, value: string) => {
    if (name === 'height' && value.includes("'")) {
      value = convertHeightToCm(value);
    }
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

  const handleNewItemChange = (fieldName: string, value: string) => {
    setNewItems(prev => ({ ...prev, [fieldName]: value }));
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
      </div>

      {listMode ? (
        <div className="space-y-4">
          {fields.map((field) => (
            <ListModeField
              key={field.name}
              field={field}
              listItems={listItems}
              newItems={newItems}
              fieldEditStates={fieldEditStates}
              editMode={editMode}
              onAddItem={handleAddItem}
              onRemoveItem={handleRemoveItem}
              onNewItemChange={handleNewItemChange}
              onSaveField={saveField}
              onToggleFieldEdit={toggleFieldEditMode}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field) => (
            <StandardField
              key={field.name}
              field={field}
              editedFields={editedFields}
              fieldEditStates={fieldEditStates}
              editMode={editMode}
              onFieldChange={handleFieldChange}
              onSaveField={saveField}
              onToggleFieldEdit={toggleFieldEditMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DetailEditor;
