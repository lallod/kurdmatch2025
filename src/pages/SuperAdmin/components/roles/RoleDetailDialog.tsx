
import React, { useState } from 'react';
import { Role } from './types';
import { getRoleIcon } from './RoleUtils';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit } from 'lucide-react';

interface RoleDetailDialogProps {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RoleDetailDialog: React.FC<RoleDetailDialogProps> = ({ role, open, onOpenChange }) => {
  const [editPermissions, setEditPermissions] = useState(false);
  
  if (!role) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {getRoleIcon(role.name)}
            <span className="ml-2">{role.name}</span>
          </DialogTitle>
          <DialogDescription>
            {role.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Badge variant={role.isSystem ? "outline" : "default"} className="mr-2">
                {role.isSystem ? 'System Role' : 'Custom Role'}
              </Badge>
              <span className="text-sm text-gray-500">{role.userCount} users assigned</span>
            </div>
            
            {!editPermissions ? (
              <Button 
                variant="outline" 
                onClick={() => setEditPermissions(true)} 
                disabled={role.isSystem && role.name === 'Super Admin'}
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
                          <Checkbox defaultChecked={role.permissions.users.view} />
                        ) : (
                          role.permissions.users.view ? "✓" : "—"
                        )}
                      </TableCell>
                      <TableCell>
                        {editPermissions ? (
                          <Checkbox defaultChecked={role.permissions.users.create} />
                        ) : (
                          role.permissions.users.create ? "✓" : "—"
                        )}
                      </TableCell>
                      <TableCell>
                        {editPermissions ? (
                          <Checkbox defaultChecked={role.permissions.users.edit} />
                        ) : (
                          role.permissions.users.edit ? "✓" : "—"
                        )}
                      </TableCell>
                      <TableCell>
                        {editPermissions ? (
                          <Checkbox defaultChecked={role.permissions.users.delete} />
                        ) : (
                          role.permissions.users.delete ? "✓" : "—"
                        )}
                      </TableCell>
                      <TableCell>—</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Content</TableCell>
                      <TableCell>
                        {editPermissions ? (
                          <Checkbox defaultChecked={role.permissions.content.view} />
                        ) : (
                          role.permissions.content.view ? "✓" : "—"
                        )}
                      </TableCell>
                      <TableCell>
                        {editPermissions ? (
                          <Checkbox defaultChecked={role.permissions.content.create} />
                        ) : (
                          role.permissions.content.create ? "✓" : "—"
                        )}
                      </TableCell>
                      <TableCell>
                        {editPermissions ? (
                          <Checkbox defaultChecked={role.permissions.content.edit} />
                        ) : (
                          role.permissions.content.edit ? "✓" : "—"
                        )}
                      </TableCell>
                      <TableCell>
                        {editPermissions ? (
                          <Checkbox defaultChecked={role.permissions.content.delete} />
                        ) : (
                          role.permissions.content.delete ? "✓" : "—"
                        )}
                      </TableCell>
                      <TableCell>—</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Settings</TableCell>
                      <TableCell>
                        {editPermissions ? (
                          <Checkbox defaultChecked={role.permissions.settings.view} />
                        ) : (
                          role.permissions.settings.view ? "✓" : "—"
                        )}
                      </TableCell>
                      <TableCell>—</TableCell>
                      <TableCell>
                        {editPermissions ? (
                          <Checkbox defaultChecked={role.permissions.settings.edit} />
                        ) : (
                          role.permissions.settings.edit ? "✓" : "—"
                        )}
                      </TableCell>
                      <TableCell>—</TableCell>
                      <TableCell>—</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Roles</TableCell>
                      <TableCell>
                        {editPermissions ? (
                          <Checkbox defaultChecked={role.permissions.roles.view} />
                        ) : (
                          role.permissions.roles.view ? "✓" : "—"
                        )}
                      </TableCell>
                      <TableCell>
                        {editPermissions ? (
                          <Checkbox defaultChecked={role.permissions.roles.create} />
                        ) : (
                          role.permissions.roles.create ? "✓" : "—"
                        )}
                      </TableCell>
                      <TableCell>
                        {editPermissions ? (
                          <Checkbox defaultChecked={role.permissions.roles.edit} />
                        ) : (
                          role.permissions.roles.edit ? "✓" : "—"
                        )}
                      </TableCell>
                      <TableCell>
                        {editPermissions ? (
                          <Checkbox defaultChecked={role.permissions.roles.delete} />
                        ) : (
                          role.permissions.roles.delete ? "✓" : "—"
                        )}
                      </TableCell>
                      <TableCell>—</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Reports</TableCell>
                      <TableCell>
                        {editPermissions ? (
                          <Checkbox defaultChecked={role.permissions.reports.view} />
                        ) : (
                          role.permissions.reports.view ? "✓" : "—"
                        )}
                      </TableCell>
                      <TableCell>
                        {editPermissions ? (
                          <Checkbox defaultChecked={role.permissions.reports.create} />
                        ) : (
                          role.permissions.reports.create ? "✓" : "—"
                        )}
                      </TableCell>
                      <TableCell>—</TableCell>
                      <TableCell>—</TableCell>
                      <TableCell>
                        {editPermissions ? (
                          <div className="flex items-center">
                            <span className="mr-2 text-xs">Export:</span>
                            <Checkbox defaultChecked={role.permissions.reports.export} />
                          </div>
                        ) : (
                          role.permissions.reports.export ? "Export: ✓" : "Export: —"
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Billing</TableCell>
                      <TableCell>
                        {editPermissions ? (
                          <Checkbox defaultChecked={role.permissions.billing.view} />
                        ) : (
                          role.permissions.billing.view ? "✓" : "—"
                        )}
                      </TableCell>
                      <TableCell>—</TableCell>
                      <TableCell>—</TableCell>
                      <TableCell>—</TableCell>
                      <TableCell>
                        {editPermissions ? (
                          <div className="flex items-center">
                            <span className="mr-2 text-xs">Manage:</span>
                            <Checkbox defaultChecked={role.permissions.billing.manage} />
                          </div>
                        ) : (
                          role.permissions.billing.manage ? "Manage: ✓" : "Manage: —"
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoleDetailDialog;
