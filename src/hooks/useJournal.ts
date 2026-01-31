import { useState, useEffect } from 'react';

export interface JournalEntry {
    id: string;
    date: string; // ISO String
    quoteText: string;
    quoteAuthor: string;
    reflection: string;
}

const STORAGE_KEY = 'life-clock-journal';

export const useJournal = () => {
    const [entries, setEntries] = useState<JournalEntry[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Failed to parse journal entries:', error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }, [entries]);

    const addEntry = (quoteText: string, quoteAuthor: string, reflection: string) => {
        const today = new Date().toISOString().split('T')[0];

        // Check if entry already exists for today (optional, but good for "Daily" log)
        // For now we allow multiple, but usually daily reflection is once. 
        // Let's just append.

        const newEntry: JournalEntry = {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            quoteText,
            quoteAuthor,
            reflection,
        };

        setEntries((prev) => [newEntry, ...prev]);
    };

    const deleteEntry = (id: string) => {
        setEntries(prev => prev.filter(e => e.id !== id));
    }

    return { entries, addEntry, deleteEntry };
};
