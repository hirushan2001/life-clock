import { useState, useEffect } from 'react';

export interface BucketListItem {
    id: string;
    title: string;
    imageUrl?: string;
    createdAt: string; // ISO Date string
    completedAt?: string; // ISO Date string
    status: 'pending' | 'achieved';
}

const STORAGE_KEY = 'life-clock-bucket-list';

export const useBucketList = () => {
    const [items, setItems] = useState<BucketListItem[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Failed to parse bucket list items:', error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addItem = (item: Omit<BucketListItem, 'id' | 'createdAt' | 'status'>) => {
        const newItem: BucketListItem = {
            ...item,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            status: 'pending',
        };
        setItems((prev) => [...prev, newItem]);
    };

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const toggleStatus = (id: string) => {
        setItems((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const isNowAchieved = item.status === 'pending';
                    return {
                        ...item,
                        status: isNowAchieved ? 'achieved' : 'pending',
                        completedAt: isNowAchieved ? new Date().toISOString() : undefined,
                    };
                }
                return item;
            })
        );
    };

    const updateItemImage = (id: string, imageUrl: string) => {
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, imageUrl } : item))
        );
    };

    return { items, addItem, removeItem, toggleStatus, updateItemImage };
};
