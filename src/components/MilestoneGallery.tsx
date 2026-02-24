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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { differenceInDays, parseISO, format } from 'date-fns';



const MilestoneCard = ({ milestone, onDelete }: { milestone: Milestone; onDelete: (id: string) => void }) => {
    const [daysRemaining, setDaysRemaining] = useState(0);
    const [hoursRemaining, setHoursRemaining] = useState(0);
    const [minutesRemaining, setMinutesRemaining] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const calculateProgress = () => {
            const start = parseISO(milestone.createdAt).getTime();
            const target = parseISO(milestone.targetDate);
            const now = new Date();
            const daysLeft = Math.max(0, differenceInDays(target, now));

            // For hours and minutes we need total differences then modulo
            // date-fns difference functions floor the result, which is what we want
            const totalHoursLeft = Math.max(0, Math.floor((target.getTime() - now.getTime()) / (1000 * 60 * 60)));
            const hoursLeft = totalHoursLeft % 24;

            const totalMinutesLeft = Math.max(0, Math.floor((target.getTime() - now.getTime()) / (1000 * 60)));
            const minutesLeft = totalMinutesLeft % 60;

            const totalDuration = target.getTime() - start;
            const elapsed = now.getTime() - start;

            let calculatedProgress = 0;
            if (totalDuration > 0) {
                calculatedProgress = (elapsed / totalDuration) * 100;
            } else if (totalDuration <= 0 && elapsed > 0) {
                calculatedProgress = 100;
            }

            setDaysRemaining(daysLeft);
            setHoursRemaining(hoursLeft);
            setMinutesRemaining(minutesLeft);
            setProgress(calculatedProgress);
        };

        calculateProgress();
        const interval = setInterval(calculateProgress, 10000); // Update every 10 seconds since we have minutes now
        return () => clearInterval(interval);
    }, [milestone]);

    const isCompleted = daysRemaining <= 0 && hoursRemaining <= 0 && minutesRemaining <= 0;

    return (
        <div className="bg-[#11141c] p-6 pb-8 rounded-xl flex flex-col items-center justify-between gap-6 relative group hover:bg-[#1a1f2e] transition-all duration-300 w-full border border-white/5 overflow-hidden">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <button
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-background/50 hover:bg-destructive/10 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Milestone?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently remove "{milestone.title}" from your dashboard.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(milestone.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="text-center w-full mt-2">
                <h4 className="font-semibold text-base truncate px-4" title={milestone.title}>
                    {milestone.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                    {format(parseISO(milestone.targetDate), 'MMM d, yyyy • h:mm a')}
                </p>
            </div>

            {isCompleted ? (
                <div className="w-full py-6 flex flex-col items-center justify-center rounded-xl bg-[#1a1f2e]">
                    <span className="text-3xl font-bold text-emerald-500 tracking-wider">DONE</span>
                    <span className="text-[11px] uppercase tracking-wider text-[#8b92a5] mt-2">Milestone Reached</span>
                </div>
            ) : (
                <div className="flex justify-center gap-2 w-full z-10">
                    <div className="flex flex-col items-center justify-center bg-[#1a1f2e] rounded-xl py-4 flex-1 min-w-0 z-10">
                        <span className="text-[32px] font-bold text-[#f59e0b] leading-none tracking-tight font-mono">
                            {daysRemaining}
                        </span>
                        <span className="text-[11px] uppercase text-[#8b92a5] mt-2 tracking-wider font-medium">Days</span>
                    </div>

                    <div className="flex flex-col items-center justify-center bg-[#1a1f2e] rounded-xl py-4 flex-1 min-w-0 z-10">
                        <span className="text-[32px] font-bold text-[#f59e0b] leading-none tracking-tight font-mono">
                            {hoursRemaining}
                        </span>
                        <span className="text-[11px] uppercase text-[#8b92a5] mt-2 tracking-wider font-medium">Hours</span>
                    </div>

                    <div className="flex flex-col items-center justify-center bg-[#1a1f2e] rounded-xl py-4 flex-1 min-w-0 z-10">
                        <span className="text-[32px] font-bold text-[#f59e0b] leading-none tracking-tight font-mono">
                            {minutesRemaining}
                        </span>
                        <span className="text-[11px] uppercase text-[#8b92a5] mt-2 tracking-wider font-medium">Minutes</span>
                    </div>
                </div>
            )}

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-1.5 w-full bg-black/20">
                <motion.div
                    className={`h-full ${isCompleted ? 'bg-emerald-500' : 'bg-[#f59e0b]'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>
        </div>
    );
};

export const MilestoneGallery = () => {
    const { milestones, addMilestone, removeMilestone } = useMilestones();
    const [isOpen, setIsOpen] = useState(false);
    const [isBulkOpen, setIsBulkOpen] = useState(false);
    const [bulkText, setBulkText] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle || !newDate) return;

        const dateString = newTime ? `${newDate}T${newTime}` : `${newDate}T00:00`;

        addMilestone({
            title: newTitle,
            targetDate: new Date(dateString).toISOString(),
            color: 'amber',
        });

        setNewTitle('');
        setNewDate('');
        setNewTime('');
        setIsOpen(false);
    };

    const handleBulkSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!bulkText.trim()) return;

        const lines = bulkText.split('\n');
        const year = new Date().getFullYear();

        lines.forEach(line => {
            if (!line.trim()) return;

            // Extract the date from start MM/DD or M/DD
            const dateMatch = line.match(/^(\d{1,2})\/(\d{1,2})/);
            if (!dateMatch) return;

            const month = dateMatch[1].padStart(2, '0');
            const day = dateMatch[2].padStart(2, '0');

            // Try to extract title: everything after the last hyphen
            const parts = line.split('-');
            const title = parts.length > 1 ? parts[parts.length - 1].trim() : line.trim();

            // Try to extract hour (first digit block after the first hyphen)
            let hourStr = '00';
            const hourMatch = line.match(/-\s*(\d{1,2})/);
            if (hourMatch) {
                let hour = parseInt(hourMatch[1], 10);
                if (hour >= 1 && hour <= 6) {
                    hour += 12; // Assume 1-6 is PM for classes/exams
                }
                hourStr = hour.toString().padStart(2, '0');
            }

            const dateString = `${year}-${month}-${day}T${hourStr}:00:00`;
            let d = new Date(dateString);

            // Handle edge case where month passed (say we are in Dec 2026, and date is for Jan 2027)
            if (d.getTime() < new Date().getTime() - 60 * 24 * 60 * 60 * 1000) {
                d.setFullYear(year + 1);
            }

            addMilestone({
                title: title,
                targetDate: d.toISOString(),
                color: 'amber',
            });
        });

        setBulkText('');
        setIsBulkOpen(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Milestones</h3>

                <div className="flex items-center gap-2">
                    <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2 text-xs hidden sm:flex">
                                <CalendarIcon className="w-3.5 h-3.5" />
                                Bulk Import
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Bulk Add Milestones</DialogTitle>
                                <DialogDescription>
                                    Paste your schedule. Format: MM/DD - start_time - end_time - Title (e.g. 03/04 - 1 -4 - ASE)
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleBulkSubmit} className="space-y-4 pt-2">
                                <Textarea
                                    value={bulkText}
                                    onChange={(e) => setBulkText(e.target.value)}
                                    placeholder={`03/04 - 1 -4 - ASE\n03/06 - 1 -4 - Multimedia Systems\n03/09 - 1 -4 - ML`}
                                    className="min-h-[150px] font-mono text-sm"
                                />
                                <DialogFooter>
                                    <Button type="submit" disabled={!bulkText.trim()}>
                                        Import Milestones
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

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
                                <div className="grid grid-cols-2 gap-4">
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
                                    <div className="space-y-2">
                                        <Label htmlFor="time">Time (Optional)</Label>
                                        <Input
                                            id="time"
                                            type="time"
                                            value={newTime}
                                            onChange={(e) => setNewTime(e.target.value)}
                                        />
                                    </div>
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
