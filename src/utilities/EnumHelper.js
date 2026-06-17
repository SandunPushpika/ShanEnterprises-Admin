export const getTransmissionType = (transmissionType) => {
    switch (transmissionType) {
        case 0:
            return "Automatic";
        case 1:
            return "Manual";
        default:
            return "Unknown";
    }
}