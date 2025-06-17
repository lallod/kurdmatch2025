
export interface UserAccountAction {
  id: string;
  user_id: string;
  action_type: 'deactivation' | 'deletion_request' | 'archive';
  requested_at: string;
  scheduled_at?: string;
  completed_at?: string;
  status: 'pending' | 'completed' | 'cancelled';
  reason?: string;
}

export interface ConnectedSocialAccount {
  id: string;
  user_id: string;
  platform: 'instagram' | 'snapchat';
  platform_user_id: string;
  username: string;
  connected_at: string;
  is_active: boolean;
}

export interface UserDataExport {
  profile: any;
  photos: any[];
  messages: any[];
  matches: any[];
  likes: any[];
  social_accounts: ConnectedSocialAccount[];
  export_date: string;
}

export type AccountStatus = 'active' | 'deactivated' | 'deletion_requested' | 'archived';

export interface AccountDeletionRequest {
  user_id: string;
  deletion_type: 'deactivate' | 'delete';
  requested_at: string;
  scheduled_deletion_at?: string;
  reason?: string;
  can_cancel: boolean;
}
