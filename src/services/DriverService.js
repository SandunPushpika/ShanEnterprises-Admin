import axiosInstance from "../utils/RequestHelper";

const driverEndpoint = "/api/Driver";

/**
 * Search/list drivers by status with pagination.
 * @param {Object} params
 * @param {string|null} params.status  - "PENDING"|"APPROVED"|"REJECTED"|"DEACTIVATED"|null
 * @param {number}      params.pageNumber
 * @param {number}      params.pageSize
 */
export const searchDrivers = async ({ status = null, pageNumber = 1, pageSize = 20 } = {}) => {
    try {
        const response = await axiosInstance.post(`${driverEndpoint}/search`, {
            status: status ?? null,
            pageNumber,
            pageSize,
        });

        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to fetch drivers");
        }

        return response.data.data;
    } catch (error) {
        console.error("DriverService.searchDrivers:", error);
        throw error;
    }
};

/**
 * Get a single driver by ID (admin only).
 */
export const getDriverById = async (driverId) => {
    try {
        const response = await axiosInstance.get(`${driverEndpoint}/${driverId}`);

        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to fetch driver");
        }

        return response.data.data;
    } catch (error) {
        console.error("DriverService.getDriverById:", error);
        throw error;
    }
};

/**
 * Approve a pending driver.
 */
export const approveDriver = async (driverId) => {
    try {
        const response = await axiosInstance.put(`${driverEndpoint}/${driverId}/approve`);

        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to approve driver");
        }

        return { success: true, message: response.data.message };
    } catch (error) {
        console.error("DriverService.approveDriver:", error);
        const message =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to approve driver";
        return { success: false, message };
    }
};

/**
 * Reject a pending driver or deactivate an approved one.
 */
export const rejectDriver = async (driverId) => {
    try {
        const response = await axiosInstance.put(`${driverEndpoint}/${driverId}/reject`);

        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to reject driver");
        }

        return { success: true, message: response.data.message };
    } catch (error) {
        console.error("DriverService.rejectDriver:", error);
        const message =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to reject driver";
        return { success: false, message };
    }
};
