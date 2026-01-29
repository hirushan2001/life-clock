import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useLiveAge } from '@/hooks/useLiveAge';

interface LifeGridProps {
  dateOfBirth: string;
  targetAge: number;
}

const LifeGrid = ({ dateOfBirth, targetAge }: LifeGridProps) => {
  // Update only once per minute, we don't need millisecond precision here
  const { insights } = useLiveAge(dateOfBirth, targetAge, 60000);

  // Generate grid of weeks (capped at 4160 = 80 years for display)
  const totalWeeks = useMemo(() => {
    return Math.min(targetAge * 52, 4160);
  }, [targetAge]);

  const weeksPerRow = 52; // One row per year
  const rows = Math.ceil(totalWeeks / weeksPerRow);

  const grid = useMemo(() => {
    if (!insights) return null;

    return (
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
              // const isRemaining = weekNumber > insights.currentWeek;

              let className = 'week-box ';
              if (isCurrent) {
                className += 'week-current animate-pulse';
              } else if (isLived) {
                className += 'week-lived';
              } else {
                className += 'week-remaining';
              }

              return (
                <div
                  key={colIndex}
                  className={className}
                  title={`Week ${weekNumber} (Year ${Math.floor(weekNumber / 52)})`}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  }, [rows, totalWeeks, insights]);

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
        {grid}
      </div>

      {/* Bottom label */}
      <p className="text-center text-xs text-muted-foreground">
        52 weeks per row = 1 year
      </p>
    </motion.div>
  );
};

export default LifeGrid;
