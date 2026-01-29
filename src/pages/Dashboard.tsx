import { useState } from 'react';
import { motion } from 'framer-motion';
import { Hourglass, Settings } from 'lucide-react';
import { useProfiles } from '@/hooks/useProfiles';
import { useTheme } from '@/hooks/useTheme';
import AgeCounter from '@/components/AgeCounter';
import LifeGrid from '@/components/LifeGrid';
import Insights from '@/components/Insights';
import GoalInput from '@/components/GoalInput';
import ProfileSelector from '@/components/ProfileSelector';
import ThemeToggle from '@/components/ThemeToggle';
import AddProfileModal from '@/components/AddProfileModal';

const Dashboard = () => {
  const {
    profiles,
    activeProfile,
    activeProfileId,
    setActiveProfile,
    deleteProfile,
    addProfile,
    todayGoal,
    setTodayGoal,
    toggleGoalComplete,
  } = useProfiles();

  useTheme(); // Initialize theme

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (!activeProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 border-b border-border/50 glass"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 180, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="p-2 rounded-xl bg-primary/10"
            >
              <Hourglass className="w-6 h-6 text-primary" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold gradient-text">Memento</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Life Clock
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Profile selector */}
        <ProfileSelector
          profiles={profiles}
          activeProfileId={activeProfileId}
          onSelect={setActiveProfile}
          onAdd={() => setIsAddModalOpen(true)}
          onDelete={deleteProfile}
        />

        {/* Age Counter - Hero section */}
        <section className="py-8">
          <AgeCounter
            dateOfBirth={activeProfile.dateOfBirth}
            name={activeProfile.name}
          />
        </section>

        {/* Two column layout for insights and goal */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Insights */}
          <Insights
            dateOfBirth={activeProfile.dateOfBirth}
            targetAge={activeProfile.targetAge}
          />

          {/* Goal */}
          <GoalInput
            goal={todayGoal}
            onSave={setTodayGoal}
            onToggleComplete={toggleGoalComplete}
          />
        </section>

        {/* Life Grid */}
        <section className="py-8">
          <LifeGrid
            dateOfBirth={activeProfile.dateOfBirth}
            targetAge={activeProfile.targetAge}
          />
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            Make every week count.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            Data stored locally on your device
          </p>
        </footer>
      </main>

      {/* Add Profile Modal */}
      <AddProfileModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addProfile}
      />
    </div>
  );
};

export default Dashboard;
