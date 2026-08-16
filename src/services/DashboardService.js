import axiosInstance from '../utils/RequestHelper';

export const getDashboardStats = async () => {
    try {
        const response = await axiosInstance.get('/api/Dashboard/stats');
        if (!response.data.success) throw new Error(response.data.message || 'Failed to fetch dashboard stats');
        return response.data.data;
    } catch (error) {
        console.error('DashboardService.getDashboardStats:', error);
        throw error;
    }
};
