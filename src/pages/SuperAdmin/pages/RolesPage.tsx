
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  ShieldX, 
  User, 
  Users, 
  Lock, 
  Key, 
  Eye, 
  Brain 
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const RolesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [newRoleOpen, setNewRoleOpen] = useState(false);
  const [editPermissions, setEditPermissions] = useState(false);

  // Mock data for roles
  const roles = [
    {
      id: 'role-1',
      name: 'Super Admin',
      description: 'Full access to all system features and settings',
      userCount: 3,
      isSystem: true,
      permissions: {
        users: {
          view: true,
          create: true,
          edit: true,
          delete: true
        },
        content: {
          view: true,
          create: true,
          edit: true,
          delete: true
        },
        settings: {
          view: true,
          edit: true
        },
        roles: {
          view: true,
          create: true,
          edit: true,
          delete: true
        },
        reports: {
          view: true,
          create: true,
          export: true
        },
        billing: {
          view: true,
          manage: true
        }
      }
    },
    {
      id: 'role-2',
      name: 'Admin',
      description: 'Access to most system features with some restrictions',
      userCount: 8,
      isSystem: true,
      permissions: {
        users: {
          view: true,
          create: true,
          edit: true,
          delete: false
        },
        content: {
          view: true,
          create: true,
          edit: true,
          delete: true
        },
        settings: {
          view: true,
          edit: false
        },
        roles: {
          view: true,
          create: false,
          edit: false,
          delete: false
        },
        reports: {
          view: true,
          create: true,
          export: true
        },
        billing: {
          view: true,
          manage: false
        }
      }
    },
    {
      id: 'role-3',
      name: 'Moderator',
      description: 'Access to content moderation features',
      userCount: 15,
      isSystem: true,
      permissions: {
        users: {
          view: true,
          create: false,
          edit: true,
          delete: false
        },
        content: {
          view: true,
          create: false,
          edit: true,
          delete: true
        },
        settings: {
          view: false,
          edit: false
        },
        roles: {
          view: false,
          create: false,
          edit: false,
          delete: false
        },
        reports: {
          view: true,
          create: true,
          export: false
        },
        billing: {
          view: false,
          manage: false
        }
      }
    },
    {
      id: 'role-4',
      name: 'Support Agent',
      description: 'Access to user support features',
      userCount: 22,
      isSystem: true,
      permissions: {
        users: {
          view: true,
          create: false,
          edit: true,
          delete: false
        },
        content: {
          view: true,
          create: false,
          edit: false,
          delete: false
        },
        settings: {
          view: false,
          edit: false
        },
        roles: {
          view: false,
          create: false,
          edit: false,
          delete: false
        },
        reports: {
          view: true,
          create: false,
          export: false
        },
        billing: {
          view: true,
          manage: false
        }
      }
    },
    {
      id: 'role-5',
      name: 'Marketing',
      description: 'Access to marketing and campaign features',
      userCount: 6,
      isSystem: false,
      permissions: {
        users: {
          view: true,
          create: false,
          edit: false,
          delete: false
        },
        content: {
          view: true,
          create: true,
          edit: true,
          delete: false
        },
        settings: {
          view: false,
          edit: false
        },
        roles: {
          view: false,
          create: false,
          edit: false,
          delete: false
        },
        reports: {
          view: true,
          create: true,
          export: true
        },
        billing: {
          view: false,
          manage: false
        }
      }
    }
  ];

  // Filter roles based on search term
  const filteredRoles = roles.filter(role => {
    return role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           role.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Role icon component
  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case 'Super Admin':
        return <ShieldAlert size={20} className="text-purple-600" />;
      case 'Admin':
        return <ShieldCheck size={20} className="text-blue-600" />;
      case 'Moderator':
        return <Shield size={20} className="text-green-600" />;
      case 'Support Agent':
        return <User size={20} className="text-amber-600" />;
      default:
        return <Users size={20} className="text-gray-600" />;
    }
  };

  // Mock functions
  const handleViewRole = (role: any) => {
    setSelectedRole(role);
    setEditPermissions(false);
  };

  const handleDeleteRole = (roleId: string) => {
    console.log(`Deleting role ${roleId}`);
    // In a real app, this would call an API to delete the role
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
        <Button onClick={() => setNewRoleOpen(true)} className="gap-2">
          <Plus size={16} />
          New Role
        </Button>
      </div>

      {/* AI banner */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 border border-tinder-rose/10 flex items-center">
        <Brain size={24} className="text-tinder-rose mr-3" />
        <div>
          <h3 className="font-semibold text-gray-800">AI-Enhanced Role Recommendations</h3>
          <p className="text-sm text-gray-600">Our AI system analyzes user activity patterns to suggest optimal role configurations and permission sets</p>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Roles</TabsTrigger>
          <TabsTrigger value="system">System Roles</TabsTrigger>
          <TabsTrigger value="custom">Custom Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search roles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoles.length > 0 ? (
                      filteredRoles.map((role) => (
                        <TableRow key={role.id}>
                          <TableCell>
                            <div className="flex items-center">
                              {getRoleIcon(role.name)}
                              <span className="ml-2 font-medium">{role.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{role.description}</TableCell>
                          <TableCell>{role.userCount}</TableCell>
                          <TableCell>
                            <Badge variant={role.isSystem ? "outline" : "default"}>
                              {role.isSystem ? 'System' : 'Custom'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="gap-2"
                                onClick={() => handleViewRole(role)}
                              >
                                <Eye size={16} />
                                View
                              </Button>
                              {!role.isSystem && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                                  onClick={() => handleDeleteRole(role.id)}
                                >
                                  <Trash size={16} />
                                  Delete
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6">
                          No roles found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Role Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>AI Role Recommendations</CardTitle>
              <CardDescription>Suggested role configurations based on usage patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-blue-50">
                  <h4 className="font-semibold text-blue-800 mb-2">Moderator Role Optimization</h4>
                  <p className="text-blue-700">
                    Moderators are rarely using the report creation functionality but frequently need 
                    to export content for review. Consider adjusting permissions to remove report 
                    creation and add export capabilities.
                  </p>
                  <div className="mt-3 flex justify-end">
                    <Button variant="outline" size="sm">Apply Recommendation</Button>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg bg-green-50">
                  <h4 className="font-semibold text-green-800 mb-2">New Role Suggestion: Content Creator</h4>
                  <p className="text-green-700">
                    We've noticed a pattern where Marketing users need more granular content management 
                    permissions without user management access. A new "Content Creator" role could 
                    improve workflow efficiency.
                  </p>
                  <div className="mt-3 flex justify-end">
                    <Button variant="outline" size="sm">Create Suggested Role</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Roles</CardTitle>
              <CardDescription>Built-in roles with predefined permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <p>System roles content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>Custom Roles</CardTitle>
              <CardDescription>User-defined roles with custom permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Custom roles content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Role Details Dialog */}
      {selectedRole && (
        <Dialog open={!!selectedRole} onOpenChange={() => setSelectedRole(null)}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                {getRoleIcon(selectedRole.name)}
                <span className="ml-2">{selectedRole.name}</span>
              </DialogTitle>
              <DialogDescription>
                {selectedRole.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Badge variant={selectedRole.isSystem ? "outline" : "default"} className="mr-2">
                    {selectedRole.isSystem ? 'System Role' : 'Custom Role'}
                  </Badge>
                  <span className="text-sm text-gray-500">{selectedRole.userCount} users assigned</span>
                </div>
                
                {!editPermissions ? (
                  <Button 
                    variant="outline" 
                    onClick={() => setEditPermissions(true)} 
                    disabled={selectedRole.isSystem && selectedRole.name === 'Super Admin'}
                  >
                    <Edit size={16} className="mr-2" />
                    Edit Permissions
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setEditPermissions(false)}>
                      Cancel
                    </Button>
                    <Button>
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Permission Settings</h3>
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Module</TableHead>
                          <TableHead>View</TableHead>
                          <TableHead>Create</TableHead>
                          <TableHead>Edit</TableHead>
                          <TableHead>Delete</TableHead>
                          <TableHead>Special</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Users</TableCell>
                          <TableCell>
                            {editPermissions ? (
                              <Checkbox defaultChecked={selectedRole.permissions.users.view} />
                            ) : (
                              selectedRole.permissions.users.view ? "✓" : "—"
                            )}
                          </TableCell>
                          <TableCell>
                            {editPermissions ? (
                              <Checkbox defaultChecked={selectedRole.permissions.users.create} />
                            ) : (
                              selectedRole.permissions.users.create ? "✓" : "—"
                            )}
                          </TableCell>
                          <TableCell>
                            {editPermissions ? (
                              <Checkbox defaultChecked={selectedRole.permissions.users.edit} />
                            ) : (
                              selectedRole.permissions.users.edit ? "✓" : "—"
                            )}
                          </TableCell>
                          <TableCell>
                            {editPermissions ? (
                              <Checkbox defaultChecked={selectedRole.permissions.users.delete} />
                            ) : (
                              selectedRole.permissions.users.delete ? "✓" : "—"
                            )}
                          </TableCell>
                          <TableCell>—</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Content</TableCell>
                          <TableCell>
                            {editPermissions ? (
                              <Checkbox defaultChecked={selectedRole.permissions.content.view} />
                            ) : (
                              selectedRole.permissions.content.view ? "✓" : "—"
                            )}
                          </TableCell>
                          <TableCell>
                            {editPermissions ? (
                              <Checkbox defaultChecked={selectedRole.permissions.content.create} />
                            ) : (
                              selectedRole.permissions.content.create ? "✓" : "—"
                            )}
                          </TableCell>
                          <TableCell>
                            {editPermissions ? (
                              <Checkbox defaultChecked={selectedRole.permissions.content.edit} />
                            ) : (
                              selectedRole.permissions.content.edit ? "✓" : "—"
                            )}
                          </TableCell>
                          <TableCell>
                            {editPermissions ? (
                              <Checkbox defaultChecked={selectedRole.permissions.content.delete} />
                            ) : (
                              selectedRole.permissions.content.delete ? "✓" : "—"
                            )}
                          </TableCell>
                          <TableCell>—</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Settings</TableCell>
                          <TableCell>
                            {editPermissions ? (
                              <Checkbox defaultChecked={selectedRole.permissions.settings.view} />
                            ) : (
                              selectedRole.permissions.settings.view ? "✓" : "—"
                            )}
                          </TableCell>
                          <TableCell>—</TableCell>
                          <TableCell>
                            {editPermissions ? (
                              <Checkbox defaultChecked={selectedRole.permissions.settings.edit} />
                            ) : (
                              selectedRole.permissions.settings.edit ? "✓" : "—"
                            )}
                          </TableCell>
                          <TableCell>—</TableCell>
                          <TableCell>—</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Roles</TableCell>
                          <TableCell>
                            {editPermissions ? (
                              <Checkbox defaultChecked={selectedRole.permissions.roles.view} />
                            ) : (
                              selectedRole.permissions.roles.view ? "✓" : "—"
                            )}
                          </TableCell>
                          <TableCell>
                            {editPermissions ? (
                              <Checkbox defaultChecked={selectedRole.permissions.roles.create} />
                            ) : (
                              selectedRole.permissions.roles.create ? "✓" : "—"
                            )}
                          </TableCell>
                          <TableCell>
                            {editPermissions ? (
                              <Checkbox defaultChecked={selectedRole.permissions.roles.edit} />
                            ) : (
                              selectedRole.permissions.roles.edit ? "✓" : "—"
                            )}
                          </TableCell>
                          <TableCell>
                            {editPermissions ? (
                              <Checkbox defaultChecked={selectedRole.permissions.roles.delete} />
                            ) : (
                              selectedRole.permissions.roles.delete ? "✓" : "—"
                            )}
                          </TableCell>
                          <TableCell>—</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Reports</TableCell>
                          <TableCell>
                            {editPermissions ? (
                              <Checkbox defaultChecked={selectedRole.permissions.reports.view} />
                            ) : (
                              selectedRole.permissions.reports.view ? "✓" : "—"
                            )}
                          </TableCell>
                          <TableCell>
                            {editPermissions ? (
                              <Checkbox defaultChecked={selectedRole.permissions.reports.create} />
                            ) : (
                              selectedRole.permissions.reports.create ? "✓" : "—"
                            )}
                          </TableCell>
                          <TableCell>—</TableCell>
                          <TableCell>—</TableCell>
                          <TableCell>
                            {editPermissions ? (
                              <div className="flex items-center">
                                <span className="mr-2 text-xs">Export:</span>
                                <Checkbox defaultChecked={selectedRole.permissions.reports.export} />
                              </div>
                            ) : (
                              selectedRole.permissions.reports.export ? "Export: ✓" : "Export: —"
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Billing</TableCell>
                          <TableCell>
                            {editPermissions ? (
                              <Checkbox defaultChecked={selectedRole.permissions.billing.view} />
                            ) : (
                              selectedRole.permissions.billing.view ? "✓" : "—"
                            )}
                          </TableCell>
                          <TableCell>—</TableCell>
                          <TableCell>—</TableCell>
                          <TableCell>—</TableCell>
                          <TableCell>
                            {editPermissions ? (
                              <div className="flex items-center">
                                <span className="mr-2 text-xs">Manage:</span>
                                <Checkbox defaultChecked={selectedRole.permissions.billing.manage} />
                              </div>
                            ) : (
                              selectedRole.permissions.billing.manage ? "Manage: ✓" : "Manage: —"
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedRole(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* New Role Dialog */}
      <Dialog open={newRoleOpen} onOpenChange={setNewRoleOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Define a new role with custom permissions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="role-name" className="text-sm font-medium">Role Name</label>
              <Input id="role-name" placeholder="e.g., Content Manager" />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="role-description" className="text-sm font-medium">Description</label>
              <Input id="role-description" placeholder="Describe the purpose of this role" />
            </div>
            
            <div className="grid gap-2">
              <h3 className="text-sm font-medium mb-2">Base Permissions On</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center p-3 border rounded-md">
                  <input type="radio" id="start-fresh" name="permission-base" className="mr-2" />
                  <label htmlFor="start-fresh">Start from scratch</label>
                </div>
                <div className="flex items-center p-3 border rounded-md">
                  <input type="radio" id="clone-existing" name="permission-base" className="mr-2" checked />
                  <label htmlFor="clone-existing">Clone existing role</label>
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Select Role to Clone</label>
              <select className="w-full border rounded-md p-2">
                <option>Moderator</option>
                <option>Support Agent</option>
                <option>Marketing</option>
              </select>
            </div>
            
            <div className="grid gap-2">
              <h3 className="text-sm font-medium mb-2">Permission Sets</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-500 mr-2" />
                    <span>User Management</span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-500 mr-2" />
                    <span>Content Management</span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-gray-500 mr-2" />
                    <span>Role Management</span>
                  </div>
                  <Switch />
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <Button variant="outline" size="sm">Configure Detailed Permissions</Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewRoleOpen(false)}>Cancel</Button>
            <Button>Create Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RolesPage;
