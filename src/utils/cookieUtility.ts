// src/utils/cookieUtility.ts

import Cookies from 'js-cookie';

/**
 * Set a cookie with a specified key, value, and options.
 * @param key - The name of the cookie.
 * @param value - The value of the cookie.
 * @param options - Additional options for the cookie (e.g., expires, path).
 */
export const setCookie = (key: string, value: string, options?: Cookies.CookieAttributes) => {
  Cookies.set(key, value, { ...options, sameSite: 'lax' }); // Adjust sameSite as needed
};

/**
 * Get the value of a cookie by its key.
 * @param key - The name of the cookie.
 * @returns The value of the cookie or undefined if not found.
 */
// export const getCookie = (key: string): string | undefined => {
//   return Cookies.get(key);
// };
export const getCookie = (key: string): string | null => {
  const cookieValue = Cookies.get(key);
  if (cookieValue === undefined) {
    // console.warn(`Cookie with key "${key}" not found.`);
    return null; // Return null instead of undefined for clarity
  }
  return cookieValue; // Return the cookie value
};


/**
 * Remove a cookie by its key.
 * @param key - The name of the cookie.
 */
export const removeCookie = (key: string) => {
  Cookies.remove(key);
};

/**
 * Check if a cookie exists.
 * @param key - The name of the cookie.
 * @returns True if the cookie exists, otherwise false.
 */
export const cookieExists = (key: string): boolean => {
  return !!getCookie(key);
};

/**
//  * Set a cookie to expire after a specified number of days.
//  * @param key - The name of the cookie.
//  * @param value - The value of the cookie.
//  * @param days - The number of days until the cookie expires.
 */
// export const setCookieWithExpiration = (key: string, value: string, days: number) => {
//   const expires = days * 24 * 60 * 60 * 1000; // Convert days to milliseconds
//   const options = { expires: expires };
//   setCookie(key, value, options);
// };
