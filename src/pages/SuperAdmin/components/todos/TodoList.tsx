
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { CheckSquare } from 'lucide-react';
import TodoItem from './TodoItem';
import TodoFilters from './TodoFilters';
import { TodoListProps, TodoFiltersProps } from './types';

interface TodoListWithFiltersProps extends TodoListProps, Omit<TodoFiltersProps, 'clearFilters'> {
  clearFilters: () => void;
}

const TodoList: React.FC<TodoListWithFiltersProps> = ({
  todos,
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  priorityFilter,
  setPriorityFilter,
  clearFilters,
  onStatusChange,
  onDeleteTodo
}) => {
  const filteredTodos = todos
    .filter(todo => activeTab === 'all' ? true : todo.status === activeTab)
    .filter(todo => priorityFilter === 'all' ? true : todo.priority === priorityFilter)
    .filter(todo => 
      searchTerm === '' ? true : 
      todo.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      todo.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium flex items-center">
          <CheckSquare size={18} className="mr-2" /> Task List
        </CardTitle>
        <TodoFilters 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          clearFilters={clearFilters}
        />
      </CardHeader>
      <CardContent>
        <TabsContent value={activeTab} className="mt-0">
          <div className="space-y-3">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                {searchTerm || priorityFilter !== 'all' 
                  ? "No tasks found matching your filters" 
                  : "No tasks found in this category"}
              </div>
            ) : (
              filteredTodos.map(todo => (
                <TodoItem 
                  key={todo.id} 
                  todo={todo} 
                  onStatusChange={onStatusChange}
                  onDeleteTodo={onDeleteTodo}
                />
              ))
            )}
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default TodoList;
