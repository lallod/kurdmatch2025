
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TodoForm from '../components/todos/TodoForm';
import TodoList from '../components/todos/TodoList';
import { Todo } from '../components/todos/types';

const TodosPage = () => {
  const { toast } = useToast();
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: 1,
      title: 'Review new user profiles',
      description: 'Check and approve newly registered user profiles for compliance with platform guidelines.',
      status: 'todo',
      priority: 'medium',
      dueDate: '2023-06-15',
      assignee: {
        name: 'John D',
        avatar: 'https://i.pravatar.cc/150?img=10',
      },
      createdAt: '2023-06-10',
    },
    {
      id: 2,
      title: 'Update privacy policy',
      description: 'Update the privacy policy to reflect recent changes in data handling procedures.',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2023-06-20',
      assignee: {
        name: 'Sarah L',
        avatar: 'https://i.pravatar.cc/150?img=20',
      },
      createdAt: '2023-06-08',
    },
    {
      id: 3,
      title: 'Generate monthly revenue report',
      description: 'Compile and analyze revenue data for the past month.',
      status: 'completed',
      priority: 'high',
      dueDate: '2023-06-05',
      assignee: {
        name: 'Mike T',
        avatar: 'https://i.pravatar.cc/150?img=30',
      },
      createdAt: '2023-05-30',
    },
    {
      id: 4,
      title: 'Investigate user complaint #4587',
      description: 'Look into a complaint about inappropriate messaging from a user.',
      status: 'todo',
      priority: 'high',
      dueDate: '2023-06-12',
      assignee: {
        name: 'Emma S',
        avatar: 'https://i.pravatar.cc/150?img=40',
      },
      createdAt: '2023-06-11',
    },
    {
      id: 5,
      title: 'Plan marketing campaign for summer promotion',
      description: 'Develop strategies and content for the upcoming summer promotional event.',
      status: 'in-progress',
      priority: 'medium',
      dueDate: '2023-06-25',
      assignee: {
        name: 'David R',
        avatar: 'https://i.pravatar.cc/150?img=50',
      },
      createdAt: '2023-06-05',
    },
  ]);
  
  const [activeTab, setActiveTab] = useState<'all' | 'todo' | 'in-progress' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  
  const handleAddTodo = (newTodoData: Omit<Todo, 'id' | 'createdAt'>) => {
    const todo: Todo = {
      ...newTodoData,
      id: todos.length + 1,
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setTodos([...todos, todo]);
  };
  
  const handleStatusChange = (todoId: number, newStatus: 'todo' | 'in-progress' | 'completed') => {
    const updatedTodos = todos.map(todo => 
      todo.id === todoId ? { ...todo, status: newStatus } : todo
    );
    setTodos(updatedTodos);
    
    toast({
      title: "Status Updated",
      description: `Task status changed to ${newStatus}`,
    });
  };
  
  const handleDeleteTodo = (todoId: number) => {
    const updatedTodos = todos.filter(todo => todo.id !== todoId);
    setTodos(updatedTodos);
    
    toast({
      title: "Task Deleted",
      description: "Task has been deleted successfully.",
    });
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setPriorityFilter('all');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Task Management</h1>
          <p className="text-gray-500">Manage administrative tasks and todos</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">Export Tasks</Button>
          <Button className="bg-tinder-rose hover:bg-tinder-rose/90">
            <Plus size={16} className="mr-2" /> Add Task
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <TodoForm onAddTodo={handleAddTodo} />
        </div>
        
        <div className="lg:col-span-2">
          <TodoList 
            todos={todos}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            clearFilters={clearFilters}
            onStatusChange={handleStatusChange}
            onDeleteTodo={handleDeleteTodo}
          />
        </div>
      </div>
    </div>
  );
};

export default TodosPage;
