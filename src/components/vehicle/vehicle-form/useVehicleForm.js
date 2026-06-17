import { useCallback, useEffect, useMemo, useState } from "react";
import { getAllVehicleBrands, getAllVehicleTypes } from "../../../services/VehicelService";
import { uploadMultipleFiles, blobTypes } from "../../../services/FileUploader";
import validateVehicleForm from "./vehicleValidation";
import { getTransmissionValue, getFuelValue, getVehicleStatusValue } from "../../../utils/VehicleEnums";

const INITIAL_FORM_STATE = {
    id: undefined,
    brand: null,
    brandId: "",
    type: null,
    typeId: "",
    model: "",
    registrationNumber: "",
    manufactureYear: new Date().getFullYear(),
    transmission: 1,
    fuel: 0,
    dailyRentalPrice: "",
    pricePerKm: "",
    color: "",
    seatCapacity: "",
    luggageCapacity: "",
    description: "",
    status: "0",
    airConditioned: false,
    hasBluetooth: false,
    hasGps: false,
    images: [],
};

const createImageEntry = ({ file = null, previewUrl, sourceUrl = null }) => ({
    file,
    previewUrl,
    sourceUrl,
});

const mapVehicleToFormState = (vehicle) => {
    if (!vehicle) {
        return INITIAL_FORM_STATE;
    }

    const brand = vehicle.brand ??
        (vehicle.brandId ? { id: vehicle.brandId, name: vehicle.brand?.name || "" } : null);
    const type = vehicle.type ??
        (vehicle.typeId ? { id: vehicle.typeId, name: vehicle.type?.name || "" } : null);

    const sourceUrls = Array.isArray(vehicle.imageUrls)
        ? vehicle.imageUrls
        : Array.isArray(vehicle.images)
            ? vehicle.images
            : [];

    const images = sourceUrls.map((url) =>
        createImageEntry({ file: null, previewUrl: url, sourceUrl: url })
    );

    if (images.length === 0 && vehicle.mainImageUrl) {
        images.push(createImageEntry({ file: null, previewUrl: vehicle.mainImageUrl, sourceUrl: vehicle.mainImageUrl }));
    }

    return {
        id: vehicle.id,
        brand,
        brandId: brand?.id ?? vehicle.brandId ?? "",
        type,
        typeId: type?.id ?? vehicle.typeId ?? "",
        model: vehicle.model ?? "",
        registrationNumber: vehicle.registrationNumber ?? "",
        manufactureYear: vehicle.manufactureYear ?? new Date().getFullYear(),
        transmission: Number(vehicle.transmission) ?? 1,
        fuel: Number(vehicle.fuel) ?? 0,
        dailyRentalPrice: String(vehicle.dailyRentalPrice ?? ""),
        pricePerKm: String(vehicle.pricePerKm ?? ""),
        color: vehicle.color ?? "",
        seatCapacity: String(vehicle.seatCapacity ?? ""),
        luggageCapacity: String(vehicle.luggageCapacity ?? ""),
        description: vehicle.description ?? "",
        status: 0,
        airConditioned: !!vehicle.airConditioned,
        hasBluetooth: !!vehicle.hasBluetooth,
        hasGps: !!vehicle.hasGps,
        images,
    };
};

const findLookupItem = (items, id) => {
    if (!Array.isArray(items)) {
        return null;
    }

    return items.find((item) => String(item.id) === String(id)) || null;
};

