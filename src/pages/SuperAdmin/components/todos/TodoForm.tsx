
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TodoFormProps } from './types';

const TodoForm: React.FC<TodoFormProps> = ({ onAddTodo }) => {
  const { toast } = useToast();
  const [newTodo, setNewTodo] = useState<{
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
    assignee: {
      name: string;
      avatar: string;
    }
  }>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    assignee: {
      name: 'Mohammad Reza',
      avatar: 'https://github.com/shadcn.png',
    }
  });

  const handleAddTodo = () => {
    if (!newTodo.title) {
      toast({
        title: "Error",
        description: "Task title is required.",
        variant: "destructive",
      });
      return;
    }
    
    onAddTodo(newTodo);
    
    // Reset form
    setNewTodo({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: '',
      assignee: {
        name: 'Mohammad Reza',
        avatar: 'https://github.com/shadcn.png',
      }
    });
    
    toast({
      title: "Task Added",
      description: "New task has been added successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md font-medium flex items-center">
          <Plus size={18} className="mr-2" /> Add New Task
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="task-title">Task Title</Label>
            <Input 
              id="task-title" 
              placeholder="Enter task title" 
              value={newTodo.title}
              onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
            />
          </div>
          
          <div>
            <Label htmlFor="task-description">Description</Label>
            <Textarea 
              id="task-description" 
              placeholder="Enter task description" 
              rows={3}
              value={newTodo.description}
              onChange={(e) => setNewTodo({...newTodo, description: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="task-priority">Priority</Label>
              <Select 
                defaultValue={newTodo.priority}
                onValueChange={(value: 'low' | 'medium' | 'high') => 
                  setNewTodo({...newTodo, priority: value})
                }
              >
                <SelectTrigger id="task-priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="task-status">Status</Label>
              <Select 
                defaultValue={newTodo.status}
                onValueChange={(value: 'todo' | 'in-progress' | 'completed') => 
                  setNewTodo({...newTodo, status: value})
                }
              >
                <SelectTrigger id="task-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="task-due-date">Due Date</Label>
            <Input 
              id="task-due-date" 
              type="date" 
              value={newTodo.dueDate}
              onChange={(e) => setNewTodo({...newTodo, dueDate: e.target.value})}
            />
          </div>
          
          <Button 
            className="w-full bg-tinder-rose hover:bg-tinder-rose/90"
            onClick={handleAddTodo}
          >
            <Plus size={16} className="mr-2" /> Add Task
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoForm;
