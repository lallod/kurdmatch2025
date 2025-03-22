
export interface Permission {
  view: boolean;
  create?: boolean;
  edit?: boolean;
  delete?: boolean;
  export?: boolean;
  manage?: boolean;
}

export interface RolePermissions {
  users: Permission;
  content: Permission;
  settings: Permission;
  roles: Permission;
  reports: Permission;
  billing: Permission;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  isSystem: boolean;
  permissions: RolePermissions;
}
