import { useState } from 'react';

function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void, string | null] {
  const [storageError, setStorageError] = useState<string | null>(null);

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      setStorageError(null);
    } catch {
      setStorageError('שגיאה בשמירת הנתונים. ייתכן שהאחסון המקומי מלא.');
    }
  };

  return [storedValue, setValue, storageError];
}

export default useLocalStorage;
