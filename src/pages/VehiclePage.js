import React, { useState, useEffect } from "react";
import { Plus, CarFront } from "lucide-react";
import Modal from "../components/common/Modal";
import Toast from "../components/common/Toast";
import SearchBar from "../components/common/Searchbar";
import VehicleCard from "../components/vehicles/VehicleCard";
import VehicleForm from "../components/vehicles/VehicleForm";
import DeleteConfirmModal from "../components/common/DeleteConfirmModal";
import VehicleStatsBar from "../components/vehicles/VehicleStatsBar";

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

export default function VehiclePage() {
    const [vehicles, setVehicles] = useState(() => {
        const saved = localStorage.getItem("drivelux_vehicles_v2");
        if (!saved) return INITIAL_VEHICLES;
        try {
            return JSON.parse(saved);
        } catch {
            localStorage.removeItem("drivelux_vehicles_v2");
            return INITIAL_VEHICLES;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem("drivelux_vehicles_v2", JSON.stringify(vehicles));
        } catch (error) {
            console.warn("Failed to save vehicles to localStorage:", error);
        }
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
        setVehicles((prev) => [newVehicle, ...prev]);
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
        setVehicles((prev) =>
            prev.map((v) =>
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
            )
        );
        setIsEditOpen(false);
        showToast("Vehicle details updated!");
    };

    const openDelete = (vehicle) => {
        setSelectedVehicle(vehicle);
        setIsDeleteOpen(true);
    };

    const handleDelete = () => {
        setVehicles((prev) => prev.filter((v) => v.id !== selectedVehicle.id));
        setIsDeleteOpen(false);
        showToast(`${selectedVehicle.model} removed from fleet.`, "error");
        setSelectedVehicle(null);
    };

    return (
        <div className="p-4 md:p-8 min-h-[calc(100vh-80px)] space-y-8 bg-surface">
            {toast && <Toast type={toast.type} message={toast.message} />}

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

            <VehicleStatsBar
                total={total}
                available={available}
                rented={rented}
                maintenance={maintenance}
            />

            <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                placeholder="Search by brand, model, registration number, status, fuel, color…"
            />

            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map((v) => (
                        <VehicleCard
                            key={v.id}
                            vehicle={v}
                            onEdit={openEdit}
                            onDelete={openDelete}
                        />
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
                <DeleteConfirmModal
                    vehicle={selectedVehicle}
                    onConfirm={handleDelete}
                    onCancel={() => setIsDeleteOpen(false)}
                />
            )}
        </div>
    );
}