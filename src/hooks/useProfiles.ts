import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface Profile {
  id: string;
  name: string;
  dateOfBirth: string; // ISO date string
  targetAge: number;
  createdAt: string;
}

export interface DailyGoal {
  id: string; // Added ID
  profileId: string;
  date: string; // YYYY-MM-DD format
  createdAt?: string; // ISO string
  goal: string;
  completed: boolean;
}

interface ProfilesState {
  profiles: Profile[];
  activeProfileId: string | null;
  goals: DailyGoal[];
}

const initialState: ProfilesState = {
  profiles: [],
  activeProfileId: null,
  goals: [],
};

export function useProfiles() {
  const [state, setState] = useLocalStorage<ProfilesState>('memento-profiles', initialState);

  // Get active profile
  const activeProfile = useMemo(() => {
    return state.profiles.find((p) => p.id === state.activeProfileId) || null;
  }, [state.profiles, state.activeProfileId]);

  // Check if any profile exists
  const hasProfiles = state.profiles.length > 0;

  // Add a new profile
  const addProfile = useCallback((profile: Omit<Profile, 'id' | 'createdAt'>) => {
    const newProfile: Profile = {
      ...profile,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      profiles: [...prev.profiles, newProfile],
      activeProfileId: prev.activeProfileId || newProfile.id,
    }));

    return newProfile;
  }, [setState]);

  // Update a profile
  const updateProfile = useCallback((id: string, updates: Partial<Omit<Profile, 'id' | 'createdAt'>>) => {
    setState((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    }));
  }, [setState]);

  // Delete a profile
  const deleteProfile = useCallback((id: string) => {
    setState((prev) => {
      const newProfiles = prev.profiles.filter((p) => p.id !== id);
      const newActiveId = prev.activeProfileId === id
        ? newProfiles[0]?.id || null
        : prev.activeProfileId;

      return {
        ...prev,
        profiles: newProfiles,
        activeProfileId: newActiveId,
        goals: prev.goals.filter((g) => g.profileId !== id),
      };
    });
  }, [setState]);

  // Set active profile
  const setActiveProfile = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      activeProfileId: id,
    }));
  }, [setState]);

  // Get today's date in YYYY-MM-DD format
  const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Get today's goals for active profile
  const todayGoals = useMemo(() => {
    if (!state.activeProfileId) return [];
    const today = getTodayString();
    return state.goals.filter(
      (g) => g.profileId === state.activeProfileId && g.date === today
    );
  }, [state.goals, state.activeProfileId]);

  // Add a new goal
  const addGoal = useCallback((goalText: string) => {
    if (!state.activeProfileId) return;
    const today = getTodayString();

    const newGoal: DailyGoal = {
      id: crypto.randomUUID(),
      profileId: state.activeProfileId,
      date: today,
      createdAt: new Date().toISOString(),
      goal: goalText,
      completed: false,
    };

    setState((prev) => ({
      ...prev,
      goals: [...prev.goals, newGoal],
    }));
  }, [setState, state.activeProfileId]);

  // Update a goal text
  const updateGoal = useCallback((id: string, newText: string) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === id ? { ...g, goal: newText } : g
      ),
    }));
  }, [setState]);

  // Toggle goal completion
  const toggleGoal = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === id ? { ...g, completed: !g.completed } : g
      ),
    }));
  }, [setState]);

  // Delete a goal
  const deleteGoal = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== id),
    }));
  }, [setState]);

  return {
    profiles: state.profiles,
    activeProfile,
    activeProfileId: state.activeProfileId,
    hasProfiles,
    addProfile,
    updateProfile,
    deleteProfile,
    setActiveProfile,
    todayGoals,
    addGoal,
    updateGoal,
    toggleGoal,
    deleteGoal,
  };
}
