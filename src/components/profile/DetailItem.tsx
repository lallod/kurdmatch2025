
import React, { useState } from 'react';
import { Pencil, Check, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  editable?: boolean;
  fieldKey?: string;
  fieldType?: 'text' | 'select';
  fieldOptions?: string[];
  onFieldEdit?: (updates: Record<string, any>) => Promise<void>;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value, editable, fieldKey, fieldType = 'text', fieldOptions = [], onFieldEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleStartEdit = () => {
    if (!editable || !onFieldEdit || !fieldKey) return;
    const currentVal = typeof value === 'string' ? value : '';
    setTempValue(currentVal);
    setIsEditing(true);
  };

  const handleSave = async (val?: string) => {
    const saveVal = val ?? tempValue;
    if (!onFieldEdit || !fieldKey) return;
    setSaving(true);
    try {
      await onFieldEdit({ [fieldKey]: saveVal });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch {
      // error handled by parent
    } finally {
      setSaving(false);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') setIsEditing(false);
  };

  return (
    <div className="flex items-start gap-3 py-3 group">
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-primary transition-all hover:shadow-lg hover:from-primary/30 hover:to-accent/30">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground font-medium">
          {label}
        </p>
        <div className="font-medium mt-1 text-foreground flex items-center gap-1.5">
          {isEditing ? (
            fieldType === 'select' && fieldOptions.length > 0 ? (
              <Select
                value={tempValue}
                onValueChange={(val) => {
                  setTempValue(val);
                  handleSave(val);
                }}
              >
                <SelectTrigger className="h-8 text-sm w-auto min-w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fieldOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                autoFocus
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={() => handleSave()}
                onKeyDown={handleKeyDown}
                className="h-8 text-sm w-auto min-w-[140px]"
              />
            )
          ) : (
            <>
              <div className="flex-1">{value}</div>
              {editable && onFieldEdit && (
                saving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground flex-shrink-0" />
                ) : saved ? (
                  <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                ) : (
                  <button
                    onClick={handleStartEdit}
                    className="h-6 w-6 rounded-full inline-flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-primary/10 transition-all flex-shrink-0"
                  >
                    <Pencil className="h-3 w-3 text-primary" />
                  </button>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailItem;
