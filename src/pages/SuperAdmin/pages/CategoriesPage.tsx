
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, PlusCircle, Edit, Trash2, Tag } from 'lucide-react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious
} from '@/components/ui/pagination';

interface Category {
  id: string;
  name: string;
  description: string;
  type: 'interest' | 'religion' | 'political' | 'ethnicity' | 'language';
  itemCount: number;
  createdDate: string;
}

const CategoriesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock category data - in a real app, this would come from an API
  const mockCategories: Category[] = [
    {
      id: '1',
      name: 'Photography',
      description: 'Users interested in photography as a hobby or profession',
      type: 'interest',
      itemCount: 1245,
      createdDate: '2023-01-15'
    },
    {
      id: '2',
      name: 'Hiking',
      description: 'Users who enjoy hiking and outdoor activities',
      type: 'interest',
      itemCount: 3478,
      createdDate: '2023-02-21'
    },
    {
      id: '3',
      name: 'Islamic',
      description: 'Users who identify as Muslims',
      type: 'religion',
      itemCount: 5692,
      createdDate: '2023-03-18'
    },
    {
      id: '4',
      name: 'Liberal',
      description: 'Users with liberal political views',
      type: 'political',
      itemCount: 2314,
      createdDate: '2023-01-09'
    },
    {
      id: '5',
      name: 'Kurdish',
      description: 'Users who identify as Kurdish',
      type: 'ethnicity',
      itemCount: 4567,
      createdDate: '2023-04-12'
    },
    {
      id: '6',
      name: 'Kurdish',
      description: 'Users who speak Kurdish',
      type: 'language',
      itemCount: 3985,
      createdDate: '2023-04-15'
    },
    {
      id: '7',
      name: 'Cooking',
      description: 'Users interested in cooking and culinary arts',
      type: 'interest',
      itemCount: 2876,
      createdDate: '2023-04-25'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'interest':
        return 'bg-blue-100 text-blue-800';
      case 'religion':
        return 'bg-purple-100 text-purple-800';
      case 'political':
        return 'bg-orange-100 text-orange-800';
      case 'ethnicity':
        return 'bg-green-100 text-green-800';
      case 'language':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCategories = mockCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
        <Button className="gap-2">
          <PlusCircle size={16} />
          Add New Category
        </Button>
      </div>

      <Card className="p-4">
        <div className="relative flex-1 mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search categories by name, description, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Item Count</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-gray-500" />
                      {category.name}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{category.description}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(category.type)}`}>
                      {category.type.charAt(0).toUpperCase() + category.type.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>{category.itemCount.toLocaleString()}</TableCell>
                  <TableCell>{category.createdDate}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon">
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>
    </div>
  );
};

export default CategoriesPage;
