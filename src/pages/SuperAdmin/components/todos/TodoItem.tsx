
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Calendar, CircleUser, MoreHorizontal } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { TodoItemProps } from './types';

const TodoItem: React.FC<TodoItemProps> = ({ todo, onStatusChange, onDeleteTodo }) => {
  const priorityColorMap = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <div 
      className={`border rounded-lg p-4 ${todo.status === 'completed' ? 'bg-gray-50' : 'bg-white'}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <button 
            className={`mt-1 flex-shrink-0 h-5 w-5 rounded-full border ${
              todo.status === 'completed' 
                ? 'bg-green-500 border-green-500 text-white' 
                : 'border-gray-300'
            }`}
            onClick={() => onStatusChange(todo.id, 'completed')}
          >
            {todo.status === 'completed' && <Check size={16} className="h-4 w-4 m-auto" />}
          </button>
          
          <div>
            <h3 className={`font-medium ${todo.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
              {todo.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{todo.description}</p>
            
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`px-2 py-1 rounded-full text-xs ${priorityColorMap[todo.priority]}`}>
                {todo.priority}
              </span>
              
              <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 flex items-center">
                <Calendar size={12} className="mr-1" /> {todo.dueDate}
              </span>
              
              <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 flex items-center">
                <CircleUser size={12} className="mr-1" /> {todo.assignee.name}
              </span>
            </div>
          </div>
        </div>
        
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onStatusChange(todo.id, 'todo')}>
                Set as Todo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(todo.id, 'in-progress')}>
                Set as In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(todo.id, 'completed')}>
                Set as Completed
              </DropdownMenuItem>
              <DropdownMenuItem>Edit Task</DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-500"
                onClick={() => onDeleteTodo(todo.id)}
              >
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
