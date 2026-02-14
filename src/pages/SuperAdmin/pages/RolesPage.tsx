import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIBanner } from '../components/payments/AIBanner';
import PageHeader from '../components/roles/PageHeader';
import RolesTable from '../components/roles/RolesTable';
import AIRecommendations from '../components/roles/AIRecommendations';
import RoleDetailDialog from '../components/roles/RoleDetailDialog';
import NewRoleDialog from '../components/roles/NewRoleDialog';
import RoleSearch from '../components/roles/RoleSearch';
import { filterRoles } from '../components/roles/RoleUtils';
import { Role } from '../components/roles/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SYSTEM_ROLES: Record<string, { description: string; permissions: Role['permissions'] }> = {
  super_admin: {
    description: 'Full access to all system features and settings',
    permissions: {
      users: { view: true, create: true, edit: true, delete: true },
      content: { view: true, create: true, edit: true, delete: true },
      settings: { view: true, edit: true },
      roles: { view: true, create: true, edit: true, delete: true },
      reports: { view: true, create: true, export: true },
      billing: { view: true, manage: true },
    },
  },
  admin: {
    description: 'Access to most system features with some restrictions',
    permissions: {
      users: { view: true, create: true, edit: true, delete: false },
      content: { view: true, create: true, edit: true, delete: true },
      settings: { view: true, edit: false },
      roles: { view: true, create: false, edit: false, delete: false },
      reports: { view: true, create: true, export: true },
      billing: { view: true, manage: false },
    },
  },
  moderator: {
    description: 'Access to content moderation features',
    permissions: {
      users: { view: true, create: false, edit: true, delete: false },
      content: { view: true, create: false, edit: true, delete: true },
      settings: { view: false, edit: false },
      roles: { view: false, create: false, edit: false, delete: false },
      reports: { view: true, create: true, export: false },
      billing: { view: false, manage: false },
    },
  },
};

const RolesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [newRoleOpen, setNewRoleOpen] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role');

      if (error) throw error;

      // Count users per role
      const roleCounts: Record<string, number> = {};
      (data || []).forEach(r => {
        roleCounts[r.role] = (roleCounts[r.role] || 0) + 1;
      });

      // Build roles list from actual data + known system roles
      const allRoleNames = new Set([
        ...Object.keys(SYSTEM_ROLES),
        ...Object.keys(roleCounts),
      ]);

      const builtRoles: Role[] = Array.from(allRoleNames).map((roleName, i) => {
        const systemDef = SYSTEM_ROLES[roleName];
        return {
          id: `role-${i}`,
          name: roleName.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          description: systemDef?.description || `Custom role: ${roleName}`,
          userCount: roleCounts[roleName] || 0,
          isSystem: !!systemDef,
          permissions: systemDef?.permissions || {
            users: { view: false }, content: { view: false },
            settings: { view: false }, roles: { view: false },
            reports: { view: false }, billing: { view: false },
          },
        };
      });

      setRoles(builtRoles);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  const filteredRoles = filterRoles(roles, searchTerm);

  const handleViewRole = (role: Role) => setSelectedRole(role);

  const handleDeleteRole = (roleId: string) => {
    console.log(`Deleting role ${roleId}`);
    toast.success('Role deletion not yet implemented');
  };

  return (
    <div className="space-y-6">
      <PageHeader onNewRole={() => setNewRoleOpen(true)} />
      <AIBanner type="all" collapsible={true} />

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Roles</TabsTrigger>
          <TabsTrigger value="system">System Roles</TabsTrigger>
          <TabsTrigger value="custom">Custom Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card className="bg-[#141414] border-white/5">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <RoleSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
              </div>
              {loading ? (
                <p className="text-white/60 text-center py-6">Loading roles...</p>
              ) : (
                <RolesTable
                  roles={filteredRoles}
                  onViewRole={handleViewRole}
                  onDeleteRole={handleDeleteRole}
                />
              )}
            </CardContent>
          </Card>
          <AIRecommendations />
        </TabsContent>

        <TabsContent value="system">
          <Card className="bg-[#141414] border-white/5">
            <CardHeader>
              <CardTitle className="text-white">System Roles</CardTitle>
              <CardDescription className="text-white/60">Built-in roles with predefined permissions</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-white/60">Loading...</p>
              ) : (
                <RolesTable
                  roles={roles.filter(r => r.isSystem)}
                  onViewRole={handleViewRole}
                  onDeleteRole={handleDeleteRole}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom">
          <Card className="bg-[#141414] border-white/5">
            <CardHeader>
              <CardTitle className="text-white">Custom Roles</CardTitle>
              <CardDescription className="text-white/60">User-defined roles with custom permissions</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-white/60">Loading...</p>
              ) : roles.filter(r => !r.isSystem).length > 0 ? (
                <RolesTable
                  roles={roles.filter(r => !r.isSystem)}
                  onViewRole={handleViewRole}
                  onDeleteRole={handleDeleteRole}
                />
              ) : (
                <p className="text-white/60">No custom roles created yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <RoleDetailDialog
        role={selectedRole}
        open={!!selectedRole}
        onOpenChange={(open) => !open && setSelectedRole(null)}
      />
      <NewRoleDialog open={newRoleOpen} onOpenChange={setNewRoleOpen} />
    </div>
  );
};

export default RolesPage;
