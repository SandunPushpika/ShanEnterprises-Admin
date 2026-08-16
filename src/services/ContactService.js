import axiosInstance from '../utils/RequestHelper';

const contactEndpoint = '/api/Contact';

export const getAllContactRequests = async ({ status = null, search = null, pageNumber = 1, pageSize = 10 } = {}) => {
    try {
        const response = await axiosInstance.post(`${contactEndpoint}/all`, { status, search, pageNumber, pageSize });
        if (!response.data.success) throw new Error(response.data.message || 'Failed to fetch contact requests');
        return response.data.data;
    } catch (error) {
        console.error('ContactService.getAllContactRequests:', error);
        throw error;
    }
};

export const getContactRequestById = async (id) => {
    try {
        const response = await axiosInstance.get(`${contactEndpoint}/${id}`);
        if (!response.data.success) throw new Error(response.data.message);
        return response.data.data;
    } catch (error) {
        console.error('ContactService.getContactRequestById:', error);
        throw error;
    }
};

export const updateContactStatus = async (id, status, adminNotes = null) => {
    try {
        const response = await axiosInstance.put(`${contactEndpoint}/${id}/status`, { status, adminNotes });
        if (!response.data.success) throw new Error(response.data.message);
        return { success: true, message: response.data.message };
    } catch (error) {
        console.error('ContactService.updateContactStatus:', error);
        const message = error?.response?.data?.message || error?.message || 'Failed to update status';
        return { success: false, message };
    }
};
