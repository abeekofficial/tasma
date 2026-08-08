/**
 * Feature Flags Configuration
 * 
 * Controls visibility of features across the application.
 * MVP features are enabled; enterprise/deferred features are disabled.
 * Future releases simply flip the flag to enable deferred capabilities.
 * 
 * This is intentionally simple — a typed configuration object.
 * No external feature flag service or complex infrastructure needed.
 */

export type FeatureKey =
  // MVP Features
  | 'authentication'
  | 'dashboard'
  | 'templateGallery'
  | 'createProject'
  | 'createShort'
  | 'projectManagement'
  | 'mediaUpload'
  | 'scriptInput'
  | 'voiceGeneration'
  | 'subtitleGeneration'
  | 'videoPreview'
  | 'renderVideo'
  | 'renderProgress'
  | 'mp4Export'
  | 'downloadVideo'
  | 'projectHistory'
  // Enterprise Features
  | 'advancedTimeline'
  | 'advancedInspector'
  | 'advancedAssets'
  | 'aiStudio'
  | 'workerManagement'
  | 'monitoring'
  | 'diagnostics'
  | 'admin'
  | 'billing'
  | 'workspaceTeams'
  | 'advancedAnalytics'
  | 'advancedExport'
  | 'enterpriseConfig';

const featureFlags: Record<FeatureKey, boolean> = {
  // ── MVP Features (visible) ────────────────────────
  authentication: true,
  dashboard: true,
  templateGallery: true,
  createProject: true,
  createShort: true,
  projectManagement: true,
  mediaUpload: true,
  scriptInput: true,
  voiceGeneration: true,
  subtitleGeneration: true,
  videoPreview: true,
  renderVideo: true,
  renderProgress: true,
  mp4Export: true,
  downloadVideo: true,
  projectHistory: true,

  // ── Enterprise Features (hidden in MVP) ───────────
  advancedTimeline: false,
  advancedInspector: false,
  advancedAssets: false,
  aiStudio: false,
  workerManagement: false,
  monitoring: false,
  diagnostics: false,
  admin: false,
  billing: false,
  workspaceTeams: false,
  advancedAnalytics: false,
  advancedExport: false,
  enterpriseConfig: false,
};

/**
 * Check if a feature is enabled.
 */
export function isFeatureEnabled(key: FeatureKey): boolean {
  return featureFlags[key] ?? false;
}

/**
 * Get all enabled feature keys.
 */
export function getEnabledFeatures(): FeatureKey[] {
  return (Object.keys(featureFlags) as FeatureKey[]).filter(
    (key) => featureFlags[key]
  );
}

/**
 * Get all disabled feature keys.
 */
export function getDisabledFeatures(): FeatureKey[] {
  return (Object.keys(featureFlags) as FeatureKey[]).filter(
    (key) => !featureFlags[key]
  );
}

export default featureFlags;
