import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Onboarding - Tasma',
  description: 'Set up your workspace.',
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 selection:bg-primary selection:text-primary-foreground">
      <div className="w-full max-w-4xl">
        {children}
      </div>
    </div>
  );
}
