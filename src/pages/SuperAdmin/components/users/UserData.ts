
import { User } from './types';

export const mockUsers: User[] = [
  {
    id: '001',
    name: 'Emma Johnson',
    email: 'emma.johnson@example.com',
    role: 'user',
    status: 'active',
    location: 'New York, USA',
    joinDate: '2023-01-15',
    lastActive: '2023-05-18 09:32',
    photoCount: 12,
    messageCount: 68
  },
  {
    id: '002',
    name: 'James Smith',
    email: 'james.smith@example.com',
    role: 'premium',
    status: 'active',
    location: 'London, UK',
    joinDate: '2022-11-23',
    lastActive: '2023-05-17 15:47',
    photoCount: 24,
    messageCount: 129
  },
  {
    id: '003',
    name: 'Sophia Martinez',
    email: 'sophia.martinez@example.com',
    role: 'moderator',
    status: 'active',
    location: 'Barcelona, Spain',
    joinDate: '2022-08-05',
    lastActive: '2023-05-18 11:20',
    photoCount: 8,
    messageCount: 215
  },
  {
    id: '004',
    name: 'Robert Wilson',
    email: 'robert.wilson@example.com',
    role: 'user',
    status: 'inactive',
    location: 'Sydney, Australia',
    joinDate: '2023-02-28',
    lastActive: '2023-04-30 16:05',
    photoCount: 5,
    messageCount: 27
  },
  {
    id: '005',
    name: 'Olivia Brown',
    email: 'olivia.brown@example.com',
    role: 'premium',
    status: 'suspended',
    location: 'Toronto, Canada',
    joinDate: '2022-07-14',
    lastActive: '2023-05-10 08:15',
    photoCount: 18,
    messageCount: 93
  },
  {
    id: '006',
    name: 'Daniel Lee',
    email: 'daniel.lee@example.com',
    role: 'admin',
    status: 'active',
    location: 'Seoul, South Korea',
    joinDate: '2022-05-30',
    lastActive: '2023-05-18 10:45',
    photoCount: 15,
    messageCount: 187
  },
  {
    id: '007',
    name: 'Charlotte Garcia',
    email: 'charlotte.garcia@example.com',
    role: 'user',
    status: 'active',
    location: 'Paris, France',
    joinDate: '2023-03-12',
    lastActive: '2023-05-17 22:30',
    photoCount: 7,
    messageCount: 45
  }
];
