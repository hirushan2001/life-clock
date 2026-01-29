import { useProfiles } from '@/hooks/useProfiles';
import { useTheme } from '@/hooks/useTheme';
import OnboardingGate from '@/components/OnboardingGate';
import Dashboard from '@/pages/Dashboard';

const Index = () => {
  const { hasProfiles } = useProfiles();
  useTheme(); // Initialize theme on mount

  if (!hasProfiles) {
    return <OnboardingGate onComplete={() => {}} />;
  }

  return <Dashboard />;
};

export default Index;
