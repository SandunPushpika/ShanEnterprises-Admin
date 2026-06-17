import React, { useState, useEffect } from "react";
import { Plus, CarFront } from "lucide-react";
import Modal from "../components/common/Modal";
import Toast from "../components/common/Toast";
import SearchBar from "../components/common/Searchbar";
import VehicleCard from "../components/vehicles/VehicleCard";
import VehicleForm from "../components/vehicles/VehicleForm";
import DeleteConfirmModal from "../components/common/DeleteConfirmModal";
import VehicleStatsBar from "../components/vehicles/VehicleStatsBar";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { getVehicles } from "../services/VehicelService";

const BLANK_FORM = {
    brand: null,
    type: null,
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
    const [vehicles, setVehicles] = useState([]);
    const [total, setTotal] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(12);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [formData, setFormData] = useState(BLANK_FORM);
    const [formErrors, setFormErrors] = useState({});
    const [toast, setToast] = useState(null);

    useEffect(() => {
        loadVehicles();
    }, [pageNumber]);

    const available = vehicles.filter((v) => v.status === "Available").length;
    const rented = vehicles.filter((v) => v.status === "Rented").length;
    const maintenance = vehicles.filter((v) => v.status === "Maintenance").length;

    const filtered = vehicles.filter((v) => {
        const q = searchQuery.toLowerCase().trim();
        if (!q) return true;
        return (
            v.model.toLowerCase().includes(q) ||
            v.brand.name.toLowerCase().includes(q) ||
            v.type.name.toLowerCase().includes(q) ||
            v.registrationNumber.toLowerCase().includes(q) ||
            v.status.toLowerCase().includes(q) ||
            v.fuel.toLowerCase().includes(q) ||
            v.color.toLowerCase().includes(q)
        );
    });

    const loadVehicles = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const result = await getVehicles({
                minPrice: 0,
                maxPrice: 0,
                typeId: 0,
                status: 0,
                minPassengers: 0,
                pageNumber,
                pageSize,
            });

            setVehicles(result.data);
            setTotal(result.total);
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.message ||
                "Failed to load vehicles";

            setError(message);
            showToast(message, "error");
        } finally {
            setIsLoading(false);
        }
    };

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const validate = () => {
        const e = {};
        if (!formData.brand) e.brand = "Brand is required";
        if (!formData.type) e.type = "Type is required";
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

            {isLoading ? (
                <LoadingSpinner />
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                    <p className="text-red-600 font-medium">{error}</p>
                    <button
                        onClick={loadVehicles}
                        className="mt-4 px-4 py-2 rounded-lg bg-primary text-white"
                    >
                        Retry
                    </button>
                </div>
            ) :
                filtered.length > 0 ? (
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
                )
            }

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