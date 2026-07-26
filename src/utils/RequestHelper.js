import axios from "axios";
import { getStoredToken, storeToken } from "./TokenHelper";

const baseUrl = process.env.REACT_APP_API_URL;

console.log("API URL:", baseUrl);

const axiosInstance = axios.create({
    baseURL: baseUrl
});

axiosInstance.interceptors.request.use((req) => {
    const tokens = getStoredToken();
    if (tokens?.accessToken) {
        req.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return req;
}, (err) => Promise.reject(err));

axiosInstance.interceptors.response.use(
    (resp) => resp,
    async (error) => {
        const originalRequestConfig = error.config;
        const statusCode = error.response ? error.response.status : error.request?.status;

        if (statusCode === 401 && !originalRequestConfig._retry) {
            originalRequestConfig._retry = true;
            const tokens = getStoredToken();

            if (tokens?.refreshToken) {
                try {
                    const response = await axios.get(`${baseUrl}/api/Auth/refresh-token`, {
                        headers: {
                            "refresh-token": tokens.refreshToken
                        }
                    });

                    const authData = response.data?.data || response.data;

                    if (response.status === 200 && authData?.accessToken && authData?.refreshToken) {
                        storeToken(authData.accessToken, authData.refreshToken);
                        originalRequestConfig.headers.Authorization = `Bearer ${authData.accessToken}`;
                        return axiosInstance(originalRequestConfig);
                    }
                } catch (err) {
                    console.error("Failed to refresh token:", err);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                    return Promise.reject(err);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;