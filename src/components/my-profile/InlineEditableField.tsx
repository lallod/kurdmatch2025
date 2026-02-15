import React, { useState, useRef, useEffect } from 'react';
import { Pencil, Check, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface InlineEditableFieldProps {
  value: string;
  fieldKey: string;
  onSave: (updates: Record<string, any>) => Promise<void>;
  type?: 'text' | 'select';
  options?: string[];
  className?: string;
}

const InlineEditableField: React.FC<InlineEditableFieldProps> = ({
  value,
  fieldKey,
  onSave,
  type = 'text',
  options = [],
  className,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (tempValue === value) {
      setIsEditing(false);
      return;
    }
    setSaving(true);
    try {
      await onSave({ [fieldKey]: tempValue });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch {
      setTempValue(value);
    } finally {
      setSaving(false);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setTempValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    if (type === 'select' && options.length > 0) {
      return (
        <Select
          value={tempValue}
          onValueChange={(val) => {
            setTempValue(val);
            setTimeout(async () => {
              setSaving(true);
              try {
                await onSave({ [fieldKey]: val });
                setSaved(true);
                setTimeout(() => setSaved(false), 1500);
              } catch {
                setTempValue(value);
              } finally {
                setSaving(false);
                setIsEditing(false);
              }
            }, 0);
          }}
        >
          <SelectTrigger className="h-8 text-sm w-auto min-w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input
        ref={inputRef}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="h-8 text-sm w-auto min-w-[120px]"
      />
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-1.5 group/edit", className)}>
      <span>{value || 'Not specified'}</span>
      {saving ? (
        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
      ) : saved ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="h-5 w-5 rounded-full inline-flex items-center justify-center opacity-0 group-hover/edit:opacity-100 hover:bg-primary/10 transition-all"
        >
          <Pencil className="h-3 w-3 text-primary" />
        </button>
      )}
    </span>
  );
};

export default InlineEditableField;
