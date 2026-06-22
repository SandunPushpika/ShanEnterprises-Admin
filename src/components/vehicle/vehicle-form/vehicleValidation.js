const currentYear = new Date().getFullYear();

export default function validateVehicleForm(formData) {
    const errors = {};

    if (!formData.brandId && !formData.brand) {
        errors.brand = "Brand is required";
    }

    if (!formData.typeId && !formData.type) {
        errors.type = "Type is required";
    }

    if (!formData.model?.trim()) {
        errors.model = "Model is required";
    }

    if (!formData.registrationNumber?.trim()) {
        errors.registrationNumber = "Registration number is required";
    }

    const manufactureYear = Number(formData.manufactureYear);
    if (
        !formData.manufactureYear ||
        Number.isNaN(manufactureYear) ||
        manufactureYear < 1900 ||
        manufactureYear > currentYear
    ) {
        errors.manufactureYear = "Enter a valid year";
    }

    const dailyRentalPrice = Number(formData.dailyRentalPrice);
    if (!formData.dailyRentalPrice || Number.isNaN(dailyRentalPrice) || dailyRentalPrice <= 0) {
        errors.dailyRentalPrice = "Enter a valid daily rental price";
    }

    const pricePerKm = Number(formData.pricePerKm);
    if (!formData.pricePerKm || Number.isNaN(pricePerKm) || pricePerKm <= 0) {
        errors.pricePerKm = "Enter a valid price per km";
    }

    const seatCapacity = Number(formData.seatCapacity);
    if (!formData.seatCapacity || Number.isNaN(seatCapacity) || seatCapacity <= 0) {
        errors.seatCapacity = "Enter seat capacity";
    }

    const luggageCapacity = Number(formData.luggageCapacity);
    if (!formData.luggageCapacity || Number.isNaN(luggageCapacity) || luggageCapacity <= 0) {
        errors.luggageCapacity = "Enter luggage capacity";
    }

    if (!Array.isArray(formData.images) || formData.images.length === 0) {
        errors.images = "Upload at least one vehicle image";
    }

    return errors;
}
