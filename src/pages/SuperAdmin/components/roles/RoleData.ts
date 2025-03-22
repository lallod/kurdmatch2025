
import { Role } from './types';

export const mockRoles: Role[] = [
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
