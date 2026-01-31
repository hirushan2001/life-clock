import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { useMilestones, Milestone } from '@/hooks/useMilestones';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { differenceInDays, parseISO, format } from 'date-fns';

const CircularProgress = ({
    percentage,
    color,
    size = 80,
    strokeWidth = 6,
    children,
}: {
    percentage: number;
    color: string;
    size?: number;
    strokeWidth?: number;
    children?: React.ReactNode;
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="text-muted/20"
                />
                <motion.circle
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                    className={color}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                {children}
            </div>
        </div>
    );
};

const MilestoneCard = ({ milestone, onDelete }: { milestone: Milestone; onDelete: (id: string) => void }) => {
    const [progress, setProgress] = useState(0);
    const [daysRemaining, setDaysRemaining] = useState(0);

    useEffect(() => {
        const calculateProgress = () => {
            const start = parseISO(milestone.createdAt).getTime();
            const end = parseISO(milestone.targetDate).getTime();
            const now = new Date().getTime();

            const totalDuration = end - start;
            const elapsed = now - start;

            // Prevent division by zero and handle past/future
            let calculatedProgress = 0;
            if (totalDuration > 0) {
                calculatedProgress = (elapsed / totalDuration) * 100;
            } else if (totalDuration <= 0 && elapsed > 0) {
                calculatedProgress = 100;
            }

            const daysLeft = differenceInDays(parseISO(milestone.targetDate), new Date());

            setProgress(calculatedProgress);
            setDaysRemaining(daysLeft);
        };

        calculateProgress();
        const interval = setInterval(calculateProgress, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [milestone]);

    const isCompleted = daysRemaining <= 0;

    return (
        <div className="glass p-4 rounded-xl flex flex-col items-center justify-between gap-3 relative group hover:bg-card/80 transition-all duration-300">
            <button
                onClick={() => onDelete(milestone.id)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-background/50 hover:bg-destructive/10 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
            >
                <Trash2 className="w-3.5 h-3.5" />
            </button>

            <div className="mt-2">
                <CircularProgress
                    percentage={progress}
                    color={isCompleted ? "text-emerald-500" : "text-amber-500"}
                    size={90}
                >
                    <div className="text-center">
                        <span className={`text-lg font-bold ${isCompleted ? "text-emerald-500" : "text-foreground"}`}>
                            {isCompleted ? "Done" : daysRemaining}
                        </span>
                        <span className="text-[10px] uppercase text-muted-foreground block -mt-1">
                            {isCompleted ? "Great!" : "Days"}
                        </span>
                    </div>
                </CircularProgress>
            </div>

            <div className="text-center w-full">
                <h4 className="font-medium text-sm truncate px-2" title={milestone.title}>
                    {milestone.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                    {format(parseISO(milestone.targetDate), 'MMM d, yyyy')}
                </p>
            </div>
        </div>
    );
};

export const MilestoneGallery = () => {
    const { milestones, addMilestone, removeMilestone } = useMilestones();
    const [isOpen, setIsOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDate, setNewDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle || !newDate) return;

        addMilestone({
            title: newTitle,
            targetDate: new Date(newDate).toISOString(), // Use 00:00 local time
            color: 'amber',
        });

        setNewTitle('');
        setNewDate('');
        setIsOpen(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Milestones</h3>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2 text-xs">
                            <Plus className="w-3.5 h-3.5" />
                            Add Milestone
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Milestone</DialogTitle>
                            <DialogDescription>
                                Set a target date for a significant life event.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                            <div className="space-y-2">
                                <Label htmlFor="title">Milestone Title</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g. End of University, World Trip"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    maxLength={30}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date">Target Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    value={newDate}
                                    onChange={(e) => setNewDate(e.target.value)}
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={!newTitle || !newDate}>
                                    Create Milestone
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {milestones.length === 0 ? (
                <div className="glass rounded-xl p-8 text-center border-dashed border-2 border-border/50 bg-card/30">
                    <CalendarIcon className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                        No milestones yet. Set a target date to track!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {milestones.map((milestone) => (
                        <MilestoneCard
                            key={milestone.id}
                            milestone={milestone}
                            onDelete={removeMilestone}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MilestoneGallery;
