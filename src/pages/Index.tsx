import { useState, useEffect } from 'react';
import { useProfiles } from '@/hooks/useProfiles';
import { useTheme } from '@/hooks/useTheme';
import OnboardingGate from '@/components/OnboardingGate';
import Dashboard from '@/pages/Dashboard';
import SplashScreen from '@/components/SplashScreen';
import { AnimatePresence } from 'framer-motion';

const Index = () => {
  const { hasProfiles } = useProfiles();
  const [isLoading, setIsLoading] = useState(true);
  useTheme(); // Initialize theme on mount

  useEffect(() => {
    // Simulate loading time for the splash screen
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (!hasProfiles) {
    return <OnboardingGate onComplete={() => { }} />;
  }

  return (
    <AnimatePresence mode="wait">
      <Dashboard />
    </AnimatePresence>
  );
};

export default Index;
