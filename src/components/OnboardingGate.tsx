import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Hourglass, ArrowRight, User, Calendar, Target } from 'lucide-react';
import { useProfiles } from '@/hooks/useProfiles';

interface OnboardingGateProps {
  onComplete: () => void;
}

const OnboardingGate = ({ onComplete }: OnboardingGateProps) => {
  const { addProfile } = useProfiles();
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [targetAge, setTargetAge] = useState('80');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!dob) {
      setError('Please enter your date of birth');
      return;
    }

    const birthDate = new Date(dob);
    const today = new Date();
    
    if (birthDate > today) {
      setError('Date of birth cannot be in the future');
      return;
    }

    const age = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
    if (age > 150) {
      setError('Please enter a valid date of birth');
      return;
    }

    const target = parseInt(targetAge) || 80;
    if (target < age) {
      setError('Target age must be greater than your current age');
      return;
    }

    addProfile({
      name: name.trim(),
      dateOfBirth: dob,
      targetAge: target,
    });

    onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-glow/10 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 180, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4"
          >
            <Hourglass className="w-8 h-8 text-primary" />
          </motion.div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="gradient-text">Memento</span>
          </h1>
          <p className="text-muted-foreground">
            Visualize your life. Value your time.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSubmit}
          className="glass rounded-2xl p-6 space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              Your Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="bg-background/50"
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob" className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Date of Birth
            </Label>
            <Input
              id="dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="bg-background/50"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAge" className="flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-muted-foreground" />
              Target Age <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="targetAge"
              type="number"
              value={targetAge}
              onChange={(e) => setTargetAge(e.target.value)}
              placeholder="80"
              min="1"
              max="150"
              className="bg-background/50"
            />
            <p className="text-xs text-muted-foreground">
              Default is 80 years, based on global life expectancy
            </p>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-destructive"
            >
              {error}
            </motion.p>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full group"
          >
            Begin Your Journey
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.form>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-muted-foreground mt-6"
        >
          Your data is stored locally on your device
        </motion.p>
      </motion.div>
    </div>
  );
};

export default OnboardingGate;
