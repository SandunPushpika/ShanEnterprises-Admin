import React, { useEffect } from "react";
import { Thermometer, Wifi, MapPin } from "lucide-react";
import ImageUploader from "../common/ImageUploader";
import { getAllVehicleBrands, getAllVehicleTypes } from "../../services/VehicelService";

const Label = ({ children, required }) => (
    <label className="block text-sm font-semibold text-secondary-light mb-1">
        {children} {required && <span className="text-rose-500">*</span>}
    </label>
);

const Field = ({ error, ...props }) => (
    <>
        <input
            {...props}
            className={`w-full px-4 py-2.5 rounded-xl border ${error ? "border-rose-500" : "border-border"
                } focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition bg-white text-secondary`}
        />
        {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </>
);

const Select = ({ children, error, ...props }) => (
    <>
        <select
            {...props}
            className={`w-full px-4 py-2.5 rounded-xl border ${error ? "border-rose-500" : "border-border"
                } focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition bg-white text-secondary`}
        >
            {children}
        </select>
        {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </>
);

const TogglePill = ({ icon: Icon, label, checked, onChange }) => (
    <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition select-none ${checked
            ? "bg-primary text-white border-primary shadow-glow"
            : "bg-surface text-secondary border-border hover:bg-slate-100"
            }`}
    >
        <Icon className="w-4 h-4" />
        {label}
    </button>
);

function VehicleForm({ formData, setFormData, formErrors, onSubmit, onCancel, submitLabel }) {

    const [brands, setBrands] = React.useState([]);
    const [types, setTypes] = React.useState([]);
    const [images, setImages] = React.useState([]);

    useEffect(() => {
        loadBrands();
        loadTypes();
    }, []);

    const loadBrands = async () => {
        try {
            const data = await getAllVehicleBrands();
            console.log("Loaded brands:", data);
            setBrands(data);
        } catch (error) {
            console.error("Failed to load vehicle brands:", error);
        }
    }

    const loadTypes = async () => {
        try {
            const data = await getAllVehicleTypes();
            setTypes(data);
        } catch (error) {
            console.error("Failed to load vehicle types:", error);
        }
    }

    const handleAddImage = (image, previewUrl) => {
        if (formData.imagePreviews.length >= 5) return;

        setImages((prev) => [...prev, image]);

        setFormData((prev) => ({
            ...prev,
            imagePreviews: [...prev.imagePreviews, previewUrl],
            mainImageUrl: prev.imagePreviews.length === 0 ? previewUrl : prev.mainImageUrl,
        }));
    };

    const handleRemoveImage = (idx) => {
        setImages((prev) => prev.filter((_, i) => i !== idx));
        setFormData((prev) => {
            const newPreviews = prev.imagePreviews.filter((_, i) => i !== idx);
            return {
                ...prev,
                imagePreviews: newPreviews,
                mainImageUrl: newPreviews[0] || "",
            };
        });
    };

    const set = (field) => (e) =>
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));

    const setCheck = (field) => (val) =>
        setFormData((prev) => ({ ...prev, [field]: val }));

    const getBrandValue = () => {
        if (formData.brandId) return formData.brandId;
        if (formData.brand?.id) return formData.brand.id;
        return "";
    };

    const getTypeValue = () => {
        if (formData.typeId) return formData.typeId;
        if (formData.type?.id) return formData.type.id;
        return "";
    };

    const handleBrandChange = (e) => {
        const value = Number(e.target.value);

        setFormData((prev) => ({
            ...prev,
            brandId: value,
            brand: brands.find((b) => b.id === value) || null,
        }));
    };

    const handleTypeChange = (e) => {
        const value = Number(e.target.value);

        setFormData((prev) => ({
            ...prev,
            typeId: value,
            type: types.find((t) => t.id === value) || null,
        }));
    };

    return (
        <>
            <form id="vehicle-form" onSubmit={onSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label required>Brand</Label>

                        <Select
                            value={getBrandValue()}
                            onChange={handleBrandChange}
                            error={formErrors.brandId}
                        >
                            <option value="">Select Brand</option>

                            {brands.map((brand) => (
                                <option key={brand.id} value={brand.id}>
                                    {brand.name}
                                </option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <Label required>Type</Label>

                        <Select
                            value={getTypeValue()}
                            onChange={handleTypeChange}
                            error={formErrors.typeId}
                        >
                            <option value="">Select Type</option>

                            {types.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <Label required>Model</Label>
                        <Field
                            type="text"
                            placeholder="e.g. Model S"
                            value={formData.model}
                            onChange={set("model")}
                            error={formErrors.model}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label required>Registration Number</Label>
                        <Field
                            type="text"
                            placeholder="e.g. WP CAA-1234"
                            value={formData.registrationNumber}
                            onChange={set("registrationNumber")}
                            error={formErrors.registrationNumber}
                        />
                    </div>
                    <div>
                        <Label required>Manufacture Year</Label>
                        <Field
                            type="number"
                            placeholder="e.g. 2023"
                            value={formData.manufactureYear}
                            onChange={set("manufactureYear")}
                            error={formErrors.manufactureYear}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>Transmission</Label>
                        <Select value={formData.transmission} onChange={set("transmission")}>
                            <option value="Automatic">Automatic</option>
                            <option value="Manual">Manual</option>
                        </Select>
                    </div>
                    <div>
                        <Label>Fuel Type</Label>
                        <Select value={formData.fuel} onChange={set("fuel")}>
                            <option value="Petrol">Petrol</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Electric">Electric</option>
                            <option value="Hybrid">Hybrid</option>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label required>Daily Rental Price ($)</Label>
                        <Field
                            type="number"
                            placeholder="e.g. 150"
                            value={formData.dailyRentalPrice}
                            onChange={set("dailyRentalPrice")}
                            error={formErrors.dailyRentalPrice}
                        />
                    </div>
                    <div>
                        <Label required>Price per Km ($)</Label>
                        <Field
                            type="number"
                            step="0.01"
                            placeholder="e.g. 1.20"
                            value={formData.pricePerKm}
                            onChange={set("pricePerKm")}
                            error={formErrors.pricePerKm}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label required>Color</Label>
                        <Field
                            type="text"
                            placeholder="e.g. Pearl White"
                            value={formData.color}
                            onChange={set("color")}
                            error={formErrors.color}
                        />
                    </div>
                    <div>
                        <Label required>Seat Capacity</Label>
                        <Field
                            type="number"
                            placeholder="e.g. 5"
                            value={formData.seatCapacity}
                            onChange={set("seatCapacity")}
                            error={formErrors.seatCapacity}
                        />
                    </div>
                    <div>
                        <Label required>Luggage Capacity</Label>
                        <Field
                            type="number"
                            placeholder="e.g. 3"
                            value={formData.luggageCapacity}
                            onChange={set("luggageCapacity")}
                            error={formErrors.luggageCapacity}
                        />
                    </div>
                </div>

                <div>
                    <Label>Status</Label>
                    <Select value={formData.status} onChange={set("status")}>
                        <option value="Available">Available</option>
                        <option value="Rented">Rented</option>
                        <option value="Maintenance">Maintenance</option>
                    </Select>
                </div>

                <div>
                    <Label>Description</Label>
                    <textarea
                        rows={3}
                        placeholder="Short vehicle description..."
                        value={formData.description}
                        onChange={set("description")}
                        className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition bg-white text-secondary resize-none"
                    />
                </div>

                <div>
                    <Label>Features</Label>
                    <div className="flex flex-wrap gap-3 mt-1">
                        <TogglePill
                            icon={Thermometer}
                            label="Air Conditioned"
                            checked={formData.airConditioned}
                            onChange={setCheck("airConditioned")}
                        />
                        <TogglePill
                            icon={Wifi}
                            label="Bluetooth"
                            checked={formData.hasBluetooth}
                            onChange={setCheck("hasBluetooth")}
                        />
                        <TogglePill
                            icon={MapPin}
                            label="GPS"
                            checked={formData.hasGps}
                            onChange={setCheck("hasGps")}
                        />
                    </div>
                </div>

                <div>
                    <Label>Vehicle Images <span className="text-muted font-normal text-xs">(max 5 — first image becomes main)</span></Label>
                    <ImageUploader
                        previews={formData.imagePreviews}
                        onAdd={handleAddImage}
                        onRemove={handleRemoveImage}
                    />
                    {formErrors.imagePreviews && (
                        <p className="text-xs text-rose-500 mt-1">{formErrors.imagePreviews}</p>
                    )}
                </div>
            </form>

            {/* Footer fixed outside scroll area */}
            <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 bg-white shrink-0">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-5 py-2.5 rounded-xl border border-border text-secondary hover:bg-slate-50 font-semibold transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    form="vehicle-form"
                    onClick= {onSubmit}
                    className="px-6 py-2.5 rounded-xl bg-cta-gradient text-white font-semibold shadow-glow hover:opacity-95 transition"
                >
                    {submitLabel}
                </button>
            </div>
        </>
    );
}

export default VehicleForm;