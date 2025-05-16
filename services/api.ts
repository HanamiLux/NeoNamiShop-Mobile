import axios from 'axios';
import Constants from 'expo-constants';

const api = axios.create({
    baseURL: Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL || 'http://213.171.25.9:3003/api/v1',
    timeout: 10000,
});

api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(response => {
    if (response.data?.items) {
        response.data.items = response.data.items.map((product: any) => ({
            ...product,
            imagesUrl: product.imagesUrl?.map((url: string) => {
                if (!url) return url;
                const serverUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_SERVER_URL || 'http://213.171.25.9:3003';
                return serverUrl
                    ? url.replace(/^http:\/\/[^/]+/, serverUrl)
                    : url;
            }) || []
        }));
    }
    return response;
});

export default api;