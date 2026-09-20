import React, { useState, useEffect, useCallback } from "react";
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
import { addVehicle, deleteVehicle, getVehicles, updateVehicle, setVehicleAvailability, getVehicleStats } from "../services/VehicelService";

const STATUS_PILLS = ["ALL", "AVAILABLE", "BOOKED", "MAINTENANCE", "UNAVAILABLE"];

const PILL_ACTIVE = {
    ALL: "bg-secondary text-white border-secondary",
    AVAILABLE: "bg-emerald-600 text-white border-emerald-600",
    BOOKED: "bg-amber-600 text-white border-amber-600",
    MAINTENANCE: "bg-rose-600 text-white border-rose-600",
    UNAVAILABLE: "bg-slate-600 text-white border-slate-600",
};

const PILL_LABELS = {
    ALL: "All",
    AVAILABLE: "Available",
    BOOKED: "Booked",
    MAINTENANCE: "Maintenance",
    UNAVAILABLE: "Unavailable",
};

export default function VehiclePage() {
    const [vehicles, setVehicles] = useState([]);
    const [total, setTotal] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(6);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [statusFilter, setStatusFilter] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [stats, setStats] = useState({
        total: 0,
        available: 0,
        rented: 0,
        maintenance: 0,
        unavailable: 0,
    });
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [toast, setToast] = useState(null);

    const [availabilityModal, setAvailabilityModal] = useState(false);

    // Debounce search query changes and reset page to 1
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPageNumber(1);
        }, 400);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const loadStats = useCallback(async () => {
        try {
            const data = await getVehicleStats();
            if (data) {
                setStats({
                    total: data.total ?? 0,
                    available: data.available ?? 0,
                    rented: data.rented ?? 0,
                    maintenance: data.maintenance ?? 0,
                    unavailable: data.unavailable ?? 0,
                });
            }
        } catch (err) {
            console.error("Failed to load vehicle stats:", err);
        }
    }, []);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    const loadVehicles = useCallback(async (search = debouncedSearch, page = pageNumber, status = statusFilter) => {
        try {
            setIsLoading(true);
            setError(null);

            const result = await getVehicles({
                minPrice: 0,
                maxPrice: 0,
                typeId: 0,
                status: status === "ALL" ? null : status,
                minPassengers: 0,
                search: search?.trim() || null,
                pageNumber: page,
                pageSize,
            });

            setVehicles(result?.data || []);
            setTotal(result?.total || 0);
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
    }, [debouncedSearch, pageNumber, statusFilter, pageSize]);

    useEffect(() => {
        loadVehicles(debouncedSearch, pageNumber, statusFilter);
    }, [debouncedSearch, pageNumber, statusFilter, loadVehicles]);

    const handleStatusFilterChange = (status) => {
        setStatusFilter(status);
        setPageNumber(1);
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
        loadStats();
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
        loadStats();
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
        loadStats();
        setSelectedVehicle(null);
    };

    const openAvailabilityModal = (vehicle) => {
        setSelectedVehicle(vehicle);
        setAvailabilityModal(true);
    };

    const handleSetAvailability = async () => {
        const statusStr = String(selectedVehicle.status).toUpperCase();
        const currentlyUnavailable = statusStr === "UNAVAILABLE" || statusStr === "3";
        const makeUnavailable = !currentlyUnavailable;
        const result = await setVehicleAvailability(selectedVehicle.id, makeUnavailable);
        setAvailabilityModal(false);
        if (result.success) {
            showToast(result.message);
            await loadVehicles();
            loadStats();
        } else {
            showToast(result.message, "error");
        }
        setSelectedVehicle(null);
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        setDebouncedSearch("");
        setPageNumber(1);
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
                total={stats.total}
                available={stats.available}
                rented={stats.rented}
                maintenance={stats.maintenance}
                unavailable={stats.unavailable}
            />

            <div className="space-y-3">
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    placeholder="Search by name, brand, model, registration…"
                />

                <div className="flex flex-wrap gap-2">
                    {STATUS_PILLS.map((s) => (
                        <button
                            key={s}
                            onClick={() => handleStatusFilterChange(s)}
                            className={`px-4 py-1.5 rounded-full border text-xs font-bold transition ${
                                statusFilter === s
                                    ? PILL_ACTIVE[s]
                                    : "bg-white border-border text-secondary hover:bg-slate-50"
                            }`}
                        >
                            {PILL_LABELS[s]}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <LoadingSpinner />
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                    <p className="text-red-600 font-medium">{error}</p>
                    <button
                        onClick={() => {
                            loadVehicles(debouncedSearch, pageNumber, statusFilter);
                            loadStats();
                        }}
                        className="mt-4 px-4 py-2 rounded-lg bg-primary text-white"
                    >
                        Retry
                    </button>
                </div>
            ) : vehicles.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {vehicles.map((v) => (
                            <VehicleCard
                                key={v.id}
                                vehicle={v}
                                onEdit={openEdit}
                                onDelete={openDelete}
                                onToggleAvailability={openAvailabilityModal}
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
                        {searchQuery
                            ? <>No vehicles match &ldquo;{searchQuery}&rdquo;. Try a different keyword.</>
                            : statusFilter !== "ALL"
                                ? `No vehicles found with status "${PILL_LABELS[statusFilter]}".`
                                : "No vehicles found in fleet."
                        }
                    </p>
                    {(searchQuery || statusFilter !== "ALL") && (
                        <div className="flex justify-center gap-3 mt-6">
                            {searchQuery && (
                                <button
                                    onClick={handleClearSearch}
                                    className="px-5 py-2.5 rounded-xl border border-border text-secondary hover:bg-slate-50 font-semibold transition"
                                >
                                    Clear Search
                                </button>
                            )}
                            {statusFilter !== "ALL" && (
                                <button
                                    onClick={() => handleStatusFilterChange("ALL")}
                                    className="px-5 py-2.5 rounded-xl border border-border text-secondary hover:bg-slate-50 font-semibold transition"
                                >
                                    Show All Statuses
                                </button>
                            )}
                        </div>
                    )}
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

            {availabilityModal && (
                <Modal
                    title={
                        (() => {
                            const s = String(selectedVehicle?.status).toUpperCase();
                            return s === "3" || s === "UNAVAILABLE" ? "Make Vehicle Available" : "Mark Vehicle Unavailable";
                        })()
                    }
                    subtitle={`Are you sure you want to change availability for ${selectedVehicle?.model}?`}
                    onClose={() => setAvailabilityModal(false)}
                >
                    <div className="p-6 pt-0 space-y-4">
                        <p className="text-secondary">
                            {(() => {
                                const s = String(selectedVehicle?.status).toUpperCase();
                                return s === "3" || s === "UNAVAILABLE"
                                    ? "This vehicle will become visible to customers for booking." 
                                    : "This vehicle will be hidden from customers and cannot be booked.";
                            })()}
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setAvailabilityModal(false)}
                                className="flex-1 py-2.5 rounded-xl border border-border text-secondary hover:bg-slate-50 font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSetAvailability}
                                className={`flex-1 py-2.5 rounded-xl font-semibold text-white ${
                                    (() => {
                                        const s = String(selectedVehicle?.status).toUpperCase();
                                        return s === "3" || s === "UNAVAILABLE" ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600 hover:bg-amber-700';
                                    })()
                                }`}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}