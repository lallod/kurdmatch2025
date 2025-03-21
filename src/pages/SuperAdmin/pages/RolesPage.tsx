
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { UserCog, Plus, Edit, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RolesPage = () => {
  const { toast } = useToast();
  const [roles, setRoles] = useState([
    { id: 1, name: 'Super Admin', users: 2, permissions: ['all'], createdAt: '2023-01-15' },
    { id: 2, name: 'Admin', users: 5, permissions: ['users.view', 'users.edit', 'content.view', 'content.edit'], createdAt: '2023-01-20' },
    { id: 3, name: 'Moderator', users: 8, permissions: ['content.view', 'content.edit'], createdAt: '2023-02-10' },
    { id: 4, name: 'Content Manager', users: 12, permissions: ['content.view', 'content.edit', 'content.create'], createdAt: '2023-03-05' },
    { id: 5, name: 'User Support', users: 6, permissions: ['users.view', 'messages.view', 'messages.send'], createdAt: '2023-04-12' },
  ]);
  
  const [newRoleName, setNewRoleName] = useState('');
  const [editingRole, setEditingRole] = useState<any>(null);
  const [permissionGroups, setPermissionGroups] = useState({
    users: { view: false, edit: false, delete: false },
    content: { view: false, edit: false, create: false },
    messages: { view: false, send: false },
    subscriptions: { view: false, edit: false },
    reports: { view: false, generate: false }
  });

  const handleAddRole = () => {
    if (!newRoleName) return;
    
    // Convert permission groups to array format
    const permissionsArray = [];
    for (const [group, actions] of Object.entries(permissionGroups)) {
      for (const [action, enabled] of Object.entries(actions as Record<string, boolean>)) {
        if (enabled) {
          permissionsArray.push(`${group}.${action}`);
        }
      }
    }
    
    const newRole = {
      id: roles.length + 1,
      name: newRoleName,
      users: 0,
      permissions: permissionsArray,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setRoles([...roles, newRole]);
    setNewRoleName('');
    resetPermissionGroups();
    
    toast({
      title: "Role Added",
      description: `${newRoleName} role has been created successfully.`,
    });
  };
  
  const handleDeleteRole = (id: number) => {
    setRoles(roles.filter(role => role.id !== id));
    toast({
      title: "Role Deleted",
      description: `Role has been deleted successfully.`,
    });
  };
  
  const resetPermissionGroups = () => {
    setPermissionGroups({
      users: { view: false, edit: false, delete: false },
      content: { view: false, edit: false, create: false },
      messages: { view: false, send: false },
      subscriptions: { view: false, edit: false },
      reports: { view: false, generate: false }
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Role Management</h1>
          <p className="text-gray-500">Manage user roles and permissions in the system</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-tinder-rose hover:bg-tinder-rose/90">
              <Plus size={16} className="mr-2" /> Add New Role
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Add a new role with specific permissions
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="mb-4">
                <Label htmlFor="role-name">Role Name</Label>
                <Input 
                  id="role-name" 
                  value={newRoleName} 
                  onChange={(e) => setNewRoleName(e.target.value)} 
                  placeholder="Enter role name" 
                  className="mt-1"
                />
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Permissions</h4>
                
                {Object.entries(permissionGroups).map(([group, actions]) => (
                  <div key={group} className="border p-3 rounded-md">
                    <h5 className="font-medium capitalize mb-2">{group}</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(actions).map(([action, enabled]) => (
                        <div key={`${group}.${action}`} className="flex items-center space-x-2">
                          <Switch 
                            id={`${group}.${action}`}
                            checked={enabled}
                            onCheckedChange={(checked) => {
                              setPermissionGroups({
                                ...permissionGroups,
                                [group]: {
                                  ...permissionGroups[group as keyof typeof permissionGroups],
                                  [action]: checked
                                }
                              });
                            }}
                          />
                          <Label htmlFor={`${group}.${action}`} className="capitalize">{action}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={resetPermissionGroups}>Reset</Button>
              <Button onClick={handleAddRole}>Create Role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-medium flex items-center">
            <UserCog size={18} className="mr-2" /> System Roles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>{role.users}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.length > 3 ? (
                        <>
                          {role.permissions.slice(0, 2).map((perm, i) => (
                            <span key={i} className="inline-block px-2 py-1 text-xs bg-gray-100 rounded">
                              {perm}
                            </span>
                          ))}
                          <span className="inline-block px-2 py-1 text-xs bg-gray-100 rounded">
                            +{role.permissions.length - 2} more
                          </span>
                        </>
                      ) : (
                        role.permissions.map((perm, i) => (
                          <span key={i} className="inline-block px-2 py-1 text-xs bg-gray-100 rounded">
                            {perm}
                          </span>
                        ))
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{role.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500"
                        onClick={() => handleDeleteRole(role.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RolesPage;
