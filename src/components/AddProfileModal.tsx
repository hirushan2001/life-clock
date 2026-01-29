import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, UserPlus, Calendar, Target, User } from 'lucide-react';

interface AddProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (profile: { name: string; dateOfBirth: string; targetAge: number }) => void;
}

const AddProfileModal = ({ isOpen, onClose, onAdd }: AddProfileModalProps) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [targetAge, setTargetAge] = useState('80');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }

    if (!dob) {
      setError('Please enter a date of birth');
      return;
    }

    const birthDate = new Date(dob);
    const today = new Date();
    
    if (birthDate > today) {
      setError('Date of birth cannot be in the future');
      return;
    }

    const target = parseInt(targetAge) || 80;
    const age = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
    
    if (target < age) {
      setError('Target age must be greater than current age');
      return;
    }

    onAdd({
      name: name.trim(),
      dateOfBirth: dob,
      targetAge: target,
    });

    // Reset form
    setName('');
    setDob('');
    setTargetAge('80');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-4"
          >
            <div className="glass rounded-2xl p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <UserPlus className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold">Add Profile</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-name" className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Name
                  </Label>
                  <Input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                    className="bg-background/50"
                    maxLength={50}
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-dob" className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    Date of Birth
                  </Label>
                  <Input
                    id="profile-dob"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="bg-background/50"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-target" className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    Target Age
                  </Label>
                  <Input
                    id="profile-target"
                    type="number"
                    value={targetAge}
                    onChange={(e) => setTargetAge(e.target.value)}
                    placeholder="80"
                    min="1"
                    max="150"
                    className="bg-background/50"
                  />
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

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Add Profile
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddProfileModal;
