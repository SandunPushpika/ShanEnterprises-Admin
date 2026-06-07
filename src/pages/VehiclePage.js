import React, { useState, useEffect, useRef } from "react";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    CarFront,
    CheckCircle2,
    AlertTriangle,
    Wrench,
    Fuel,
    Layers,
    Upload,
    X,
    ImagePlus,
    Wifi,
    Thermometer,
    MapPin,
} from "lucide-react";

const INITIAL_VEHICLES = [
    {
        id: 1,
        brandId: "brand_tesla",
        typeId: "type_electric",
        model: "Model S",
        registrationNumber: "WP CAS-8829",
        manufactureYear: 2023,
        transmission: "Automatic",
        fuel: "Electric",
        dailyRentalPrice: 180,
        pricePerKm: 0.8,
        color: "Pearl White",
        seatCapacity: 5,
        luggageCapacity: 3,
        description: "Premium electric sedan with Autopilot and long range.",
        mainImageUrl: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=600",
        images: [],
        airConditioned: true,
        hasBluetooth: true,
        hasGps: true,
        status: "Available",
    },
    {
        id: 2,
        brandId: "brand_land_rover",
        typeId: "type_suv",
        model: "Range Rover Sport",
        registrationNumber: "WP CB-9920",
        manufactureYear: 2022,
        transmission: "Automatic",
        fuel: "Diesel",
        dailyRentalPrice: 250,
        pricePerKm: 1.2,
        color: "Santorini Black",
        seatCapacity: 7,
        luggageCapacity: 5,
        description: "Luxurious SUV built for both city drives and off-road adventures.",
        mainImageUrl: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&q=80&w=600",
        images: [],
        airConditioned: true,
        hasBluetooth: true,
        hasGps: true,
        status: "Rented",
    },
    {
        id: 3,
        brandId: "brand_porsche",
        typeId: "type_sports",
        model: "911 Carrera",
        registrationNumber: "WP CAD-1021",
        manufactureYear: 2023,
        transmission: "Automatic",
        fuel: "Petrol",
        dailyRentalPrice: 320,
        pricePerKm: 1.8,
        color: "Guards Red",
        seatCapacity: 2,
        luggageCapacity: 1,
        description: "Iconic sports car with breathtaking performance on every road.",
        mainImageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600",
        images: [],
        airConditioned: true,
        hasBluetooth: true,
        hasGps: false,
        status: "Available",
    },
    {
        id: 4,
        brandId: "brand_mercedes",
        typeId: "type_sedan",
        model: "E-Class 350",
        registrationNumber: "WP CBB-4432",
        manufactureYear: 2022,
        transmission: "Automatic",
        fuel: "Hybrid",
        dailyRentalPrice: 160,
        pricePerKm: 0.9,
        color: "Obsidian Black",
        seatCapacity: 5,
        luggageCapacity: 3,
        description: "Refined executive sedan combining luxury with efficiency.",
        mainImageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=600",
        images: [],
        airConditioned: true,
        hasBluetooth: false,
        hasGps: true,
        status: "Maintenance",
    },
    {
        id: 5,
        brandId: "brand_audi",
        typeId: "type_suv",
        model: "Q8",
        registrationNumber: "WP CAA-5521",
        manufactureYear: 2023,
        transmission: "Automatic",
        fuel: "Petrol",
        dailyRentalPrice: 210,
        pricePerKm: 1.1,
        color: "Glacier White",
        seatCapacity: 5,
        luggageCapacity: 4,
        description: "Bold and muscular SUV with a driver-focused cockpit.",
        mainImageUrl: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=600",
        images: [],
        airConditioned: true,
        hasBluetooth: true,
        hasGps: true,
        status: "Available",
    },
    {
        id: 6,
        brandId: "brand_bmw",
        typeId: "type_sports",
        model: "M4 Competition",
        registrationNumber: "WP CAC-7711",
        manufactureYear: 2023,
        transmission: "Automatic",
        fuel: "Petrol",
        dailyRentalPrice: 280,
        pricePerKm: 1.5,
        color: "Brooklyn Grey",
        seatCapacity: 4,
        luggageCapacity: 2,
        description: "High-performance coupe with M TwinPower Turbo engine.",
        mainImageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=600",
        images: [],
        airConditioned: true,
        hasBluetooth: true,
        hasGps: true,
        status: "Available",
    },
];


