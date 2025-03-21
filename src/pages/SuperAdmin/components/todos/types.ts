
export interface Todo {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignee: {
    name: string;
    avatar: string;
  };
  createdAt: string;
}

export interface TodoFormProps {
  onAddTodo: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
}

export interface TodoListProps {
  todos: Todo[];
  activeTab: 'all' | 'todo' | 'in-progress' | 'completed';
  searchTerm: string;
  priorityFilter: 'all' | 'low' | 'medium' | 'high';
  onStatusChange: (todoId: number, newStatus: 'todo' | 'in-progress' | 'completed') => void;
  onDeleteTodo: (todoId: number) => void;
}

export interface TodoItemProps {
  todo: Todo;
  onStatusChange: (todoId: number, newStatus: 'todo' | 'in-progress' | 'completed') => void;
  onDeleteTodo: (todoId: number) => void;
}

export interface TodoFiltersProps {
  activeTab: 'all' | 'todo' | 'in-progress' | 'completed';
  setActiveTab: (tab: 'all' | 'todo' | 'in-progress' | 'completed') => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  priorityFilter: 'all' | 'low' | 'medium' | 'high';
  setPriorityFilter: (priority: 'all' | 'low' | 'medium' | 'high') => void;
  clearFilters: () => void;
}
