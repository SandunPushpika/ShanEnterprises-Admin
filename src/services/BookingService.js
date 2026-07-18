import axiosInstance from "../utils/RequestHelper";

const bookingEndpoint = "/api/Booking";

export const getAllBookings = async ({
    pageNumber = 1,
    pageSize = 9,
} = {}) => {
    try {
        const response = await axiosInstance.post(
            `${bookingEndpoint}/all`,
            {
                pageNumber,
                pageSize,
            }
        );

        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to fetch bookings");
        }

        return response.data.data;
    } catch (error) {
        console.error("BookingService.getAllBookings:", error);
        throw error;
    }
};

export const cancelBooking = async (bookingId) => {
    try {
        const response = await axiosInstance.delete(
            `${bookingEndpoint}/${bookingId}`
        );

        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to cancel booking");
        }

        return response.data.data;
    } catch (error) {
        console.error("BookingService.cancelBooking:", error);
        throw error;
    }
}

export const completeBooking = async (bookingId) => {
    try {
        const response = await axiosInstance.get(
            `${bookingEndpoint}/${bookingId}/complete`
        );

        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to complete booking");
        }

        return response.data.data;
    } catch (error) {
        console.error("BookingService.completeBooking:", error);
        throw error;
    }
}