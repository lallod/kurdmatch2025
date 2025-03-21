
export interface Field {
  name: string;
  label: string;
  value: string;
  type?: 'text' | 'select' | 'radio' | 'checkbox' | 'textarea' | 'listInput';
  options?: string[];
}

export interface DetailEditorProps {
  icon: React.ReactNode;
  title: string;
  fields: Field[];
  listMode?: boolean;
  selectionMode?: boolean;
}

export interface FieldEditState {
  [key: string]: boolean;
}

export interface EditedFields {
  [key: string]: string;
}

export interface ListItems {
  [key: string]: string[];
}

export interface NewItems {
  [key: string]: string;
}
