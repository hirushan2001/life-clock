import { motion, AnimatePresence } from 'framer-motion';
import { Profile } from '@/hooks/useProfiles';
import { User, Plus, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ProfileSelectorProps {
  profiles: Profile[];
  activeProfileId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

const ProfileSelector = ({
  profiles,
  activeProfileId,
  onSelect,
  onAdd,
  onDelete,
}: ProfileSelectorProps) => {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Profiles
        </h3>
        <div className="flex gap-2">
          {profiles.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDelete(!showDelete)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onAdd}
            className="text-muted-foreground hover:text-primary"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <AnimatePresence mode="popLayout">
          {profiles.map((profile) => {
            const isActive = profile.id === activeProfileId;
            return (
              <motion.button
                key={profile.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (showDelete && profiles.length > 1) {
                    onDelete(profile.id);
                  } else {
                    onSelect(profile.id);
                  }
                }}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                  ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }
                  ${showDelete && profiles.length > 1 ? 'hover:bg-destructive hover:text-destructive-foreground' : ''}
                `}
              >
                {showDelete && profiles.length > 1 ? (
                  <Trash2 className="w-4 h-4" />
                ) : isActive ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">{profile.name}</span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ProfileSelector;
