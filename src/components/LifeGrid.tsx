import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useLiveAge } from '@/hooks/useLiveAge';

interface LifeGridProps {
  dateOfBirth: string;
  targetAge: number;
}

const LifeGrid = ({ dateOfBirth, targetAge }: LifeGridProps) => {
  const { insights } = useLiveAge(dateOfBirth, targetAge);

  // Generate grid of weeks (capped at 4160 = 80 years for display)
  const totalWeeks = useMemo(() => {
    return Math.min(targetAge * 52, 4160);
  }, [targetAge]);

  const weeksPerRow = 52; // One row per year
  const rows = Math.ceil(totalWeeks / weeksPerRow);

  if (!insights) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="space-y-4"
    >
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-1">Life in Weeks</h3>
        <p className="text-sm text-muted-foreground">
          Each box represents one week of your {targetAge}-year life
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-6">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${insights.percentComplete}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-amber-dim via-primary to-amber-glow rounded-full"
        />
      </div>

      {/* Stats row */}
      <div className="flex justify-center gap-8 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-week-lived" />
          <span className="text-muted-foreground">
            Lived: <span className="text-foreground font-mono">{insights.weeksLived.toLocaleString()}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-week-current animate-pulse" />
          <span className="text-muted-foreground">
            Current: <span className="text-foreground font-mono">{insights.currentWeek.toLocaleString()}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-week-remaining" />
          <span className="text-muted-foreground">
            Remaining: <span className="text-foreground font-mono">{insights.weeksRemaining.toLocaleString()}</span>
          </span>
        </div>
      </div>

      {/* Week grid */}
      <div className="glass rounded-xl p-4 overflow-x-auto">
        <div className="min-w-fit mx-auto" style={{ maxWidth: '100%' }}>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex gap-0.5 mb-0.5">
              {/* Year label */}
              <div className="w-8 flex items-center justify-end pr-2">
                {rowIndex % 10 === 0 && (
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {rowIndex}
                  </span>
                )}
              </div>
              
              {/* Weeks in year */}
              {Array.from({ length: weeksPerRow }).map((_, colIndex) => {
                const weekNumber = rowIndex * weeksPerRow + colIndex + 1;
                if (weekNumber > totalWeeks) return null;

                const isLived = weekNumber < insights.currentWeek;
                const isCurrent = weekNumber === insights.currentWeek;
                const isRemaining = weekNumber > insights.currentWeek;

                return (
                  <motion.div
                    key={colIndex}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: Math.min(rowIndex * 0.02, 1),
                      duration: 0.2,
                    }}
                    className={`week-box ${
                      isCurrent
                        ? 'week-current animate-glow'
                        : isLived
                        ? 'week-lived'
                        : 'week-remaining'
                    }`}
                    title={`Week ${weekNumber} (Year ${Math.floor(weekNumber / 52)})`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom label */}
      <p className="text-center text-xs text-muted-foreground">
        52 weeks per row = 1 year
      </p>
    </motion.div>
  );
};

export default LifeGrid;
