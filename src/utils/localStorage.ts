// localStorageUtility.ts

/**
 * Set data in localStorage
 * @param {string} key - The key under which data will be stored.
 * @param {any} value - The value to store (will be stringified).
 */
export const setLocalStorageItem = (key: string, value: any): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error setting localStorage item "${key}":`, error);
  
}
};


/**
 * Get data from localStorage
 * @param {string} key - The key of the data to retrieve.
 * @returns {any | null} - The parsed data or null if not found.
 */
export const getLocalStorageItem = (key: string): any | null => {
  if (typeof window === "undefined") {
    return null; // Return null during server-side rendering
  }
  try {
    const serializedValue = localStorage.getItem(key);
    if (!serializedValue) {
      return null;
    }
    return JSON.parse(serializedValue);
  } catch (error) {
    console.error(`Error getting localStorage item "${key}":`, error);
    return null;
  }
};




/**
 * Remove an item from localStorage
 * @param {string} key - The key of the data to remove.
 */
export const removeLocalStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing localStorage item:", error);
  }
};

/**
 * Clear all data from localStorage (useful for logout)
 */
export const clearLocalStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
};
