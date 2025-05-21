// src/utils/sessionUtility.ts
import { getCookie, setCookie, removeCookie } from './cookieUtility';

export const setSession = (token: string, userData: any) => {
  return new Promise((resolve) => {

    setCookie('authToken', token);
    setCookie('userData', JSON.stringify(userData));

    resolve(true);
  });
};

export const clearSession = () => {
  removeCookie('authToken');
  removeCookie('userData');
};

export const isSessionValid = (): boolean => {

  const token = getCookie('authToken');
  const userData = getCookie('userData');

  if (!token || !userData) {
    return false;
  }

  const currentTime = new Date();
  return true;
};

export const getSessionUser = (): any => {
  const userData = getCookie('userData');
  if (!userData) {
    return null; // Return null if userData is not found
  }
  try {
    return JSON.parse(userData);
  } catch (error) {
    return null; // Return null if parsing fails
  }
};