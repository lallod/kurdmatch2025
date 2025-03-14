
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, X, Edit, Check } from 'lucide-react';

interface Field {
  name: string;
  label: string;
  value: string;
}

interface DetailEditorProps {
  icon: React.ReactNode;
  title: string;
  fields: Field[];
  listMode?: boolean;
}

const DetailEditor: React.FC<DetailEditorProps> = ({ icon, title, fields, listMode = false }) => {
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
    // Here you would typically save the data to your backend
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
          className="text-primary"
        >
          {editMode ? (
            <>
              <Check size={16} className="mr-1" /> Save
            </>
          ) : (
            <>
              <Edit size={16} className="mr-1" /> Edit
            </>
          )}
        </Button>
      </div>

      {listMode ? (
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              
              <div className="flex flex-wrap gap-2 mb-2">
                {listItems[field.name].map((item, index) => (
                  <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1.5">
                    {item}
                    {editMode && (
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
              
              {editMode && (
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
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              {editMode ? (
                field.value.length > 50 ? (
                  <Textarea
                    id={field.name}
                    value={editedFields[field.name]}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    rows={3}
                  />
                ) : (
                  <Input
                    id={field.name}
                    value={editedFields[field.name]}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  />
                )
              ) : (
                <div className="p-2 rounded-md bg-secondary/50">{editedFields[field.name]}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetailEditor;
