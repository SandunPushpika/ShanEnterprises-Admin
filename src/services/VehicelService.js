import axiosInstance from "../utils/RequestHelper";

const vehicleEndpoint = "/api/Vehicle";

export const getVehicles = async ({
    minPrice = 0,
    maxPrice = 0,
    typeId = 0,
    status = 0,
    minPassengers = 0,
    pageNumber = 1,
    pageSize = 10,
}) => {
    try {
        const response = await axiosInstance.post(
            `${vehicleEndpoint}/search`,
            {
                minPrice,
                maxPrice,
                typeId,
                status,
                minPassengers,
                pageNumber,
                pageSize
            }
        );

        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to fetch vehicles");
        }

        return response.data.data;
    } catch (error) {
        console.error("VehicleService.getVehicles:", error);
        throw error;
    }
};

export const getAllVehicleBrands = async () => {
    try {
        const response = await axiosInstance.get(`${vehicleEndpoint}/brands`);

        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to fetch vehicle brands");
        }

        return response.data.data;
    } catch (error) {
        console.error("VehicleService.getAllVehicleBrands:", error);
        throw error;
    }
}

export const getAllVehicleTypes = async () => {
    try {
        const response = await axiosInstance.get(`${vehicleEndpoint}/types`);

        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to fetch vehicle types");
        }

        return response.data.data;
    } catch (error) {
        console.error("VehicleService.getAllVehicleTypes:", error);
        throw error;
    }
}

export const addVehicle = async (payload) => {
    try{

        const response = await axiosInstance.post(`${vehicleEndpoint}`, payload);

        if(!response.data.success)
            throw new Error("Failed to add vehicle");

    }catch (error){
        console.log(error);
    }
}