import { CheckCircle2, Circle, Trash2, CalendarIcon, Image as ImageIcon } from 'lucide-react';
import { BucketListItem } from '@/hooks/useBucketList';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
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
import { useState } from 'react';

interface BucketListCardProps {
    item: BucketListItem;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

export const BucketListCard = ({ item, onToggle, onDelete }: BucketListCardProps) => {
    const isAchieved = item.status === 'achieved';
    const [imageError, setImageError] = useState(false);

    return (
        <div className={`relative group flex flex-col rounded-xl overflow-hidden transition-all duration-300 border ${isAchieved ? 'border-emerald-500/20 bg-[#161b22] opacity-80' : 'border-white/5 bg-[#11141c] hover:bg-[#1a1f2e]'} w-full transform origin-center`}>
            {/* Delete Button - Only visible on hover */}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <button
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-destructive/80 text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-all z-20 backdrop-blur-sm"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Aspiration?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently remove "{item.title}" from your Bucket List.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(item.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Image Section */}
            {item.imageUrl && !imageError ? (
                <div className="w-full relative pt-[56.25%] overflow-hidden bg-muted/20">
                    <img
                        src={item.imageUrl}
                        alt={item.title}
                        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isAchieved ? 'grayscale opacity-70' : ''}`}
                        onError={() => setImageError(true)}
                    />
                    {isAchieved && (
                        <div className="absolute inset-0 bg-emerald-950/40 flex items-center justify-center backdrop-blur-[1px]">
                            <div className="bg-emerald-500/90 text-white px-4 py-1.5 rounded-full font-bold tracking-wider text-sm flex items-center gap-2 shadow-lg">
                                <CheckCircle2 className="w-4 h-4" />
                                ACHIEVED
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className={`w-full h-32 flex flex-col items-center justify-center bg-gradient-to-br ${isAchieved ? 'from-emerald-950/40 to-emerald-900/20' : 'from-indigo-950/30 to-purple-950/20'}`}>
                    {isAchieved ? (
                        <div className="bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full font-bold tracking-wider text-sm flex items-center gap-2 border border-emerald-500/20">
                            <CheckCircle2 className="w-4 h-4" />
                            ACHIEVED
                        </div>
                    ) : (
                        <ImageIcon className="w-8 h-8 text-white/10" />
                    )}
                </div>
            )}

            {/* Content Section */}
            <div className="p-4 flex flex-col gap-3 flex-grow">
                <h4 className={`font-semibold text-base leading-tight ${isAchieved ? 'text-white/70 line-through decoration-emerald-500/50' : 'text-white'}`}>
                    {item.title}
                </h4>

                <div className="flex items-end justify-between mt-auto pt-2">
                    <div className="flex flex-col gap-1">
                        {item.completedAt && (
                            <div className="flex items-center gap-1.5 text-xs text-emerald-500/80 font-medium">
                                <CalendarIcon className="w-3.5 h-3.5" />
                                {format(parseISO(item.completedAt), 'MMM d, yyyy')}
                            </div>
                        )}
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            Added {format(parseISO(item.createdAt), 'MMM yyyy')}
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        className={`rounded-full h-8 px-3 text-xs font-medium cursor-pointer transition-colors ${isAchieved
                                ? 'hover:bg-rose-500/10 hover:text-rose-400 text-emerald-500'
                                : 'hover:bg-emerald-500/10 hover:text-emerald-400 text-white/50'
                            }`}
                        onClick={() => onToggle(item.id)}
                    >
                        {isAchieved ? (
                            <>
                                <CheckCircle2 className="w-4 h-4 mr-1.5 fill-emerald-500/20" /> Undo
                            </>
                        ) : (
                            <>
                                <Circle className="w-4 h-4 mr-1.5" /> Complete
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Progress Accent Line */}
            <div className={`absolute bottom-0 left-0 h-1 w-full ${isAchieved ? 'bg-emerald-500/50' : 'bg-gradient-to-r from-indigo-500/50 to-purple-500/50 opacity-0 group-hover:opacity-100 transition-opacity'}`} />
        </div>
    );
};
