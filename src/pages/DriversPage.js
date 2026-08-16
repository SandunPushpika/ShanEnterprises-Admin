import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DriverStats from "../components/Drivers/DriverStats";
import DriverList from "../components/Drivers/DriverList";
import DriverDetailModal from "../components/Drivers/DriverDetailModal";
import SearchBar from "../components/common/Searchbar";
import Toast from "../components/common/Toast";
import { UserX, RefreshCw, Loader2 } from "lucide-react";
import {
    searchDrivers,
    approveDriver,
    rejectDriver,
} from "../services/DriverService";

// Map backend DriverStatus (string or integer) → display status ("Approved", "Pending", "Blocked")
const toDisplayStatus = (status) => {
    if (status === 1 || status === "APPROVED" || status === "Approved") return "Approved";
    if (status === 0 || status === "PENDING" || status === "Pending") return "Pending";
    if (
        status === 2 ||
        status === 3 ||
        status === "REJECTED" ||
        status === "DEACTIVATED" ||
        status === "Blocked"
    ) return "Blocked";
    return status ?? "Unknown";
};

// Map backend DriverStatus (string or integer) → string enum name ("APPROVED", "PENDING", "REJECTED", "DEACTIVATED")
const toStatusName = (status) => {
    if (status === 0 || status === "PENDING") return "PENDING";
    if (status === 1 || status === "APPROVED") return "APPROVED";
    if (status === 2 || status === "REJECTED") return "REJECTED";
    if (status === 3 || status === "DEACTIVATED") return "DEACTIVATED";
    return String(status ?? "—");
};

// Map backend AvailabilityStatus (string or integer) → human readable label ("Available", "Unavailable", "On Trip")
const toAvailabilityLabel = (availability) => {
    if (availability === 0 || availability === "AVAILABLE") return "Available";
    if (availability === 1 || availability === "UNAVAILABLE") return "Unavailable";
    if (availability === 2 || availability === "ON_TRIP") return "On Trip";
    return String(availability ?? "—");
};

// Map backend DriverResponse → shape expected by DriverCard / DriverDetailModal
const toUiDriver = (d) => ({
    id:                    d.id,
    name:                  d.driverName,
    email:                 d.userEmail,
    license:               d.licenseNumber,
    phone:                 null, // not in DTO – kept for UI compat
    status:                toDisplayStatus(d.driverStatus),
    // Pass through formatted fields for the modal
    license_expiry_date:   d.licenseExpiryDate,
    years_of_experience:   d.yearsOfExperience,
    license_document_url:  d.licenseDocumentUrl,
    average_rating:        d.averageRating,
    completed_rides:       d.completedRides,
    availability:          toAvailabilityLabel(d.availability),
    driver_status:         toStatusName(d.driverStatus),
    approved_by:           d.approvedBy,
    approved_at:           d.approvedAt,
    created_at:            d.createdAt,
    updated_at:            d.updatedAt,
});

const TABS = ["ALL", "APPROVED", "PENDING", "BLOCKED"];
const TAB_LABELS = {
    ALL:      "All Drivers",
    APPROVED: "Approved",
    PENDING:  "Pending",
    BLOCKED:  "Blocked / Rejected",
};

const PILL_ACTIVE = {
    ALL:      "bg-secondary   text-white border-secondary",
    APPROVED: "bg-emerald-600 text-white border-emerald-600",
    PENDING:  "bg-amber-500   text-white border-amber-500",
    BLOCKED:  "bg-rose-600    text-white border-rose-600",
};

// Map tab → backend status query param
const TAB_TO_STATUS = {
    ALL:      null,
    APPROVED: "APPROVED",
    PENDING:  "PENDING",
    BLOCKED:  null, // handled client-side (both REJECTED + DEACTIVATED)
};

