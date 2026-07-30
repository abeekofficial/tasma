export interface AccountSettings {
  name: string | null;
  username: string | null;
  email: string | null;
  avatarUrl: string | null;
  coverImageUrl: string | null;
  bio: string | null;
  country: string | null;
  language: string | null;
  timezone: string | null;
  theme: string | null;
}

export interface NotificationSettings {
  emailEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  digestFrequency: string;
  mutedTypes: string[];
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  activeSessions: number;
  lastPasswordChange: Date | null;
}

export interface ConnectedAccount {
  provider: string;
  email: string | null;
  connectedAt: Date;
}

export type SettingsResponse = {
  account: AccountSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
  connectedAccounts: ConnectedAccount[];
};
