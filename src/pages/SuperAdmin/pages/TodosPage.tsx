import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckSquare, 
  Clock, 
  Plus, 
  Calendar, 
  CircleUser, 
  Tag, 
  Check, 
  MoreHorizontal 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface Todo {
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
    
    const todo: Todo = {
      ...newTodo,
      id: todos.length + 1,
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setTodos([...todos, todo]);
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
  
  const filteredTodos = activeTab === 'all' 
    ? todos 
    : todos.filter(todo => todo.status === activeTab);
  
  const priorityColorMap = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
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
        {/* Task Creation Section */}
        <div className="lg:col-span-1">
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
        </div>
        
        {/* Task List Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium flex items-center">
                <CheckSquare size={18} className="mr-2" /> Task List
              </CardTitle>
              <Tabs 
                value={activeTab} 
                onValueChange={(v) => setActiveTab(v as 'all' | 'todo' | 'in-progress' | 'completed')}
                className="w-full"
              >
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="all">All Tasks</TabsTrigger>
                  <TabsTrigger value="todo">To Do</TabsTrigger>
                  <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <TabsContent value={activeTab} className="mt-0">
                <div className="space-y-3">
                  {filteredTodos.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      No tasks found in this category
                    </div>
                  ) : (
                    filteredTodos.map(todo => (
                      <div 
                        key={todo.id} 
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
                              onClick={() => handleStatusChange(todo.id, 'completed')}
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
                                <DropdownMenuItem onClick={() => handleStatusChange(todo.id, 'todo')}>
                                  Set as Todo
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(todo.id, 'in-progress')}>
                                  Set as In Progress
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(todo.id, 'completed')}>
                                  Set as Completed
                                </DropdownMenuItem>
                                <DropdownMenuItem>Edit Task</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-500">Delete Task</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TodosPage;
