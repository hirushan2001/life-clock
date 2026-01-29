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
  profileId: string;
  date: string; // YYYY-MM-DD format
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

  // Get today's goal for active profile
  const todayGoal = useMemo(() => {
    if (!state.activeProfileId) return null;
    const today = getTodayString();
    return state.goals.find(
      (g) => g.profileId === state.activeProfileId && g.date === today
    ) || null;
  }, [state.goals, state.activeProfileId]);

  // Set today's goal for active profile
  const setTodayGoal = useCallback((goalText: string) => {
    if (!state.activeProfileId) return;
    
    const today = getTodayString();
    
    setState((prev) => {
      const existingGoalIndex = prev.goals.findIndex(
        (g) => g.profileId === state.activeProfileId && g.date === today
      );

      const newGoal: DailyGoal = {
        profileId: state.activeProfileId!,
        date: today,
        goal: goalText,
        completed: false,
      };

      if (existingGoalIndex >= 0) {
        const newGoals = [...prev.goals];
        newGoals[existingGoalIndex] = { ...newGoals[existingGoalIndex], goal: goalText };
        return { ...prev, goals: newGoals };
      }

      return { ...prev, goals: [...prev.goals, newGoal] };
    });
  }, [setState, state.activeProfileId]);

  // Toggle goal completion
  const toggleGoalComplete = useCallback(() => {
    if (!state.activeProfileId) return;
    
    const today = getTodayString();
    
    setState((prev) => {
      const newGoals = prev.goals.map((g) =>
        g.profileId === state.activeProfileId && g.date === today
          ? { ...g, completed: !g.completed }
          : g
      );
      return { ...prev, goals: newGoals };
    });
  }, [setState, state.activeProfileId]);

  return {
    profiles: state.profiles,
    activeProfile,
    activeProfileId: state.activeProfileId,
    hasProfiles,
    addProfile,
    updateProfile,
    deleteProfile,
    setActiveProfile,
    todayGoal,
    setTodayGoal,
    toggleGoalComplete,
  };
}
