import axiosInstance from "../utils/RequestHelper";

const userEndpoint = "/api/User";

const STATUS_ENUM_MAP = {
    ACTIVE: 0,
    INACTIVE: 1,
    SUSPENDED: 2,
};

export const searchCustomers = async ({
    status = null,
    searchTerm = "",
    pageNumber = 1,
    pageSize = 8,
} = {}) => {
    try {
        const payloadStatus =
            status && status !== "ALL"
                ? STATUS_ENUM_MAP[status] ?? status
                : null;

        const response = await axiosInstance.post(
            `${userEndpoint}/customers/search`,
            {
                status: payloadStatus,
                searchTerm: searchTerm?.trim() || null,
                pageNumber,
                pageSize,
            }
        );

        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to fetch customers");
        }

        return response.data.data;
    } catch (error) {
        console.error("CustomerService.searchCustomers:", error);
        throw error;
    }
};

export const getCustomerStats = async () => {
    try {
        const response = await axiosInstance.get(`${userEndpoint}/customers/stats`);

        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to fetch customer stats");
        }

        return response.data.data;
    } catch (error) {
        console.error("CustomerService.getCustomerStats:", error);
        throw error;
    }
};


export const updateCustomerStatus = async (userId, status) => {
    try {
        const payloadStatus = STATUS_ENUM_MAP[status] ?? status;
        const response = await axiosInstance.put(
            `${userEndpoint}/${userId}/status`,
            {
                status: payloadStatus,
            }
        );

        if (!response.data.success) {
            throw new Error(
                response.data.message || "Failed to update customer status"
            );
        }

        return response.data.data;
    } catch (error) {
        console.error("CustomerService.updateCustomerStatus:", error);
        throw error;
    }
};
