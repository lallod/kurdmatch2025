
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { AIBanner } from '../components/payments/AIBanner';
import PageHeader from '../components/roles/PageHeader';
import RolesTable from '../components/roles/RolesTable';
import AIRecommendations from '../components/roles/AIRecommendations';
import RoleDetailDialog from '../components/roles/RoleDetailDialog';
import NewRoleDialog from '../components/roles/NewRoleDialog';
import RoleSearch from '../components/roles/RoleSearch';
import { mockRoles } from '../components/roles/RoleData';
import { filterRoles } from '../components/roles/RoleUtils';
import { Role } from '../components/roles/types';

const RolesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [newRoleOpen, setNewRoleOpen] = useState(false);
  
  const filteredRoles = filterRoles(mockRoles, searchTerm);

  const handleViewRole = (role: Role) => {
    setSelectedRole(role);
  };

  const handleDeleteRole = (roleId: string) => {
    console.log(`Deleting role ${roleId}`);
    // In a real app, this would call an API to delete the role
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
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <RoleSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
              </div>

              <RolesTable 
                roles={filteredRoles}
                onViewRole={handleViewRole}
                onDeleteRole={handleDeleteRole}
              />
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
              <p className="text-white/60">System roles content will appear here.</p>
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
              <p className="text-white/60">Custom roles content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <RoleDetailDialog 
        role={selectedRole}
        open={!!selectedRole}
        onOpenChange={(open) => !open && setSelectedRole(null)}
      />

      <NewRoleDialog
        open={newRoleOpen}
        onOpenChange={setNewRoleOpen}
      />
    </div>
  );
};

export default RolesPage;