export default function useVehicleForm({ vehicle = null, onSave = () => Promise.resolve() }) {
    const [formData, setFormData] = useState(() => mapVehicleToFormState(vehicle));
    const [errors, setErrors] = useState({});
    const [lookup, setLookup] = useState({ brands: [], types: [] });
    const [isLookupLoading, setIsLookupLoading] = useState(true);
    const [lookupError, setLookupError] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [submitError, setSubmitError] = useState("");

    useEffect(() => {
        setFormData(mapVehicleToFormState(vehicle));
    }, [vehicle]);

    const loadLookupData = useCallback(async () => {
        setIsLookupLoading(true);
        setLookupError("");

        try {
            const [brands, types] = await Promise.all([
                getAllVehicleBrands(),
                getAllVehicleTypes(),
            ]);

            setLookup({ brands, types });
        } catch (error) {
            setLookupError(error?.message || "Failed to load vehicle options.");
        } finally {
            setIsLookupLoading(false);
        }
    }, []);

    useEffect(() => {
        loadLookupData();
    }, [loadLookupData]);

    const updateField = useCallback((field, value) => {
        setFormData((current) => ({
            ...current,
            [field]: value,
        }));

        setErrors((current) => {
            if (!current[field]) {
                return current;
            }
            const next = { ...current };
            delete next[field];
            return next;
        });
    }, []);

    const handleFieldChange = useCallback(
        (field) => (event) => {
            const nextValue = event.target.type === "checkbox"
                ? event.target.checked
                : event.target.value;
            updateField(field, nextValue);
        },
        [updateField]
    );

    const handleBrandChange = useCallback(
        (event) => {
            const value = event.target.value;
            updateField("brandId", value);
            updateField("brand", findLookupItem(lookup.brands, value));
        },
        [lookup.brands, updateField]
    );

    const handleTypeChange = useCallback(
        (event) => {
            const value = event.target.value;
            updateField("typeId", value);
            updateField("type", findLookupItem(lookup.types, value));
        },
        [lookup.types, updateField]
    );

    const handleToggleFeature = useCallback(
        (field) => {
            setFormData((current) => ({
                ...current,
                [field]: !current[field],
            }));
        },
        []
    );

    const handleImageAdd = useCallback(
        (imageEntry) => {
            setFormData((current) => ({
                ...current,
                images: [...current.images, createImageEntry(imageEntry)],
            }));

            setErrors((current) => {
                if (!current.images) {
                    return current;
                }
                const next = { ...current };
                delete next.images;
                return next;
            });
        },
        []
    );

    const handleImageRemove = useCallback((index) => {
        setFormData((current) => ({
            ...current,
            images: current.images.filter((_, itemIndex) => itemIndex !== index),
        }));
    }, []);

    const imagePreviews = useMemo(
        () => formData.images.map((image) => ({ previewUrl: image.previewUrl })),
        [formData.images]
    );

    const selectedBrand = useMemo(
        () => formData.brand || findLookupItem(lookup.brands, formData.brandId),
        [formData.brand, formData.brandId, lookup.brands]
    );

    const selectedType = useMemo(
        () => formData.type || findLookupItem(lookup.types, formData.typeId),
        [formData.type, formData.typeId, lookup.types]
    );

    const handleSubmit = useCallback(
        async (event) => {
            if (event?.preventDefault) {
                event.preventDefault();
            }

            if (isSaving) {
                return;
            }

            const validationErrors = validateVehicleForm(formData);

            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                console.log("Validation errors:", validationErrors);
                return;
            }

            setSubmitError("");
            setIsSaving(true);

            try {
                const filesToUpload = formData.images
                    .filter((item) => item.file)
                    .map((item) => item.file);

                const uploadedUrls = filesToUpload.length > 0
                    ? await uploadMultipleFiles(filesToUpload, 0)
                    : [];

                const imageUrls = formData.images.map((item) => {
                    if (item.file) {
                        return uploadedUrls.shift();
                    }
                    return item.sourceUrl || item.previewUrl;
                }).filter(Boolean);

                const payload = {
                    ...formData,
                    brand: selectedBrand,
                    brandId: selectedBrand?.id ?? null,
                    type: selectedType,
                    typeId: selectedType?.id ?? null,
                    transmission: Number(formData.transmission),
                    fuel: Number(formData.fuel),
                    status: 0,
                    dailyRentalPrice: Number(formData.dailyRentalPrice),
                    pricePerKm: Number(formData.pricePerKm),
                    seatCapacity: Number(formData.seatCapacity),
                    luggageCapacity: Number(formData.luggageCapacity),
                    manufactureYear: Number(formData.manufactureYear),
                    imageUrls,
                    mainImageUrl: imageUrls[0] || "",
                };

                delete payload.images;

                await onSave(payload);
            } catch (error) {
                setSubmitError(error?.message || "Unable to save vehicle. Please try again.");
            } finally {
                setIsSaving(false);
            }
        },
        [formData, isSaving, onSave, selectedBrand, selectedType]
    );

    return {
        formData,
        errors,
        imagePreviews,
        lookup,
        isLookupLoading,
        lookupError,
        isSaving,
        submitError,
        handleBrandChange,
        handleTypeChange,
        handleFieldChange,
        handleToggleFeature,
        handleImageAdd,
        handleImageRemove,
        handleSubmit,
        loadLookupData,
    };
}
