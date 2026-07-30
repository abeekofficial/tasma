import {
  PrismaClient,
  Role,
  AiProviderType,
  AiProviderStatus,
  SystemSettingCategory,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  await prisma.$transaction(async (tx) => {
    console.log('Seeding Plans...');
    const plans = [
      {
        slug: 'free',
        tier: 'FREE',
        monthlyPriceInCents: 0,
        yearlyPriceInCents: 0,
        limits: { maxProjects: 3, maxStorage: 1073741824, maxRenders: 5, maxAiCredits: 50, maxTeamMembers: 1, maxWorkspaces: 1, maxUploadSize: 104857600, maxExportsPerMonth: 5, maxAiGenerationsPerMonth: 50 },
        features: { watermark: true, customBranding: false, prioritySupport: false, apiAccess: false, aiVoiceCloning: false, socialPublishing: false, customFonts: false, exportFormats: ['mp4'] }
      },
      {
        slug: 'starter',
        tier: 'STARTER',
        monthlyPriceInCents: 999,
        yearlyPriceInCents: 9588,
        limits: { maxProjects: 10, maxStorage: 10737418240, maxRenders: 30, maxAiCredits: 200, maxTeamMembers: 3, maxWorkspaces: 3, maxUploadSize: 524288000, maxExportsPerMonth: 30, maxAiGenerationsPerMonth: 200 },
        features: { watermark: false, apiAccess: false, aiVoiceCloning: false, socialPublishing: true, customFonts: false, exportFormats: ['mp4', 'webm'] }
      },
      {
        slug: 'pro',
        tier: 'PRO',
        monthlyPriceInCents: 2999,
        yearlyPriceInCents: 28788,
        limits: { maxProjects: 50, maxStorage: 53687091200, maxRenders: 100, maxAiCredits: 1000, maxTeamMembers: 10, maxWorkspaces: 10, maxUploadSize: 2147483648, maxExportsPerMonth: 100, maxAiGenerationsPerMonth: 1000 },
        features: { watermark: false, customBranding: true, prioritySupport: false, apiAccess: true, aiVoiceCloning: false, socialPublishing: true, customFonts: true, exportFormats: ['mp4', 'webm', 'mov'] }
      },
      {
        slug: 'team',
        tier: 'TEAM',
        monthlyPriceInCents: 7999,
        yearlyPriceInCents: 76788,
        limits: { maxProjects: 200, maxStorage: 214748364800, maxRenders: 500, maxAiCredits: 5000, maxTeamMembers: 50, maxWorkspaces: 50, maxUploadSize: 5368709120, maxExportsPerMonth: 500, maxAiGenerationsPerMonth: 5000 },
        features: { watermark: false, customBranding: true, prioritySupport: true, apiAccess: true, aiVoiceCloning: true, socialPublishing: true, customFonts: true, exportFormats: ['mp4', 'webm', 'mov', 'gif'] }
      },
      {
        slug: 'enterprise',
        tier: 'ENTERPRISE',
        monthlyPriceInCents: 19999,
        yearlyPriceInCents: 191988,
        limits: { maxProjects: -1, maxStorage: 1099511627776, maxRenders: -1, maxAiCredits: -1, maxTeamMembers: -1, maxWorkspaces: -1, maxUploadSize: 10737418240, maxExportsPerMonth: -1, maxAiGenerationsPerMonth: -1 },
        features: { watermark: false, customBranding: true, prioritySupport: true, apiAccess: true, aiVoiceCloning: true, socialPublishing: true, customFonts: true, exportFormats: ['mp4', 'webm', 'mov', 'gif', 'av1'] }
      }
    ];

    for (const plan of plans) {
      await tx.organizationPlan.upsert({
        where: { slug: plan.slug },
        update: plan,
        create: plan,
      });
    }

    console.log('Seeding Admin User...');
    await tx.user.upsert({
      where: { email: 'admin@tasma.studio' },
      update: {
        role: Role.SUPER_ADMIN,
      },
      create: {
        email: 'admin@tasma.studio',
        username: 'admin',
        name: 'Super Admin',
        role: Role.SUPER_ADMIN,
        emailVerified: true,
      },
    });

    console.log('Seeding AI Providers...');
    const providers = [
      { name: 'openai', displayName: 'OpenAI', type: AiProviderType.LLM, baseUrl: 'https://api.openai.com', status: AiProviderStatus.ACTIVE, priority: 1 },
      { name: 'elevenlabs', displayName: 'ElevenLabs', type: AiProviderType.TTS, baseUrl: 'https://api.elevenlabs.io', status: AiProviderStatus.ACTIVE, priority: 1 },
      { name: 'stabilityai', displayName: 'Stability AI', type: AiProviderType.IMAGE_GEN, baseUrl: 'https://api.stability.ai', status: AiProviderStatus.ACTIVE, priority: 1 }
    ];

    for (const provider of providers) {
      await tx.aiProvider.upsert({
        where: { name: provider.name },
        update: provider,
        create: provider,
      });
    }

    console.log('Seeding System Settings...');
    const settings = [
      { key: 'site_name', value: 'Tasma', category: SystemSettingCategory.GENERAL, isPublic: true },
      { key: 'maintenance_mode', value: 'false', category: SystemSettingCategory.GENERAL, isPublic: true },
      { key: 'max_upload_size', value: '5368709120', category: SystemSettingCategory.STORAGE, isPublic: true },
      { key: 'default_ai_model', value: 'gpt-4o', category: SystemSettingCategory.AI, isPublic: false },
      { key: 'render_timeout_ms', value: '3600000', category: SystemSettingCategory.RENDERING, isPublic: false }
    ];

    for (const setting of settings) {
      await tx.systemSetting.upsert({
        where: { key: setting.key },
        update: setting,
        create: setting,
      });
    }

    console.log('Seeding Feature Flags...');
    const flags = [
      { key: 'social_publishing', name: 'Social Publishing', enabled: true, rolloutPercentage: 100 },
      { key: 'ai_voice_cloning', name: 'AI Voice Cloning', enabled: false, rolloutPercentage: 0 },
      { key: 'new_timeline_editor', name: 'New Timeline Editor', enabled: false, rolloutPercentage: 0 },
      { key: 'maintenance_mode', name: 'Maintenance Mode', enabled: false, rolloutPercentage: 0 }
    ];

    for (const flag of flags) {
      // Assuming FeatureFlagType enum exists if required, but mapping simple properties
      await tx.featureFlag.upsert({
        where: { key: flag.key },
        update: flag,
        create: flag,
      });
    }
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
