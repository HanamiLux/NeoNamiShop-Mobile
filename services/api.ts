import axios from 'axios';
import Constants from 'expo-constants';

const api = axios.create({
    baseURL: Constants.expoConfig?.extra?.REACT_APP_API_URL,
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
                // Заменяем любой локальный хост (с любым портом) на целевой URL
                if (!url) return url;
                const serverUrl = Constants.expoConfig?.extra?.REACT_APP_SERVER_URL;
                return serverUrl
                    ? url.replace(/http:\/\/localhost:\d+/, serverUrl)
                    : url;
            }) || []
        }));
    }
    return response;
});

export default api;