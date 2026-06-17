import React, { useState, useEffect } from "react";
import { Plus, CarFront } from "lucide-react";
import Modal from "../components/common/Modal";
import Toast from "../components/common/Toast";
import SearchBar from "../components/common/Searchbar";
import VehicleCard from "../components/vehicles/VehicleCard";
import VehicleForm from "../components/vehicle/vehicle-form";
import DeleteConfirmModal from "../components/common/DeleteConfirmModal";
import VehicleStatsBar from "../components/vehicles/VehicleStatsBar";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Pagination from "../components/common/Pagination";
import { addVehicle, deleteVehicle, getVehicles, updateVehicle } from "../services/VehicelService";
import { getVehicleStatusLabel } from "../utils/VehicleEnums";

export default function VehiclePage() {
    const [vehicles, setVehicles] = useState([]);
    const [total, setTotal] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(6);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        loadVehicles();
    }, [pageNumber]);

    const available = vehicles.filter((v) => v.status == 0).length;
    const rented = vehicles.filter((v) => v.status == 1).length;
    const maintenance = vehicles.filter((v) => v.status == 2).length;

    const filtered = vehicles.filter((v) => {
        const q = searchQuery.toLowerCase().trim();
        if (!q) return true;
        return (
            v.model.toLowerCase().includes(q) ||
            v.brand.name.toLowerCase().includes(q) ||
            v.type.name.toLowerCase().includes(q) ||
            v.registrationNumber.toLowerCase().includes(q) ||
            getVehicleStatusLabel(v.status).toLowerCase().includes(q) ||
            String(v.fuel).toLowerCase().includes(q) ||
            String(v.color).toLowerCase().includes(q)
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

    const openAdd = () => {
        setSelectedVehicle(null);
        setIsAddOpen(true);
    };

    const handleCreate = async (newVehicle) => {
        try {
            await addVehicle(newVehicle);
        } catch (exception) {
            setError("Unable to add vehicle");
            showToast("Unable to add vehicle", "error");
            return;
        }
        setIsAddOpen(false);
        await loadVehicles();
        showToast(`${newVehicle.model} registered successfully!`);
    };

    const openEdit = (vehicle) => {
        setSelectedVehicle(vehicle);
        setIsEditOpen(true);
    };

    const handleUpdate = async (updatedVehicle) => {
        
        try {
            await updateVehicle(updatedVehicle.id, updatedVehicle);
        } catch (exception) {
            setError("Unable to add vehicle");
            showToast("Unable to add vehicle", "error");
            return;
        }

        setIsEditOpen(false);
        await loadVehicles();
        showToast("Vehicle details updated!");
    };

    const openDelete = (vehicle) => {
        setSelectedVehicle(vehicle);
        setIsDeleteOpen(true);
    };

    const handleDelete = async () => {
        
        try{
            await deleteVehicle(selectedVehicle.id);
        }catch(error){
            setError("Unable to delete vehicle");
            showToast("Unable to delete vehicle!");
        }

        setIsDeleteOpen(false);
        showToast(`${selectedVehicle.model} removed from fleet.`, "error");

        await loadVehicles();
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
            ) : filtered.length > 0 ? (
                <>
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
                    <Pagination
                        currentPage={pageNumber}
                        totalPages={Math.ceil(total / pageSize)}
                        onPageChange={setPageNumber}
                        isLoading={isLoading}
                    />
                </>
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
                        vehicle={null}
                        onSave={handleCreate}
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
                        vehicle={selectedVehicle}
                        onSave={handleUpdate}
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