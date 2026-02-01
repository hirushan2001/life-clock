import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, PenLine, History, X } from 'lucide-react';
import { useJournal } from '@/hooks/useJournal';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';


const FALLBACK_QUOTE = { text: "The trouble is, you think you have time.", author: "Jack Kornfield" };

export const QuoteJournal = () => {
    const { entries, addEntry, deleteEntry } = useJournal();
    const [isWriting, setIsWriting] = useState(false);
    const [reflection, setReflection] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [quote, setQuote] = useState<{ text: string; author: string }>(FALLBACK_QUOTE);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch Daily Quote
    useEffect(() => {
        const fetchQuote = async () => {
            const today = new Date().toDateString();
            const STORAGE_KEY = 'daily_quote_cache';

            try {
                const cached = localStorage.getItem(STORAGE_KEY);
                if (cached) {
                    const { date, quote: cachedQuote } = JSON.parse(cached);
                    if (date === today) {
                        setQuote(cachedQuote);
                        setIsLoading(false);
                        return;
                    }
                }

                const response = await fetch('https://dummyjson.com/quotes/random');
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                const newQuote = { text: data.quote, author: data.author };

                setQuote(newQuote);
                localStorage.setItem(STORAGE_KEY, JSON.stringify({
                    date: today,
                    quote: newQuote
                }));
            } catch (error) {
                console.error('Error fetching quote:', error);
                // Keep fallback quote
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuote();
    }, []);

    const dailyQuote = quote;

    const handleSave = () => {
        if (!reflection.trim()) return;
        addEntry(dailyQuote.text, dailyQuote.author, reflection);
        setReflection('');
        setIsWriting(false);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-xl p-6 text-center mt-6"
        >
            {isLoading ? (
                <div className="py-4 space-y-2 animate-pulse">
                    <div className="h-4 bg-muted/50 rounded w-3/4 mx-auto"></div>
                    <div className="h-3 bg-muted/30 rounded w-1/4 mx-auto"></div>
                </div>
            ) : (
                <>
                    <p className="text-muted-foreground italic">
                        "{dailyQuote.text}"
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-2">
                        — {dailyQuote.author}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-3 justify-center w-full">
                        {!isWriting && !isSaved && (
                            <Button
                                variant="outline"
                                onClick={() => setIsWriting(true)}
                                className="gap-2 transition-all hover:border-primary/50"
                            >
                                <PenLine className="w-4 h-4" />
                                Log My Thought
                            </Button>
                        )}

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                                    <History className="w-4 h-4" />
                                    Legacy Log
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md max-h-[80vh]">
                                <DialogHeader>
                                    <DialogTitle>Your Legacy Log</DialogTitle>
                                </DialogHeader>
                                <ScrollArea className="h-[60vh] pr-4 mt-2">
                                    {entries.length === 0 ? (
                                        <p className="text-center text-muted-foreground py-10">No thoughts recorded yet.</p>
                                    ) : (
                                        <div className="space-y-6">
                                            {entries.map((entry) => (
                                                <div key={entry.id} className="relative pl-4 border-l-2 border-border/50 pb-2">
                                                    <p className="text-xs text-muted-foreground mb-1">
                                                        {new Date(entry.date).toLocaleDateString(undefined, {
                                                            weekday: 'short',
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                    <div className="bg-secondary/20 p-3 rounded-lg text-sm mb-2">
                                                        <p className="italic text-muted-foreground/80 text-xs mb-2">"{entry.quoteText}"</p>
                                                        <p className="text-foreground whitespace-pre-wrap">{entry.reflection}</p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 absolute right-0 top-0 opacity-0 hover:opacity-100 transition-opacity"
                                                        onClick={() => deleteEntry(entry.id)}
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </ScrollArea>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <AnimatePresence>
                        {isWriting && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="w-full max-w-lg overflow-hidden"
                            >
                                <div className="pt-4 space-y-3">
                                    <Textarea
                                        placeholder="How does this apply to your life today?"
                                        value={reflection}
                                        onChange={(e) => setReflection(e.target.value)}
                                        className="min-h-[100px] resize-none bg-background/50 focus:bg-background transition-colors"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => setIsWriting(false)}>Cancel</Button>
                                        <Button size="sm" onClick={handleSave} disabled={!reflection.trim()}>Save to Legacy</Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {isSaved && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-emerald-500 text-sm font-medium mt-2"
                            >
                                Saved to Legacy Log
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </motion.div>

    );
};

export default QuoteJournal;
