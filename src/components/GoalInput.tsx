import { motion } from 'framer-motion';
import { useState } from 'react';
import { DailyGoal } from '@/hooks/useProfiles';
import { Target, Check, Edit2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface GoalInputProps {
  goal: DailyGoal | null;
  onSave: (goal: string) => void;
  onToggleComplete: () => void;
}

const GoalInput = ({ goal, onSave, onToggleComplete }: GoalInputProps) => {
  const [isEditing, setIsEditing] = useState(!goal);
  const [inputValue, setInputValue] = useState(goal?.goal || '');

  const handleSave = () => {
    if (inputValue.trim()) {
      onSave(inputValue.trim());
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setInputValue(goal?.goal || '');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-5"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${goal ? 'bg-primary/20' : 'bg-muted'}`}>
          <Target className={`w-5 h-5 ${goal ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Goal of the Day</h3>
          <p className="text-xs text-muted-foreground">What will you accomplish today?</p>
        </div>
      </div>

      {isEditing || !goal ? (
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your goal for today..."
            className="flex-1 bg-background/50"
            autoFocus
          />
          <Button
            onClick={handleSave}
            disabled={!inputValue.trim()}
            size="icon"
            className="shrink-0"
          >
            <Save className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleComplete}
            className={`
              flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center
              transition-all duration-300
              ${
                goal.completed
                  ? 'bg-primary border-primary'
                  : 'border-muted-foreground/30 hover:border-primary'
              }
            `}
          >
            {goal.completed && <Check className="w-4 h-4 text-primary-foreground" />}
          </button>
          
          <p
            className={`flex-1 text-foreground ${
              goal.completed ? 'line-through text-muted-foreground' : ''
            }`}
          >
            {goal.goal}
          </p>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setInputValue(goal.goal);
              setIsEditing(true);
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        </div>
      )}

      {goal && !goal.completed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 pt-4 border-t border-border/50"
        >
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Goal active — make today count!</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GoalInput;
