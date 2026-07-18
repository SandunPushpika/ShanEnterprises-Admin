import axiosInstance from "../utils/RequestHelper";

const maintenanceEndpoint = "/api/VehicleMaintenance";

export const getMaintenanceRecords = async () => {
    try {
        const response = await axiosInstance.get(`${maintenanceEndpoint}/all?_t=${Date.now()}`);
        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to fetch maintenance records");
        }

        return response.data.data;
    } catch (error) {
        console.error("MaintenanceService.getMaintenanceRecords:", error);
        throw error;
    }
};

export const saveMaintenanceRecord = async (record) => {
    try {
        const payload = {
            ...record,
            cost: Number(record.cost),
        };

        const response = record.id
            ? await axiosInstance.put(`${maintenanceEndpoint}/${record.id}`, payload)
            : await axiosInstance.post(`${maintenanceEndpoint}`, payload);

        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to save maintenance record");
        }

        return response.data.data;
    } catch (error) {
        console.error("MaintenanceService.saveMaintenanceRecord:", error);
        throw error;
    }
};

export const deleteMaintenanceRecord = async (id) => {
    try {
        const response = await axiosInstance.delete(`${maintenanceEndpoint}/${id}`);

        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to delete maintenance record");
        }

        return true;
    } catch (error) {
        console.error("MaintenanceService.deleteMaintenanceRecord:", error);
        throw error;
    }
};

export const searchMaintenanceRecords = async (searchParams) => {
    try {
        const response = await axiosInstance.post(`${maintenanceEndpoint}/search`, searchParams);
        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to search maintenance records");
        }
        return response.data.data;
    } catch (error) {
        console.error("MaintenanceService.searchMaintenanceRecords:", error);
        throw error;
    }
};

export const getMaintenanceStats = async (groupBy = "month", year = null) => {
    try {
        const response = await axiosInstance.get(`${maintenanceEndpoint}/stats`, {
            params: { groupBy, year },
        });
        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to fetch maintenance stats");
        }
        return response.data.data;
    } catch (error) {
        console.error("MaintenanceService.getMaintenanceStats:", error);
        throw error;
    }
};
