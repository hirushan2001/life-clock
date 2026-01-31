import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { DailyGoal } from '@/hooks/useProfiles';
import { Target, Check, Edit2, Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface GoalInputProps {
  goals: DailyGoal[];
  onAdd: (text: string) => void;
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const GoalInput = ({ goals, onAdd, onUpdate, onDelete, onToggle }: GoalInputProps) => {
  const [newGoal, setNewGoal] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [, setTick] = useState(0); // Force re-render for timer

  // Update timer every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setTick(t => t + 1);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleAdd = () => {
    if (newGoal.trim()) {
      onAdd(newGoal.trim());
      setNewGoal('');
    }
  };

  const startEditing = (id: string, currentText: string) => {
    setEditingId(id);
    setEditValue(currentText);
  };

  const saveEdit = (id: string) => {
    if (editValue.trim()) {
      onUpdate(id, editValue.trim());
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  return (
    <div className="glass rounded-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/20">
          <Target className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Goals of the Day</h3>
          <p className="text-xs text-muted-foreground">What will you accomplish today?</p>
        </div>
      </div>

      {/* Add New Goal */}
      <div className="flex gap-2">
        <Input
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add a new goal..."
          className="flex-1 bg-background/50"
        />
        <Button onClick={handleAdd} disabled={!newGoal.trim()} size="icon" className="shrink-0">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Goals List */}
      <div className="space-y-2 mt-2">
        <AnimatePresence mode="popLayout">
          {goals.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-xs text-muted-foreground py-2 italic"
            >
              No goals set for today yet.
            </motion.p>
          ) : (
            goals.map((goal) => (
              <motion.div
                key={goal.id || goal.goal} // Fallback to text for legacy goals without ID
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group flex items-center gap-3 bg-secondary/10 p-2 rounded-lg hover:bg-secondary/20 transition-colors"
              >
                {editingId === goal.id ? (
                  <div className="flex-1 flex gap-2">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(goal.id);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      autoFocus
                      className="h-8 text-sm"
                    />
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => saveEdit(goal.id)}>
                      <Check className="w-4 h-4 text-emerald-500" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={cancelEdit}>
                      <X className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => onToggle(goal.id)}
                      className={`
                        flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
                        transition-all duration-300
                        ${goal.completed ? 'bg-primary border-primary' : 'border-muted-foreground/30 hover:border-primary'}
                      `}
                    >
                      {goal.completed && <Check className="w-3 h-3 text-primary-foreground" />}
                    </button>

                    <div className="flex flex-col flex-1 min-w-0">
                      <span
                        className={`text-sm break-words ${goal.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                        onDoubleClick={() => startEditing(goal.id, goal.goal)}
                      >
                        {goal.goal}
                      </span>
                      {goal.createdAt && (
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-muted-foreground/60">
                            {new Date(goal.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                          </span>
                          {!goal.completed && (
                            <span className="text-[10px] font-medium text-amber-500/80">
                              • {(() => {
                                const now = new Date();
                                const endOfDay = new Date();
                                endOfDay.setHours(23, 59, 59, 999);
                                const diff = endOfDay.getTime() - now.getTime();
                                const hours = Math.floor(diff / (1000 * 60 * 60));
                                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                                return `${hours}h ${minutes}m left`;
                              })()}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={() => startEditing(goal.id, goal.goal)}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => onDelete(goal.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>


      {/* Active Goal Indicator */}
      {
        goals.some(g => !g.completed) && (
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
        )
      }
    </div >
  );
};

export default GoalInput;
