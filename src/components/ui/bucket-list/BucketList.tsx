import { useState, useMemo } from 'react';
import { Plus, Target, MountainSnow, Search, Sparkles } from 'lucide-react';
import { useBucketList } from '@/hooks/useBucketList';
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
import { BucketListCard } from './BucketListCard';

type TabType = 'pending' | 'achieved';

export const BucketList = () => {
    const { items, addItem, removeItem, toggleStatus } = useBucketList();
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('pending');

    // Form state
    const [newTitle, setNewTitle] = useState('');
    const [newImageUrl, setNewImageUrl] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const pendingItems = useMemo(() => items.filter(item => item.status === 'pending'), [items]);
    const achievedItems = useMemo(() => items.filter(item => item.status === 'achieved'), [items]);

    const displayedItems = useMemo(() => {
        const sourceList = activeTab === 'pending' ? pendingItems : achievedItems;
        if (!searchQuery.trim()) return sourceList;
        const lowerQuery = searchQuery.toLowerCase();
        return sourceList.filter(item => item.title.toLowerCase().includes(lowerQuery));
    }, [activeTab, pendingItems, achievedItems, searchQuery]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        addItem({
            title: newTitle.trim(),
            imageUrl: newImageUrl.trim() || undefined,
        });

        setNewTitle('');
        setNewImageUrl('');
        setIsOpen(false);
        setActiveTab('pending'); // switch to pending to see new item
    };

    const emptyStateContent = activeTab === 'pending' ? (
        <div className="glass rounded-xl p-12 text-center border-dashed border-2 border-border/50 bg-card/30 flex flex-col items-center justify-center min-h-[300px]">
            <MountainSnow className="w-12 h-12 text-indigo-400/50 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-foreground mb-1">Dream Bigger</h4>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                Your bucket list is empty. Add life goals, crazy adventures, and big aspirations here.
            </p>
            <Button onClick={() => setIsOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                <Plus className="w-4 h-4" /> Add Your First Goal
            </Button>
        </div>
    ) : (
        <div className="glass rounded-xl p-12 text-center border-dashed border-2 border-border/50 bg-emerald-950/10 flex flex-col items-center justify-center min-h-[300px]">
            <Sparkles className="w-12 h-12 text-emerald-500/50 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-emerald-400 mb-1">Nothing Here Yet</h4>
            <p className="text-sm text-emerald-500/60 max-w-sm mx-auto">
                Check off your aspirations as you experience them in life to build your achieved gallery.
            </p>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-lg font-semibold text-foreground">Bucket List</h3>
                    <div className="flex bg-black/40 rounded-full p-1 border border-white/5 ml-4">
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${activeTab === 'pending'
                                    ? 'bg-indigo-500/20 text-indigo-300'
                                    : 'text-muted-foreground hover:text-white'
                                }`}
                        >
                            Aspirations ({pendingItems.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('achieved')}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${activeTab === 'achieved'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'text-muted-foreground hover:text-white'
                                }`}
                        >
                            Achieved ({achievedItems.length})
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-grow sm:flex-grow-0">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Find a goal..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-9 w-full sm:w-[200px] bg-black/20 border-white/10 text-sm focus-visible:ring-indigo-500/50"
                        />
                    </div>

                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="gap-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-lg shadow-indigo-900/20">
                                <Plus className="w-3.5 h-3.5" />
                                Add Goal
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add to Bucket List</DialogTitle>
                                <DialogDescription>
                                    Add a new life goal or aspiration to your vision board.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Aspiration</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g. See the Northern Lights"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        maxLength={100}
                                        autoFocus
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="image">Cover Image URL (Optional)</Label>
                                    <Input
                                        id="image"
                                        placeholder="https://images.unsplash.com/..."
                                        value={newImageUrl}
                                        onChange={(e) => setNewImageUrl(e.target.value)}
                                    />
                                    {newImageUrl && (
                                        <div className="mt-4 rounded-xl overflow-hidden h-32 w-full relative bg-muted/20 border border-white/10">
                                            <img src={newImageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2NjYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiByeT0iMiIvPjxjaXJjbGUgY3g9IjkiIGN5PSI5IiByPSIyIi8+PHBhdGggZD0ibTIxIDE1LTMuMDgtMy4wOGExLjIgMS4yIDAgMCAwLTEuNzEgMGwtOS4yNiA5LjI2Ii8+PC9zdmc+'
                                            }} />
                                        </div>
                                    )}
                                </div>
                                <DialogFooter className="pt-4">
                                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={!newTitle.trim()} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                        Save Goal
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Content Grid */}
            {items.length === 0 || displayedItems.length === 0 ? (
                emptyStateContent
            ) : (
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                    {displayedItems.map((item) => (
                        <div key={item.id} className="break-inside-avoid">
                            <BucketListCard
                                item={item}
                                onToggle={toggleStatus}
                                onDelete={removeItem}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
