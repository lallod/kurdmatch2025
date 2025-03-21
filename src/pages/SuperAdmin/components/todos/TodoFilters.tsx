
import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TodoFiltersProps } from './types';

const TodoFilters: React.FC<TodoFiltersProps> = ({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  priorityFilter,
  setPriorityFilter,
  clearFilters
}) => {
  return (
    <>
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
      
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search tasks..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        <div className="w-full sm:w-auto min-w-[150px]">
          <Select 
            value={priorityFilter} 
            onValueChange={(v) => setPriorityFilter(v as 'all' | 'low' | 'medium' | 'high')}
          >
            <SelectTrigger>
              <div className="flex items-center">
                <Filter size={14} className="mr-2" />
                <span>Priority</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {(searchTerm || priorityFilter !== 'all') && (
          <Button 
            variant="outline" 
            size="icon"
            onClick={clearFilters}
            className="flex-shrink-0"
          >
            <X size={18} />
          </Button>
        )}
      </div>
    </>
  );
};

export default TodoFilters;
