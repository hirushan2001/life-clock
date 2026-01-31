import { motion } from 'framer-motion';
import { useLiveAge } from '@/hooks/useLiveAge';
import { Clock, Calendar, Sun, Percent } from 'lucide-react';
import QuoteJournal from '@/components/QuoteJournal';

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
        {cards.map((card, index) => {
          // Micro-interaction: Weekends Left tooltip
          const isWeekends = card.label === 'Weekends Left';
          // Micro-interaction: Life Completed flip
          const isLifeCompleted = card.label === 'Life Completed';

          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-xl p-5 group hover:bg-card/90 transition-all duration-300 hover:scale-[1.02] relative"
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg bg-primary/10 ${card.color}`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">{card.label}</p>

                  <div className="relative">
                    {/* Standard Value */}
                    <p
                      className={`text-2xl font-mono font-bold ${card.color} transition-opacity duration-300 
                      ${isLifeCompleted ? 'group-hover:opacity-0' : ''}`}
                    >
                      {card.value}
                    </p>

                    {/* Hidden "Flip" Value for Life Completed */}
                    {isLifeCompleted && (
                      <p className={`text-2xl font-mono font-bold text-emerald-400 absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                        {Math.max(0, 100 - insights.percentComplete).toFixed(2)}%
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground mt-1">
                    {isLifeCompleted ? (
                      <span className="block group-hover:hidden">{card.subtext}</span>
                    ) : (
                      card.subtext
                    )}
                    {isLifeCompleted && (
                      <span className="hidden group-hover:block text-emerald-400">remaining</span>
                    )}
                  </p>

                  {/* Weekends Left Hover Wisdom */}
                  {isWeekends && (
                    <div className="absolute inset-0 bg-background/95 backdrop-blur-sm rounded-xl flex items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none text-center">
                      <p className="text-sm text-amber-500 font-medium">
                        "That's only about {Math.ceil(insights.weekendsRemaining / 26)} more beach seasons."
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <QuoteJournal />
    </motion.div>
  );
};

export default Insights;