export default function DriversPage() {
    const navigate = useNavigate();
    const [drivers, setDrivers]         = useState([]);
    const [loading, setLoading]         = useState(true);
    const [refreshing, setRefreshing]   = useState(false);
    const [error, setError]             = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab]     = useState("ALL");
    const [viewedDriver, setViewedDriver] = useState(null);

    const [toast, setToast]             = useState(null); // { type, message }
    const [actionLoading, setActionLoading] = useState({}); // { [driverId]: true }

    // ── Load drivers from API ──
    const loadDrivers = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        setError(null);

        try {
            // For BLOCKED tab we need both REJECTED + DEACTIVATED — fetch ALL then filter
            const status = TAB_TO_STATUS[activeTab];
            const data = await searchDrivers({
                status: activeTab === "BLOCKED" ? null : status,
                pageNumber: 1,
                pageSize: 100,
            });
            const mapped = (data?.data ?? []).map(toUiDriver);
            setDrivers(mapped);
        } catch (err) {
            console.error("Failed to load drivers:", err);
            setError("Failed to load drivers. Please try again.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [activeTab]);

    useEffect(() => {
        loadDrivers();
    }, [loadDrivers]);

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3500);
    };

    // ── Approve driver ──
    const handleApprove = async (driverId) => {
        setActionLoading((prev) => ({ ...prev, [driverId]: true }));
        const result = await approveDriver(driverId);
        setActionLoading((prev) => ({ ...prev, [driverId]: false }));

        if (result.success) {
            showToast("success", "Driver approved successfully.");
            // Optimistic local update
            setDrivers((prev) =>
                prev.map((d) => (d.id === driverId ? { ...d, status: "Approved", driver_status: "APPROVED" } : d))
            );
            // Update modal if open
            if (viewedDriver?.id === driverId) {
                setViewedDriver((prev) => ({ ...prev, status: "Approved", driver_status: "APPROVED" }));
            }
        } else {
            showToast("error", result.message || "Failed to approve driver.");
        }
    };

    // ── Reject / Deactivate driver ──
    const handleReject = async (driverId) => {
        setActionLoading((prev) => ({ ...prev, [driverId]: true }));
        const result = await rejectDriver(driverId);
        setActionLoading((prev) => ({ ...prev, [driverId]: false }));

        if (result.success) {
            showToast("success", "Driver rejected / deactivated successfully.");
            setDrivers((prev) =>
                prev.map((d) =>
                    d.id === driverId
                        ? { ...d, status: "Blocked", driver_status: d.driver_status === "PENDING" ? "REJECTED" : "DEACTIVATED" }
                        : d
                )
            );
            if (viewedDriver?.id === driverId) {
                setViewedDriver((prev) => ({
                    ...prev,
                    status: "Blocked",
                    driver_status: prev.driver_status === "PENDING" ? "REJECTED" : "DEACTIVATED",
                }));
            }
        } else {
            showToast("error", result.message || "Failed to reject driver.");
        }
    };

    const handleView = (driver) => setViewedDriver(driver);

    const handleViewTrips = (driverId) => {
        navigate(`/drivers/${driverId}/trips`);
    };

    // ── Client-side filtering ──
    const filteredDrivers = drivers.filter((driver) => {
        let matchesTab = false;
        if (activeTab === "ALL")      matchesTab = true;
        else if (activeTab === "APPROVED") matchesTab = driver.status === "Approved";
        else if (activeTab === "PENDING")  matchesTab = driver.status === "Pending";
        else if (activeTab === "BLOCKED")  matchesTab = driver.status === "Blocked";

        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
            !q ||
            [driver.name, driver.license, driver.email].some((field) =>
                field?.toLowerCase().includes(q)
            );

        return matchesTab && matchesSearch;
    });

    // ── Stats ──
    const total        = drivers.length;
    const pendingCount = drivers.filter((d) => d.status === "Pending").length;
    const approvedCount = drivers.filter((d) => d.status === "Approved").length;
    const blockedCount = drivers.filter((d) => d.status === "Blocked").length;

    return (
        <div className="p-4 md:p-8 min-h-[calc(100vh-80px)] space-y-8 bg-surface">
            {/* Toast notification */}
            {toast && <Toast type={toast.type} message={toast.message} />}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-secondary tracking-tight font-display">
                        Drivers
                    </h1>
                    <p className="text-muted text-sm mt-1">
                        Manage, verify, and monitor registered drivers
                    </p>
                </div>
                <button
                    onClick={() => loadDrivers(true)}
                    disabled={refreshing}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-white text-secondary hover:bg-slate-50 font-semibold text-sm transition disabled:opacity-60"
                >
                    {refreshing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <RefreshCw className="w-4 h-4" />
                    )}
                    Refresh
                </button>
            </div>

            {/* Stats */}
            <DriverStats
                total={total}
                pending={pendingCount}
                approved={approvedCount}
                blocked={blockedCount}
            />

            {/* Search and Tabs */}
            <div className="space-y-3">
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    placeholder="Search by name, license, or email…"
                />
                <div className="flex flex-wrap gap-2">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 rounded-full border text-xs font-bold transition ${
                                activeTab === tab
                                    ? PILL_ACTIVE[tab]
                                    : "bg-white border-border text-secondary hover:bg-slate-50"
                            }`}
                        >
                            {TAB_LABELS[tab]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : error ? (
                <div className="bg-card border border-border rounded-3xl p-12 text-center shadow-card max-w-xl mx-auto">
                    <UserX className="w-14 h-14 text-danger/50 mx-auto stroke-[1.5]" />
                    <h3 className="text-xl font-bold text-secondary mt-4">Failed to Load Drivers</h3>
                    <p className="text-muted text-sm mt-2">{error}</p>
                    <button
                        onClick={() => loadDrivers()}
                        className="mt-5 px-5 py-2.5 rounded-xl border border-border text-secondary hover:bg-slate-50 font-semibold transition"
                    >
                        Try Again
                    </button>
                </div>
            ) : filteredDrivers.length > 0 ? (
                <DriverList
                    drivers={filteredDrivers}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onView={handleView}
                    onViewTrips={handleViewTrips}
                    actionLoading={actionLoading}
                />
            ) : (
                <div className="bg-card border border-border rounded-3xl p-12 text-center shadow-card max-w-xl mx-auto mt-6">
                    <UserX className="w-16 h-16 text-muted/50 mx-auto stroke-[1.5]" />
                    <h3 className="text-xl font-bold text-secondary mt-5">No Drivers Found</h3>
                    <p className="text-muted text-sm mt-2">
                        {searchQuery
                            ? `No drivers match "${searchQuery}" in the ${TAB_LABELS[activeTab]} tab.`
                            : `No drivers in the ${TAB_LABELS[activeTab]} category.`}
                    </p>
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="mt-6 px-5 py-2.5 rounded-xl border border-border text-secondary hover:bg-slate-50 font-semibold transition"
                        >
                            Clear Search
                        </button>
                    )}
                </div>
            )}

            {/* Detail Modal */}
            {viewedDriver && (
                <DriverDetailModal
                    driver={viewedDriver}
                    onClose={() => setViewedDriver(null)}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    actionLoading={actionLoading}
                />
            )}
        </div>
    );
}