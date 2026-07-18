import React, { useState, useEffect } from "react";
import { Plus, Wrench } from "lucide-react";
import Toast from "../components/common/Toast";
import { getVehicles, updateVehicle } from "../services/VehicelService";
import { getMaintenanceRecords, saveMaintenanceRecord, deleteMaintenanceRecord, searchMaintenanceRecords, getMaintenanceStats } from "../services/MaintenanceService";
import MaintenanceStats from "../components/vehicle-maintenance/MaintenanceStats";
import MaintenanceFilters from "../components/vehicle-maintenance/MaintenanceFilters";
import MaintenanceChart from "../components/vehicle-maintenance/MaintenanceChart";
import MaintenanceTable from "../components/vehicle-maintenance/MaintenanceTable";
import MaintenanceFormModal from "../components/vehicle-maintenance/MaintenanceFormModal";
import MaintenanceDeleteModal from "../components/vehicle-maintenance/MaintenanceDeleteModal";
import MaintenanceViewModal from "../components/vehicle-maintenance/MaintenanceViewModal";
import Pagination from "../components/common/Pagination";

export default function VehicleMaintenancePage() {
    const [vehicles, setVehicles] = useState([]);
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Filters State
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedVehicleId, setSelectedVehicleId] = useState("ALL");
    const [selectedMonth, setSelectedMonth] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL"); // Interactive stats filter

    // Pagination State
    const [pageNumber, setPageNumber] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [globalStats, setGlobalStats] = useState({
        totalCost: 0,
        totalCount: 0,
        completedCount: 0,
        underMaintenanceCount: 0,
    });
    const pageSize = 10;

    // Modal and Actions State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [toast, setToast] = useState(null);

    const normalizeStatus = (status) => {
        if (status === 0 || status === "0" || status === "COMPLETED" || status === "Completed") return "Completed";
        if (status === 1 || status === "1" || status === "UNDER_MAINTENANCE" || status === "Under Maintenance") return "Under Maintenance";
        return status;
    };

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchRecords = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const result = await searchMaintenanceRecords({
                vehicleId: selectedVehicleId !== "ALL" ? Number(selectedVehicleId) : null,
                month: selectedMonth !== "ALL" ? Number(selectedMonth) : null,
                year: null,
                status: statusFilter === "Completed" ? "COMPLETED" : (statusFilter === "Under Maintenance" ? "UNDER_MAINTENANCE" : null),
                pageNumber,
                pageSize,
            });

            setRecords(result.data || []);
            setTotalRecords(result.total || 0);
        } catch (err) {
            console.error("Failed to load records:", err);
            setError("Failed to load vehicle maintenance records.");
            showToast("Failed to load records.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const statsData = await getMaintenanceStats("month", null);
            const totalCost = statsData.reduce((sum, item) => sum + (item.totalCost || 0), 0);

            const [totalRes, completedRes, underMaintRes] = await Promise.all([
                searchMaintenanceRecords({ pageNumber: 1, pageSize: 1 }),
                searchMaintenanceRecords({ status: "COMPLETED", pageNumber: 1, pageSize: 1 }),
                searchMaintenanceRecords({ status: "UNDER_MAINTENANCE", pageNumber: 1, pageSize: 1 })
            ]);

            setGlobalStats({
                totalCost,
                totalCount: totalRes.total || 0,
                completedCount: completedRes.total || 0,
                underMaintenanceCount: underMaintRes.total || 0
            });
        } catch (err) {
            console.error("Failed to load stats:", err);
        }
    };

    useEffect(() => {
        const loadVehicles = async () => {
            try {
                const vehicleResult = await getVehicles({
                    minPrice: 0,
                    maxPrice: 0,
                    typeId: 0,
                    status: null,
                    minPassengers: 0,
                    pageNumber: 1,
                    pageSize: 100,
                });
                setVehicles(vehicleResult.data || []);
            } catch (vErr) {
                console.error("Failed to load real vehicles. Falling back to mock fleet list.", vErr);
                setVehicles([
                    { id: 1, brand: { name: "Toyota" }, model: "Prius", registrationNumber: "WP-KN-4589" },
                    { id: 2, brand: { name: "Honda" }, model: "Civic", registrationNumber: "WP-CB-8822" },
                    { id: 3, brand: { name: "Nissan" }, model: "X-Trail", registrationNumber: "WP-PE-1234" },
                    { id: 4, brand: { name: "Suzuki" }, model: "Wagon R", registrationNumber: "WP-LH-5566" },
                ]);
            }
        };

        loadVehicles();
        fetchStats();
    }, []);

    useEffect(() => {
        fetchRecords();
    }, [pageNumber, selectedVehicleId, selectedMonth, statusFilter]);

    const handleOpenAdd = () => {
        setSelectedRecord(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (record) => {
        setSelectedRecord(record);
        setIsFormOpen(true);
    };

    const handleOpenView = (record) => {
        setSelectedRecord(record);
        setIsViewOpen(true);
    };

    const handleOpenDelete = (record) => {
        setSelectedRecord(record);
        setIsDeleteOpen(true);
    };

    const handleSave = async (recordPayload) => {
        try {
            setIsFormOpen(false);
            setIsLoading(true);

            await saveMaintenanceRecord(recordPayload);

            showToast(selectedRecord ? "Maintenance log updated successfully!" : "Vehicle Maintenance Added");
            await fetchRecords();
            await fetchStats();
        } catch (err) {
            const serverMessage = err.response?.data?.message || err.message || "Failed to save maintenance record.";
            showToast(serverMessage, "error");
        } finally {
            setIsLoading(false);
            setSelectedRecord(null);
        }
    };

    const handleDelete = async () => {
        if (!selectedRecord) return;
        try {
            setIsDeleteOpen(false);
            setIsLoading(true);

            await deleteMaintenanceRecord(selectedRecord.id);

            showToast("Maintenance record successfully deleted.", "error");
            await fetchRecords();
            await fetchStats();
        } catch (err) {
            showToast("Failed to delete maintenance record.", "error");
        } finally {
            setIsLoading(false);
            setSelectedRecord(null);
        }
    };



    // Filter Logic
    const filteredRecords = records.filter((r) => {
        const q = searchQuery.toLowerCase().trim();
        if (!q) return true;
        const regMatch = r.vehicleRegistrationNumber ? r.vehicleRegistrationNumber.toLowerCase().includes(q) : false;
        const vehicleNameMatch = r.vehicleName ? r.vehicleName.toLowerCase().includes(q) : false;
        const descMatch = (r.description || "").toLowerCase().includes(q);
        const typeMatch = (r.type || "").toLowerCase().includes(q);
        return regMatch || vehicleNameMatch || descMatch || typeMatch;
    });

    return (
        <div className="p-4 md:p-8 min-h-[calc(100vh-80px)] space-y-8 bg-surface">
            {toast && <Toast type={toast.type} message={toast.message} />}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-secondary tracking-tight font-display mt-1">
                        Vehicle Maintenance
                    </h1>
                    <p className="text-muted text-sm mt-1">
                        Manage, record, and analyze your rental fleet servicing costs.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleOpenAdd}
                        className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-2xl bg-cta-gradient text-white font-semibold shadow-glow hover:opacity-95 active:scale-[0.98] transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Log Maintenance
                    </button>
                </div>
            </div>

            {/* Skeleton Loading State */}
            {isLoading && records.length === 0 ? (
                <div className="space-y-6">
                    {/* Stats Boxes Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-card rounded-3xl p-6 border border-border animate-pulse flex justify-between items-center h-24">
                                <div className="space-y-2.5">
                                    <div className="h-3 bg-slate-200 rounded w-20"></div>
                                    <div className="h-6 bg-slate-200 rounded w-28"></div>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-slate-200"></div>
                            </div>
                        ))}
                    </div>
                    {/* Chart Skeleton */}
                    <div className="bg-card border border-border rounded-3xl p-6 h-[260px] animate-pulse space-y-6 max-w-3xl mx-auto w-full">
                        <div className="flex justify-between items-center">
                            <div className="space-y-2">
                                <div className="h-4 bg-slate-200 rounded w-48"></div>
                                <div className="h-3 bg-slate-200 rounded w-64"></div>
                            </div>
                            <div className="h-8 bg-slate-200 rounded w-36"></div>
                        </div>
                        <div className="h-28 bg-slate-100 rounded-2xl w-full"></div>
                    </div>
                    {/* Donut Skeleton */}
                    <div className="bg-card border border-border rounded-3xl p-6 h-[220px] animate-pulse space-y-4 max-w-3xl mx-auto w-full">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-200"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-slate-200 rounded w-52"></div>
                                <div className="h-3 bg-slate-200 rounded w-40"></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="w-[140px] h-[140px] rounded-full bg-slate-100 shrink-0"></div>
                            <div className="flex-1 space-y-3">
                                {[1, 2, 3].map(i => <div key={i} className="h-10 bg-slate-100 rounded-2xl w-full"></div>)}
                            </div>
                        </div>
                    </div>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center max-w-xl mx-auto">
                    <p className="text-red-600 font-semibold">{error}</p>
                    <button
                        onClick={() => { fetchRecords(); fetchStats(); }}
                        className="mt-5 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold shadow-md transition hover:bg-primary-dark"
                    >
                        Retry Loading
                    </button>
                </div>
            ) : (
                <>
                    {/* Interactive Stats Cards — click to filter by status */}
                    <MaintenanceStats
                        records={records}
                        globalStats={globalStats}
                        activeStatusFilter={statusFilter}
                        onStatusFilterChange={(f) => {
                            setPageNumber(1);
                            setStatusFilter(f);
                        }}
                    />

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 gap-6">
                        {/* Monthly/Vehicle Bar Chart */}
                        <MaintenanceChart vehicles={vehicles} />
                    </div>

                    {/* Filters bar */}
                    <MaintenanceFilters
                        vehicles={vehicles}
                        selectedVehicleId={selectedVehicleId}
                        setSelectedVehicleId={(id) => {
                            setPageNumber(1);
                            setSelectedVehicleId(id);
                        }}
                        selectedMonth={selectedMonth}
                        setSelectedMonth={(m) => {
                            setPageNumber(1);
                            setSelectedMonth(m);
                        }}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                    />

                    {/* Records Table */}
                    {filteredRecords.length > 0 ? (
                        <>
                            <MaintenanceTable
                                records={filteredRecords}
                                vehicles={vehicles}
                                onEdit={handleOpenEdit}
                                onDelete={handleOpenDelete}
                                onView={handleOpenView}
                            />
                            <Pagination
                                currentPage={pageNumber}
                                totalPages={Math.ceil(totalRecords / pageSize)}
                                onPageChange={setPageNumber}
                                isLoading={isLoading}
                            />
                        </>
                    ) : (
                        <div className="bg-card border border-border rounded-3xl p-16 text-center shadow-card max-w-xl mx-auto">
                            <Wrench className="w-16 h-16 text-muted/50 mx-auto stroke-[1.5]" />
                            <h3 className="text-xl font-bold text-secondary mt-5">No Records Found</h3>
                            <p className="text-muted text-sm mt-2">
                                We couldn&rsquo;t find any maintenance records matching the selected search query and filters.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setPageNumber(1);
                                    setSelectedVehicleId("ALL");
                                    setSelectedMonth("ALL");
                                    setStatusFilter("ALL");
                                }}
                                className="mt-6 px-5 py-2.5 rounded-xl border border-border text-secondary hover:bg-slate-50 font-semibold transition active:scale-[0.98]"
                            >
                                Clear Active Filters
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Form Modal */}
            {isFormOpen && (
                <MaintenanceFormModal
                    record={selectedRecord}
                    vehicles={vehicles}
                    onSave={handleSave}
                    onClose={() => {
                        setIsFormOpen(false);
                        setSelectedRecord(null);
                    }}
                />
            )}

            {/* View Modal */}
            {isViewOpen && (
                <MaintenanceViewModal
                    record={selectedRecord}
                    onClose={() => {
                        setIsViewOpen(false);
                        setSelectedRecord(null);
                    }}
                />
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteOpen && (
                <MaintenanceDeleteModal
                    record={selectedRecord}
                    onConfirm={handleDelete}
                    onCancel={() => {
                        setIsDeleteOpen(false);
                        setSelectedRecord(null);
                    }}
                />
            )}
        </div>
    );
}