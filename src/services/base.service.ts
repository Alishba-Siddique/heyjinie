// src/services/base.service.ts

import axiosInstance from '@/services/axiosInstance'; // Import the Axios instance

interface AxiosRequestOptions {
    headers?: {
        [key: string]: string;
    };
}

export class HttpService {
    
    public get = async (url: string, params?: any): Promise<any> => {
        const response = await axiosInstance.get(url, {
            params,
        });
        return response;
    };

    public post = async (url: string, body: any, options: AxiosRequestOptions = {}): Promise<any> => {
        const response = await axiosInstance.post(url, body, {
            headers: {
                'Content-Type': 'application/json', // Set Content-Type for POST requests
                ...options.headers, // Merge with any additional headers passed in options
            },
            ...options,
        });
        return response;
    };

    public put = async (url: string, body: any, options: AxiosRequestOptions = {}): Promise<any> => {
        const response = await axiosInstance.put(url, body, {
            headers: {
                'Content-Type': 'application/json', // Set Content-Type for PUT requests
                ...options.headers, // Merge with any additional headers passed in options
            },
            ...options,
        });
        return response;
    };
    
    public delete = async (url: string, params?: any, options: AxiosRequestOptions = {}): Promise<any> => {
        const response = await axiosInstance.delete(url, {
            params,
            headers: {
                'Content-Type': 'application/json', // Set Content-Type for DELETE requests if needed
                ...options.headers, // Merge with any additional headers passed in options
            },
        });
        return response;
    };

}