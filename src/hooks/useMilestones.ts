import { useState, useEffect } from 'react';

export interface Milestone {
    id: string;
    title: string;
    targetDate: string; // ISO Date string
    createdAt: string; // ISO Date string
    icon?: string;
    color?: string;
}

const STORAGE_KEY = 'life-clock-milestones';

export const useMilestones = () => {
    const [milestones, setMilestones] = useState<Milestone[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Failed to parse milestones:', error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(milestones));
    }, [milestones]);

    const addMilestone = (milestone: Omit<Milestone, 'id' | 'createdAt'>) => {
        const newMilestone: Milestone = {
            ...milestone,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };
        setMilestones((prev) => [...prev, newMilestone]);
    };

    const removeMilestone = (id: string) => {
        setMilestones((prev) => prev.filter((m) => m.id !== id));
    };

    const updateMilestone = (id: string, updates: Partial<Milestone>) => {
        setMilestones(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    };

    return { milestones, addMilestone, removeMilestone, updateMilestone };
};
