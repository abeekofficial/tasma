export interface PlanFeatures {
  maxProjects: number;
  maxStorage: string; // BigInt compat
  maxRenders: number;
  maxAiCredits: number;
  maxTeamMembers: number;
  maxWorkspaces: number;
  maxUploadSize: string; // bytes
  watermark: boolean;
  customBranding: boolean;
  prioritySupport: boolean;
  apiAccess: boolean;
  customFonts: boolean;
  socialPublishing: boolean;
  aiVoiceCloning: boolean;
  exportFormats: string[];
  maxExportsPerMonth: number;
  maxAiGenerationsPerMonth: number;
}

export interface PlanLimits extends PlanFeatures {
  quotaResetDay: number; // 1-28
}

export interface SubscriptionInfo {
  plan: any; // plan details
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd: Date | null;
  usage: {
    projects: number;
    storage: string;
    renders: number;
    aiCredits: number;
    exports: number;
  };
}
