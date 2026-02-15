
import React, { useState } from 'react';
import { Pencil, Check, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  editable?: boolean;
  fieldKey?: string;
  fieldType?: 'text' | 'select' | 'multi-select';
  fieldOptions?: string[];
  onFieldEdit?: (updates: Record<string, any>) => Promise<void>;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value, editable, fieldKey, fieldType = 'text', fieldOptions = [], onFieldEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleStartEdit = () => {
    if (!editable || !onFieldEdit || !fieldKey) return;
    if (fieldType === 'multi-select') {
      // Extract current array value from the rendered value
      const currentVal = extractArrayValue(value);
      setSelectedItems(currentVal);
      setIsEditing(true);
    } else {
      const currentVal = typeof value === 'string' ? value : '';
      setTempValue(currentVal);
      setIsEditing(true);
    }
  };

  const extractArrayValue = (val: React.ReactNode): string[] => {
    // Try to extract text from Badge children
    if (React.isValidElement(val) && val.props?.children) {
      const children = val.props.children;
      if (Array.isArray(children)) {
        return children
          .filter((child: any) => React.isValidElement(child))
          .map((child: any) => {
            if (child.props?.children && typeof child.props.children === 'string') {
              return child.props.children;
            }
            return '';
          })
          .filter(Boolean);
      }
    }
    if (typeof val === 'string') {
      return val.split(', ').filter(Boolean);
    }
    return [];
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

  const handleMultiSelectToggle = async (item: string) => {
    if (!onFieldEdit || !fieldKey) return;
    const updated = selectedItems.includes(item)
      ? selectedItems.filter(i => i !== item)
      : [...selectedItems, item];
    setSelectedItems(updated);
    setSaving(true);
    try {
      await onFieldEdit({ [fieldKey]: updated });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch {
      // error handled by parent
    } finally {
      setSaving(false);
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
        <div className="font-medium mt-1 text-foreground">
          {isEditing && fieldType === 'multi-select' ? (
            <div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {fieldOptions.map((opt) => {
                  const isSelected = selectedItems.includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => handleMultiSelectToggle(opt)}
                      disabled={saving}
                      className={`text-xs px-2.5 py-1.5 rounded-full border transition-all ${
                        isSelected
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background text-foreground border-border/50 hover:border-primary/40'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs text-primary font-medium mt-2 hover:underline"
              >
                Done
              </button>
            </div>
          ) : isEditing ? (
            <div className="flex items-center gap-1.5">
              {fieldType === 'select' && fieldOptions.length > 0 ? (
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
                  <SelectContent className="bg-popover border border-border z-50">
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
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailItem;
