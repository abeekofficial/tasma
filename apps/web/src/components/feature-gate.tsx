"use client";

import React from "react";
import { isFeatureEnabled, FeatureKey } from "@/lib/feature-flags";

interface FeatureGateProps {
  /** The feature key to check. */
  feature: FeatureKey;
  /** Content rendered when the feature is enabled. */
  children: React.ReactNode;
  /** Optional fallback rendered when the feature is disabled. */
  fallback?: React.ReactNode;
}

/**
 * Conditionally renders children based on feature flag state.
 * 
 * Usage:
 * ```tsx
 * <FeatureGate feature="advancedTimeline">
 *   <AdvancedTimelinePanel />
 * </FeatureGate>
 * 
 * <FeatureGate feature="billing" fallback={<UpgradePrompt />}>
 *   <BillingDashboard />
 * </FeatureGate>
 * ```
 */
export function FeatureGate({ feature, children, fallback = null }: FeatureGateProps) {
  if (!isFeatureEnabled(feature)) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
}
