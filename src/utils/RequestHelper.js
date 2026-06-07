import axios from "axios";
import { getStoredToken, storeToken } from "./TokenHelper";

const baseUrl = process.env.REACT_APP_API_URL;

console.log("API URL:", baseUrl);

const axiosInstance = axios.create({
    baseURL: baseUrl
});

axiosInstance.interceptors.request.use((req) => {

    const tokens = getStoredToken();
    if (tokens) {
        req.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }

    return req;
}, (err) => Promise.reject(err));

axiosInstance.interceptors.response.use((resp) => resp, async (error) => {

    const originalRequestConfig = error.config;

    if (error.request.status === 401 && !originalRequestConfig._retry) {

        originalRequestConfig._retry = true;
        const tokens = getStoredToken();

        if (tokens) {
            try {
                const response = await axios.post(baseUrl + "/api/Auth/refresh-token", {
                    refreshToken: tokens.refreshToken
                });

                if (response.status === 200 && response.data.accessToken && response.data.refreshToken) {
                    storeToken(response.data.accessToken, response.data.refreshToken);

                    originalRequestConfig.headers.Authorization = `Bearer ${response.data.accessToken}`;

                    return axiosInstance(originalRequestConfig);
                }

            } catch (err) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
    return Promise.reject(error);
});

export default axiosInstance;