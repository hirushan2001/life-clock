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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { differenceInDays, parseISO, format } from 'date-fns';

export const CATEGORY_COLORS: Record<string, string> = {
    Career: "bg-blue-500",
    Travel: "bg-emerald-500",
    Health: "bg-rose-500",
    Education: "bg-purple-500",
    Relationships: "bg-pink-500",
    Other: "bg-amber-500"
};

export const CATEGORY_TEXT_COLORS: Record<string, string> = {
    Career: "text-blue-500",
    Travel: "text-emerald-500",
    Health: "text-rose-500",
    Education: "text-purple-500",
    Relationships: "text-pink-500",
    Other: "text-amber-500"
};

export const CATEGORY_BORDER_COLORS: Record<string, string> = {
    Career: "group-hover:border-blue-500/50",
    Travel: "group-hover:border-emerald-500/50",
    Health: "group-hover:border-rose-500/50",
    Education: "group-hover:border-purple-500/50",
    Relationships: "group-hover:border-pink-500/50",
    Other: "group-hover:border-amber-500/50"
};

export const CATEGORIES = Object.keys(CATEGORY_COLORS);



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

    const category = milestone.category || 'Other';
    const borderClass = CATEGORY_BORDER_COLORS[category] || CATEGORY_BORDER_COLORS['Other'];
    const bgClass = CATEGORY_COLORS[category] || CATEGORY_COLORS['Other'];
    const textColorClass = CATEGORY_TEXT_COLORS[category] || CATEGORY_TEXT_COLORS['Other'];

    return (
        <div className={`bg-[#11141c] p-6 pb-8 rounded-xl flex flex-col items-center justify-between gap-6 relative group hover:bg-[#1a1f2e] transition-all duration-300 w-full border border-white/5 overflow-hidden ${borderClass}`}>

            <div className="absolute top-3 left-3 flex gap-2">
                <div className={`text-[10px] px-2 py-0.5 rounded-full bg-[#1a1f2e] border border-white/5 uppercase tracking-wider ${textColorClass}`}>
                    {category}
                </div>
            </div>

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
                    <span className={`text-3xl font-bold tracking-wider ${textColorClass}`}>DONE</span>
                    <span className="text-[11px] uppercase tracking-wider text-[#8b92a5] mt-2">Milestone Reached</span>
                </div>
            ) : (
                <div className="flex justify-center gap-2 w-full z-10">
                    <div className="flex flex-col items-center justify-center bg-[#1a1f2e] rounded-xl py-4 flex-1 min-w-0 z-10">
                        <span className={`text-[32px] font-bold leading-none tracking-tight font-mono ${textColorClass}`}>
                            {daysRemaining}
                        </span>
                        <span className="text-[11px] uppercase text-[#8b92a5] mt-2 tracking-wider font-medium">Days</span>
                    </div>

                    <div className="flex flex-col items-center justify-center bg-[#1a1f2e] rounded-xl py-4 flex-1 min-w-0 z-10">
                        <span className={`text-[32px] font-bold leading-none tracking-tight font-mono ${textColorClass}`}>
                            {hoursRemaining}
                        </span>
                        <span className="text-[11px] uppercase text-[#8b92a5] mt-2 tracking-wider font-medium">Hours</span>
                    </div>

                    <div className="flex flex-col items-center justify-center bg-[#1a1f2e] rounded-xl py-4 flex-1 min-w-0 z-10">
                        <span className={`text-[32px] font-bold leading-none tracking-tight font-mono ${textColorClass}`}>
                            {minutesRemaining}
                        </span>
                        <span className="text-[11px] uppercase text-[#8b92a5] mt-2 tracking-wider font-medium">Minutes</span>
                    </div>
                </div>
            )}

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-1.5 w-full bg-black/20">
                <motion.div
                    className={`h-full ${bgClass}`}
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
    const [newCategory, setNewCategory] = useState('Other');
    const [bulkCategory, setBulkCategory] = useState('Education'); // Default to Education since bulk was mostly used for schedule
    const [filterCategory, setFilterCategory] = useState('All');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle || !newDate) return;

        const dateString = newTime ? `${newDate}T${newTime}` : `${newDate}T00:00`;

        addMilestone({
            title: newTitle,
            targetDate: new Date(dateString).toISOString(),
            color: 'amber',
            category: newCategory
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
            const dateMatch = /^(\d{1,2})\/(\d{1,2})/.exec(line);
            if (!dateMatch) return;

            const month = dateMatch[1].padStart(2, '0');
            const day = dateMatch[2].padStart(2, '0');

            // Try to extract title: everything after the last hyphen
            const parts = line.split('-');
            const title = parts.length > 1 ? parts[parts.length - 1].trim() : line.trim();

            // Try to extract hour (first digit block after the first hyphen)
            let hourStr = '00';
            const hourMatch = /-\s*(\d{1,2})/.exec(line);
            if (hourMatch) {
                let hour = Number.parseInt(hourMatch[1], 10);
                if (hour >= 1 && hour <= 6) {
                    hour += 12; // Assume 1-6 is PM for classes/exams
                }
                hourStr = hour.toString().padStart(2, '0');
            }

            const dateString = `${year}-${month}-${day}T${hourStr}:00:00`;
            let d = new Date(dateString);

            // Handle edge case where month passed (say we are in Dec 2026, and date is for Jan 2027)
            if (d.getTime() < Date.now() - 60 * 24 * 60 * 60 * 1000) {
                d.setFullYear(year + 1);
            }

            addMilestone({
                title: title,
                targetDate: d.toISOString(),
                color: 'amber',
                category: bulkCategory,
            });
        });

        setBulkText('');
        setIsBulkOpen(false);
    };

    const filteredMilestones = milestones.filter(m => {
        if (filterCategory === 'All') return true;
        const cat = m.category || 'Other';
        return cat === filterCategory;
    });

    const sortedMilestones = [...filteredMilestones].sort((a, b) =>
        parseISO(a.targetDate).getTime() - parseISO(b.targetDate).getTime()
    );

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
                                <div className="space-y-2">
                                    <Label htmlFor="bulk-category">Assign to Category</Label>
                                    <Select value={bulkCategory} onValueChange={setBulkCategory}>
                                        <SelectTrigger id="bulk-category">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map(cat => (
                                                <SelectItem key={cat} value={cat}>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[cat]}`}></span>
                                                        {cat}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
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
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select value={newCategory} onValueChange={setNewCategory}>
                                        <SelectTrigger id="category">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map(cat => (
                                                <SelectItem key={cat} value={cat}>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[cat]}`}></span>
                                                        {cat}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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

            {milestones.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 py-2">
                    <button
                        onClick={() => setFilterCategory('All')}
                        className={`text-xs px-3 py-1.5 rounded-full transition-colors font-medium border ${filterCategory === 'All'
                            ? 'bg-white text-black border-white'
                            : 'bg-white/5 text-muted-foreground border-white/5 hover:bg-white/10'
                            }`}
                    >
                        All
                    </button>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilterCategory(cat)}
                            className={`text-xs px-3 py-1.5 rounded-full transition-colors font-medium border flex items-center gap-1.5 ${filterCategory === cat
                                ? `bg-white/10 ${CATEGORY_TEXT_COLORS[cat]} border-white/20`
                                : 'bg-white/5 text-muted-foreground border-white/5 hover:bg-white/10'
                                }`}
                        >
                            <span className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[cat]}`}></span>
                            {cat}
                        </button>
                    ))}
                </div>
            )}

            {milestones.length === 0 ? (
                <div className="glass rounded-xl p-8 text-center border-dashed border-2 border-border/50 bg-card/30">
                    <CalendarIcon className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                        No milestones yet. Set a target date to track!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {sortedMilestones.map((milestone) => (
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
