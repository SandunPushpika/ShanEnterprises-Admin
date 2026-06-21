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
