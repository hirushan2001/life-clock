import { motion } from 'framer-motion';
import { useLiveAge } from '@/hooks/useLiveAge';

interface AgeCounterProps {
  dateOfBirth: string;
  name: string;
  hasActiveGoal?: boolean;
}

const AgeCounter = ({ dateOfBirth, name, hasActiveGoal = false }: AgeCounterProps) => {
  const { age, pad } = useLiveAge(dateOfBirth);

  if (!age) return null;

  const units = [
    { value: age.years, label: 'Years', size: 'large' },
    { value: age.months, label: 'Months', size: 'medium' },
    { value: age.days, label: 'Days', size: 'medium' },
    { value: age.hours, label: 'Hours', size: 'small' },
    { value: age.minutes, label: 'Minutes', size: 'small' },
    { value: age.seconds, label: 'Seconds', size: 'small' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-sm uppercase tracking-widest mb-2"
        >
          Live Age
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl md:text-3xl font-semibold gradient-text"
        >
          {name}
        </motion.h2>
      </div>

      {/* Main counter grid */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
        {units.map((unit, index) => (
          <motion.div
            key={unit.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index, duration: 0.4 }}
            className={`counter-unit glass rounded-xl ${unit.size === 'large' ? 'col-span-1' : ''
              }`}
          >
            <motion.span
              key={unit.value}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              className="counter-value"
            >
              {unit.size === 'large' ? unit.value : pad(unit.value)}
            </motion.span>
            <span className="counter-label">{unit.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Milliseconds - Sand timer effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center"
      >
        <div className="glass rounded-xl px-8 py-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/10 to-primary/5 animate-sand-fall" />
          <div className="relative flex items-baseline gap-2">
            <span className={`font-mono text-4xl md:text-5xl font-bold transition-colors duration-500 tabular-nums ${hasActiveGoal ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'text-primary'
              }`}>
              {pad(age.milliseconds, 3)}
            </span>
            <span className="text-sm text-muted-foreground uppercase tracking-widest">
              ms
            </span>
          </div>
        </div>
      </motion.div>

      {/* Total stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
      >
        <div className="text-center">
          <span className="font-mono text-lg text-foreground">{age.totalDays.toLocaleString()}</span>
          <p className="text-xs uppercase tracking-wider mt-1">Total Days</p>
        </div>
        <div className="text-center">
          <span className="font-mono text-lg text-foreground">{age.totalWeeks.toLocaleString()}</span>
          <p className="text-xs uppercase tracking-wider mt-1">Total Weeks</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AgeCounter;
