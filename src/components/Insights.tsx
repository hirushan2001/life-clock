import { motion } from 'framer-motion';
import { useLiveAge } from '@/hooks/useLiveAge';
import { Clock, Calendar, Sun, Percent } from 'lucide-react';

interface InsightsProps {
  dateOfBirth: string;
  targetAge: number;
}

const Insights = ({ dateOfBirth, targetAge }: InsightsProps) => {
  const { insights } = useLiveAge(dateOfBirth, targetAge);

  if (!insights) return null;

  const cards = [
    {
      icon: Percent,
      label: 'Life Completed',
      value: `${insights.percentComplete.toFixed(2)}%`,
      subtext: 'of your target lifespan',
      color: 'text-primary',
    },
    {
      icon: Calendar,
      label: 'Weeks Remaining',
      value: insights.weeksRemaining.toLocaleString(),
      subtext: `of ${(targetAge * 52).toLocaleString()} total weeks`,
      color: 'text-amber-glow',
    },
    {
      icon: Clock,
      label: 'Years Remaining',
      value: insights.yearsRemaining.toString(),
      subtext: `until age ${targetAge}`,
      color: 'text-primary',
    },
    {
      icon: Sun,
      label: 'Weekends Left',
      value: insights.weekendsRemaining.toLocaleString(),
      subtext: 'make each one count',
      color: 'text-amber-glow',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-4"
    >
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-1">Time Insights</h3>
        <p className="text-sm text-muted-foreground">
          Understanding your journey to age {targetAge}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-xl p-5 group hover:bg-card/90 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg bg-primary/10 ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
                <p className={`text-2xl font-mono font-bold ${card.color}`}>
                  {card.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{card.subtext}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Motivational quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-xl p-6 text-center mt-6"
      >
        <p className="text-muted-foreground italic">
          "The trouble is, you think you have time."
        </p>
        <p className="text-xs text-muted-foreground/60 mt-2">— Jack Kornfield</p>
      </motion.div>
    </motion.div>
  );
};

export default Insights;
