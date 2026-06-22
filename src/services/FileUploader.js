import axiosInstance from "../utils/RequestHelper";

const storageEndpoint = "/api/Storage";

export const blobTypes = {
    0: "VEHICLE",
    1: "PROFILE",
    2: "LICENSE"
}

export const uploadFile = async (file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axiosInstance.post(`${storageEndpoint}/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to upload file");
        }

        return response.data.data;
    } catch (error) {
        console.error("FileUploader.uploadFile:", error);
        throw error;
    }
}

export const uploadMultipleFiles = async (files, blobType) => {
    try {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append("files", file);
        });

        const response = await axiosInstance.post(`${storageEndpoint}/multiple?blobType=${blobType}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to upload files");
        }

        return response.data.data;
    } catch (error) {
        console.error("FileUploader.uploadMultipleFiles:", error);
        throw error;
    }
}