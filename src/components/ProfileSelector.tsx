import { motion, AnimatePresence } from 'framer-motion';
import { Profile } from '@/hooks/useProfiles';
import { User, Plus, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setProfileToDelete(id);
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDelete(false);
      }
    };
    
    if (showDelete) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDelete]);

  const confirmDelete = () => {
    if (profileToDelete) {
      onDelete(profileToDelete);
      setProfileToDelete(null);
      // If only one profile remains after deletion (which logic in parent handles, but visual update needs to be safe), 
      // check effectively happens on next render.
      // If we are deleting the last profile available for deletion (so 1 remains), toggle off delete mode.
      if (profiles.length <= 2) {
        setShowDelete(false);
      }
    }
  };

  return (
    <>
      <motion.div
        ref={containerRef}
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
                className={`text-muted-foreground hover:text-destructive ${showDelete ? 'bg-destructive/10 text-destructive' : ''}`}
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
                      handleDeleteClick(profile.id);
                    } else {
                      onSelect(profile.id);
                    }
                  }}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                    ${isActive
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    }
                    ${showDelete && profiles.length > 1 ? 'hover:bg-destructive hover:text-destructive-foreground ring-1 ring-destructive' : ''}
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

      <AlertDialog open={!!profileToDelete} onOpenChange={(open) => !open && setProfileToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the profile
              "{profiles.find(p => p.id === profileToDelete)?.name}" and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProfileSelector;
