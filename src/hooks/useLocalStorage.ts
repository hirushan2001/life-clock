import { useState, useEffect, useCallback } from 'react';

// Custom event name for same-tab synchronization
const LOCAL_STORAGE_CHANGE_EVENT = 'local-storage-change';

interface LocalStorageChangeEvent extends CustomEvent {
  detail: {
    key: string;
    newValue: string;
  };
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Get from localStorage or use initial value
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        
        // Dispatch custom event for same-tab synchronization
        window.dispatchEvent(
          new CustomEvent(LOCAL_STORAGE_CHANGE_EVENT, {
            detail: { key, newValue: JSON.stringify(valueToStore) },
          })
        );
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Listen for changes in other tabs/windows AND same-tab changes
  useEffect(() => {
    // Handle cross-tab storage events
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch {
          console.warn(`Error parsing localStorage change for key "${key}"`);
        }
      }
    };

    // Handle same-tab custom events
    const handleLocalChange = (e: Event) => {
      const customEvent = e as LocalStorageChangeEvent;
      if (customEvent.detail.key === key) {
        try {
          setStoredValue(JSON.parse(customEvent.detail.newValue));
        } catch {
          console.warn(`Error parsing local storage change for key "${key}"`);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(LOCAL_STORAGE_CHANGE_EVENT, handleLocalChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(LOCAL_STORAGE_CHANGE_EVENT, handleLocalChange);
    };
  }, [key]);

  return [storedValue, setValue];
}
