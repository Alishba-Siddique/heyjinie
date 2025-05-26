// src/services/axiosInstance.ts
import axios from 'axios';
import { getCookie, removeCookie } from '../utils/cookieUtility';
import { clearSession } from '@/utils/sessionUtility';

let isRedirecting = false;

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}`,

});

const handleUnauthorized = () => {
  if (typeof window !== 'undefined' && !isRedirecting) {
    isRedirecting = true;

    removeCookie('authToken');
    removeCookie('userData');
    clearSession();

    // Set flag in sessionStorage
    sessionStorage.setItem('showUnauthorized', 'true');
    // window.location.href = '/auth';
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    const apiKey = getCookie('authToken'); // Retrieve the API key from cookies
    // Check if the request URL is for the envelope list or place envelope order
    const isEnvelopeListRequest = config.url?.includes('customer/envelope-list');
    const isPlaceEnvelopeOrderRequest = config.url?.includes('customer/place-envelope-order');

    // Add the API key to the headers only if it is not an envelope list or place envelope order request
    if (!isEnvelopeListRequest && !isPlaceEnvelopeOrderRequest && apiKey) {
      config.headers['x-api-key'] = apiKey; // Add the API key to the headers
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: any) => {
    console.error('API Errors:', error);

    if (error.response?.status === 401 && !isRedirecting) {
      handleUnauthorized();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;