const BLANK_FORM = {
    brandId: "",
    typeId: "",
    model: "",
    registrationNumber: "",
    manufactureYear: new Date().getFullYear(),
    transmission: "Automatic",
    fuel: "Petrol",
    dailyRentalPrice: "",
    pricePerKm: "",
    color: "",
    seatCapacity: "",
    luggageCapacity: "",
    description: "",
    mainImageUrl: "",
    images: [],
    imagePreviews: [],
    airConditioned: false,
    hasBluetooth: false,
    hasGps: false,
    status: "Available",
};

const STATUS_STYLES = {
    Available: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    Rented: "bg-amber-50 text-amber-700 border-amber-200/60",
    Maintenance: "bg-rose-50 text-rose-700 border-rose-200/60",
};

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


const MAX_IMAGES = 5;

function ImageUploader({ previews, onAdd, onRemove }) {
    const inputRef = useRef(null);

    const handleFiles = (e) => {
        const files = Array.from(e.target.files);
        const remaining = MAX_IMAGES - previews.length;
        const toProcess = files.slice(0, remaining);

        toProcess.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (ev) => onAdd(ev.target.result, file);
            reader.readAsDataURL(file);
        });

        e.target.value = "";
    };

    return (
        <div className="space-y-3">

            {previews.length < MAX_IMAGES && (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="w-full flex flex-col items-center justify-center gap-2 h-28 rounded-2xl border-2 border-dashed border-border hover:border-primary hover:bg-primary-light/20 transition text-muted hover:text-primary"
                >
                    <ImagePlus className="w-7 h-7" />
                    <span className="text-sm font-medium">
                        Click to upload&nbsp;
                        <span className="text-muted font-normal">
                            ({previews.length}/{MAX_IMAGES} images)
                        </span>
                    </span>
                    <span className="text-xs text-muted">PNG, JPG, WEBP – max 5 images</span>
                </button>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFiles}
            />


            {previews.length > 0 && (
                <div className="grid grid-cols-5 gap-2">
                    {previews.map((src, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-border">
                            <img src={src} alt={`upload-${idx}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => onRemove(idx)}
                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                            {idx === 0 && (
                                <span className="absolute bottom-1 left-1 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                                    Main
                                </span>
                            )}
                        </div>
                    ))}


                    {previews.length < MAX_IMAGES && (
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary-light/20 flex items-center justify-center text-muted hover:text-primary transition"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}


function VehicleForm({ formData, setFormData, formErrors, onSubmit, onCancel, submitLabel }) {
    const handleAddImage = (dataUrl) => {
        if (formData.imagePreviews.length >= MAX_IMAGES) return;
        setFormData((prev) => ({
            ...prev,
            imagePreviews: [...prev.imagePreviews, dataUrl],
            mainImageUrl: prev.imagePreviews.length === 0 ? dataUrl : prev.mainImageUrl,
        }));
    };

    const handleRemoveImage = (idx) => {
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

    return (
        <form onSubmit={onSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">


            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <Label required>Brand ID</Label>
                    <Field
                        type="text"
                        placeholder="e.g. brand_tesla"
                        value={formData.brandId}
                        onChange={set("brandId")}
                        error={formErrors.brandId}
                    />
                </div>
                <div>
                    <Label required>Type ID</Label>
                    <Field
                        type="text"
                        placeholder="e.g. type_suv"
                        value={formData.typeId}
                        onChange={set("typeId")}
                        error={formErrors.typeId}
                    />
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


            <div className="pt-4 border-t border-border flex items-center justify-end gap-3 sticky bottom-0 bg-white pb-1">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-5 py-2.5 rounded-xl border border-border text-secondary hover:bg-slate-50 font-semibold transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-cta-gradient text-white font-semibold shadow-glow hover:opacity-95 transition"
                >
                    {submitLabel}
                </button>
            </div>
        </form>
    );
}


function Modal({ title, subtitle, onClose, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-secondary/40 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-glow overflow-hidden flex flex-col max-h-[90vh]">

                <div className="px-6 py-5 border-b border-border flex items-center justify-between shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-secondary">{title}</h3>
                        {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted hover:text-secondary hover:bg-slate-50 transition"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

export default function VehiclePage() {


    const [vehicles, setVehicles] = useState(() => {
        const saved = localStorage.getItem("drivelux_vehicles_v2");
        return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
    });
    useEffect(() => {
        localStorage.setItem("drivelux_vehicles_v2", JSON.stringify(vehicles));
    }, [vehicles]);


    const [searchQuery, setSearchQuery] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [formData, setFormData] = useState(BLANK_FORM);
    const [formErrors, setFormErrors] = useState({});
    const [toast, setToast] = useState(null);


    const total = vehicles.length;
    const available = vehicles.filter((v) => v.status === "Available").length;
    const rented = vehicles.filter((v) => v.status === "Rented").length;
    const maintenance = vehicles.filter((v) => v.status === "Maintenance").length;


    const filtered = vehicles.filter((v) => {
        const q = searchQuery.toLowerCase().trim();
        if (!q) return true;
        return (
            v.model.toLowerCase().includes(q) ||
            v.brandId.toLowerCase().includes(q) ||
            v.typeId.toLowerCase().includes(q) ||
            v.registrationNumber.toLowerCase().includes(q) ||
            v.status.toLowerCase().includes(q) ||
            v.fuel.toLowerCase().includes(q) ||
            v.color.toLowerCase().includes(q)
        );
    });


    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };


    const validate = () => {
        const e = {};
        if (!formData.brandId.trim()) e.brandId = "Brand ID is required";
        if (!formData.typeId.trim()) e.typeId = "Type ID is required";
        if (!formData.model.trim()) e.model = "Model is required";
        if (!formData.registrationNumber.trim()) e.registrationNumber = "Registration number is required";
        if (!formData.manufactureYear || Number(formData.manufactureYear) < 1900)
            e.manufactureYear = "Enter a valid year";
        if (!formData.dailyRentalPrice || Number(formData.dailyRentalPrice) <= 0)
            e.dailyRentalPrice = "Enter a valid daily price";
        if (!formData.pricePerKm || Number(formData.pricePerKm) <= 0)
            e.pricePerKm = "Enter a valid price per km";
        if (!formData.color.trim()) e.color = "Color is required";
        if (!formData.seatCapacity || Number(formData.seatCapacity) <= 0)
            e.seatCapacity = "Enter seat capacity";
        if (!formData.luggageCapacity || Number(formData.luggageCapacity) <= 0)
            e.luggageCapacity = "Enter luggage capacity";
        if (formData.imagePreviews.length === 0)
            e.imagePreviews = "Upload at least one vehicle image";
        setFormErrors(e);
        return Object.keys(e).length === 0;
    };


    const openAdd = () => {
        setFormData(BLANK_FORM);
        setFormErrors({});
        setIsAddOpen(true);
    };

    const handleAdd = (e) => {
        e.preventDefault();
        if (!validate()) return;
        const newVehicle = {
            ...formData,
            id: Date.now(),
            dailyRentalPrice: Number(formData.dailyRentalPrice),
            pricePerKm: Number(formData.pricePerKm),
            seatCapacity: Number(formData.seatCapacity),
            luggageCapacity: Number(formData.luggageCapacity),
            manufactureYear: Number(formData.manufactureYear),
            mainImageUrl: formData.imagePreviews[0] || "",
            images: formData.imagePreviews,
        };
        setVehicles([newVehicle, ...vehicles]);
        setIsAddOpen(false);
        showToast(`${newVehicle.model} registered successfully!`);
    };


    const openEdit = (vehicle) => {
        setSelectedVehicle(vehicle);
        setFormData({
            ...vehicle,
            imagePreviews: vehicle.images?.length > 0 ? vehicle.images : vehicle.mainImageUrl ? [vehicle.mainImageUrl] : [],
        });
        setFormErrors({});
        setIsEditOpen(true);
    };

    const handleEdit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        const updated = vehicles.map((v) =>
            v.id === selectedVehicle.id
                ? {
                    ...v,
                    ...formData,
                    dailyRentalPrice: Number(formData.dailyRentalPrice),
                    pricePerKm: Number(formData.pricePerKm),
                    seatCapacity: Number(formData.seatCapacity),
                    luggageCapacity: Number(formData.luggageCapacity),
                    manufactureYear: Number(formData.manufactureYear),
                    mainImageUrl: formData.imagePreviews[0] || v.mainImageUrl,
                    images: formData.imagePreviews,
                }
                : v
        );
        setVehicles(updated);
        setIsEditOpen(false);
        showToast("Vehicle details updated!");
    };


    const openDelete = (vehicle) => {
        setSelectedVehicle(vehicle);
        setIsDeleteOpen(true);
    };

    const handleDelete = () => {
        setVehicles(vehicles.filter((v) => v.id !== selectedVehicle.id));
        setIsDeleteOpen(false);
        showToast(`${selectedVehicle.model} removed from fleet.`, "error");
        setSelectedVehicle(null);
    };


    return (
        <div className="p-4 md:p-8 min-h-[calc(100vh-80px)] space-y-8 bg-surface">


            {toast && (
                <div
                    className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-glow text-white font-medium animate-fade-in ${toast.type === "success" ? "bg-emerald-600" : "bg-rose-600"
                        }`}
                >
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>{toast.message}</span>
                </div>
            )}


            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-secondary tracking-tight font-display">
                        Vehicle Fleet
                    </h1>
                    <p className="text-muted text-sm mt-1">
                        Register, monitor, and manage your full rental vehicle inventory.
                    </p>
                </div>
                <button
                    onClick={openAdd}
                    className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-2xl bg-cta-gradient text-white font-semibold shadow-glow hover:opacity-95 active:scale-[0.98] transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add Vehicle
                </button>
            </div>


            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {[
                    { title: "Total Fleet", value: total, icon: CarFront, color: "text-primary bg-primary-light" },
                    { title: "Available", value: available, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
                    { title: "Active Rentals", value: rented, icon: Layers, color: "text-amber-600 bg-amber-50" },
                    { title: "In Repair", value: maintenance, icon: Wrench, color: "text-rose-600 bg-rose-50" },
                ].map((m, i) => (
                    <div
                        key={i}
                        className="bg-card border border-border rounded-2xl p-5 shadow-card flex items-center justify-between hover:-translate-y-0.5 hover:shadow-soft transition-all"
                    >
                        <div>
                            <p className="text-xs font-semibold text-muted tracking-wider uppercase">{m.title}</p>
                            <h3 className="text-3xl font-bold text-secondary mt-2">{m.value}</h3>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${m.color}`}>
                            <m.icon className="w-6 h-6" />
                        </div>
                    </div>
                ))}
            </div>


            <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search by brand, model, registration number, status, fuel, color…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-surface text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    />
                </div>
            </div>


            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map((v) => (
                        <div
                            key={v.id}
                            className="group bg-card border border-border rounded-3xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 flex flex-col"
                        >

                            <div className="h-52 w-full overflow-hidden relative bg-slate-100">
                                <img
                                    src={v.mainImageUrl}
                                    alt={v.model}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <span
                                    className={`absolute top-4 right-4 px-3.5 py-1.5 rounded-full border text-xs font-bold shadow-sm ${STATUS_STYLES[v.status] ?? STATUS_STYLES.Available}`}
                                >
                                    {v.status}
                                </span>
                                <span className="absolute bottom-4 left-4 bg-secondary/80 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-semibold">
                                    {v.typeId.replace("type_", "").replace("_", " ")}
                                </span>
                            </div>


                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-secondary tracking-tight">
                                                {v.brandId.replace("brand_", "").replace("_", " ")} {v.model}
                                            </h3>
                                            <p className="text-sm text-muted mt-0.5">{v.manufactureYear} · {v.color}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-black text-primary">${v.dailyRentalPrice}</span>
                                            <span className="text-xs font-medium text-muted block">/day</span>
                                        </div>
                                    </div>


                                    <div className="mt-5 grid grid-cols-2 gap-y-2 gap-x-3 text-sm border-t border-border pt-4">
                                        <div className="text-muted">
                                            <span className="font-semibold text-secondary-light">Reg: </span>
                                            {v.registrationNumber}
                                        </div>
                                        <div className="text-muted flex items-center gap-1">
                                            <Fuel className="w-3.5 h-3.5" /> {v.fuel}
                                        </div>
                                        <div className="text-muted">
                                            <span className="font-semibold text-secondary-light">Seats: </span>
                                            {v.seatCapacity}
                                        </div>
                                        <div className="text-muted">
                                            <span className="font-semibold text-secondary-light">Luggage: </span>
                                            {v.luggageCapacity}
                                        </div>
                                        <div className="text-muted col-span-2">
                                            <span className="font-semibold text-secondary-light">$/km: </span>
                                            ${v.pricePerKm}
                                            <span className="ml-3 font-semibold text-secondary-light">Trans: </span>
                                            {v.transmission}
                                        </div>
                                    </div>


                                    <div className="flex flex-wrap gap-1.5 mt-4">
                                        {v.airConditioned && (
                                            <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full">
                                                <Thermometer className="w-3 h-3" /> A/C
                                            </span>
                                        )}
                                        {v.hasBluetooth && (
                                            <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 bg-purple-50 text-purple-600 rounded-full">
                                                <Wifi className="w-3 h-3" /> Bluetooth
                                            </span>
                                        )}
                                        {v.hasGps && (
                                            <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full">
                                                <MapPin className="w-3 h-3" /> GPS
                                            </span>
                                        )}
                                    </div>
                                </div>


                                <div className="mt-6 pt-4 border-t border-border flex items-center gap-3">
                                    <button
                                        onClick={() => openEdit(v)}
                                        className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl border border-border text-secondary hover:bg-slate-50 font-semibold transition"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit Details
                                    </button>
                                    <button
                                        onClick={() => openDelete(v)}
                                        className="w-11 h-11 inline-flex items-center justify-center rounded-xl border border-rose-200/50 bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-card border border-border rounded-3xl p-12 text-center shadow-card max-w-xl mx-auto">
                    <CarFront className="w-16 h-16 text-muted/50 mx-auto stroke-[1.5]" />
                    <h3 className="text-xl font-bold text-secondary mt-5">No Vehicles Found</h3>
                    <p className="text-muted text-sm mt-2">
                        No vehicles match &ldquo;{searchQuery}&rdquo;. Try a different keyword.
                    </p>
                    <button
                        onClick={() => setSearchQuery("")}
                        className="mt-6 px-5 py-2.5 rounded-xl border border-border text-secondary hover:bg-slate-50 font-semibold transition"
                    >
                        Clear Search
                    </button>
                </div>
            )}


            {isAddOpen && (
                <Modal
                    title="Register New Vehicle"
                    subtitle="Fill in the details to add a new vehicle to the fleet."
                    onClose={() => setIsAddOpen(false)}
                >
                    <VehicleForm
                        formData={formData}
                        setFormData={setFormData}
                        formErrors={formErrors}
                        onSubmit={handleAdd}
                        onCancel={() => setIsAddOpen(false)}
                        submitLabel="Register Vehicle"
                    />
                </Modal>
            )}


            {isEditOpen && (
                <Modal
                    title="Edit Vehicle Details"
                    subtitle={`Updating record for "${selectedVehicle?.model}"`}
                    onClose={() => setIsEditOpen(false)}
                >
                    <VehicleForm
                        formData={formData}
                        setFormData={setFormData}
                        formErrors={formErrors}
                        onSubmit={handleEdit}
                        onCancel={() => setIsEditOpen(false)}
                        submitLabel="Save Changes"
                    />
                </Modal>
            )}


            {isDeleteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-secondary/40 backdrop-blur-sm"
                        onClick={() => setIsDeleteOpen(false)}
                    />
                    <div className="relative w-full max-w-md bg-white rounded-3xl shadow-glow p-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-500">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-secondary mt-5">Remove Vehicle?</h3>
                        <p className="text-sm text-muted mt-2">
                            You are about to permanently delete&nbsp;
                            <strong>{selectedVehicle?.brandId?.replace("brand_", "")} {selectedVehicle?.model}</strong>
                            &nbsp;({selectedVehicle?.registrationNumber}). This action cannot be undone.
                        </p>
                        <div className="mt-8 flex gap-3">
                            <button
                                onClick={() => setIsDeleteOpen(false)}
                                className="flex-1 h-12 rounded-2xl border border-border text-secondary hover:bg-slate-50 font-semibold transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-md transition"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}