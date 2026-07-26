import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
    X,
    UserCheck,
    UserX,
    Loader2,
    ShieldAlert,
    CheckCircle2,
    Award,
    Star,
    Search,
    User,
} from "lucide-react";
import { searchDrivers } from "../../services/DriverService";

function AssignDriverModal({ booking, onClose, onSave }) {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery]   = useState("");

    // Determine initial selection: if booking has driver_id or driver_name
    const [selectedDriverId, setSelectedDriverId] = useState(booking?.driver_id ?? null);

    useEffect(() => {
        const fetchApprovedDrivers = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await searchDrivers({ status: "APPROVED", pageNumber: 1, pageSize: 100 });
                setDrivers(data?.data ?? []);
            } catch (err) {
                console.error("Failed to load approved drivers:", err);
                setError("Failed to load approved drivers.");
            } finally {
                setLoading(false);
            }
        };

        fetchApprovedDrivers();
    }, []);

    const handleConfirm = async () => {
        setSaving(true);
        setError(null);
        await onSave(booking.id, selectedDriverId);
        setSaving(false);
    };

    const filteredDrivers = drivers.filter((d) => {
        const q = searchQuery.toLowerCase().trim();
        if (!q) return true;
        return (
            d.driverName?.toLowerCase().includes(q) ||
            d.licenseNumber?.toLowerCase().includes(q) ||
            d.userEmail?.toLowerCase().includes(q)
        );
    });

    if (!booking) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-secondary/40 backdrop-blur-sm" onClick={() => !saving && onClose()} />

            {/* Modal */}
            <div
                role="dialog"
                aria-modal="true"
                className="relative z-10 w-full max-w-xl bg-white rounded-3xl shadow-glow overflow-hidden flex flex-col max-h-[90vh] mx-4 border border-border"
            >
                {/* Header */}
                <div className="bg-cta-gradient px-6 py-5 flex items-start justify-between shrink-0">
                    <div>
                        <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest">
                            Manage Booking Driver
                        </p>
                        <h3 className="text-xl font-extrabold text-white mt-1">
                            Assign / Remove Driver
                        </h3>
                        <p className="text-xs text-white/70 mt-0.5 font-medium">
                            Ref: {booking.booking_reference} — {booking.vehicle_name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={saving}
                        className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition disabled:opacity-60"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto space-y-4 flex-1">
                    {/* Error Banner */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl p-3 flex items-center gap-2">
                            <ShieldAlert size={16} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Search Bar */}
                    <div className="relative">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search driver by name, license..."
                            className="w-full bg-surface border border-border rounded-2xl pl-10 pr-4 py-2.5 text-xs text-dark outline-none focus:border-primary transition"
                        />
                    </div>

                    {/* Driver List */}
                    <div className="space-y-2">
                        {/* Option: Remove Driver / Self-Drive */}
                        <div
                            onClick={() => setSelectedDriverId(null)}
                            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                                selectedDriverId === null
                                    ? "border-rose-500 bg-rose-50/50 shadow-sm"
                                    : "border-border hover:border-muted bg-surface"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                                    selectedDriverId === null ? "bg-rose-500 text-white" : "bg-slate-200 text-slate-600"
                                }`}>
                                    <UserX size={18} />
                                </div>
                                <div>
                                    <p className="font-bold text-secondary text-xs">No Driver (Self-Drive)</p>
                                    <p className="text-[11px] text-muted">Remove driver assignment from this booking</p>
                                </div>
                            </div>
                            {selectedDriverId === null && (
                                <CheckCircle2 size={18} className="text-rose-500 shrink-0" />
                            )}
                        </div>

                        {/* Driver Options */}
                        {loading ? (
                            <div className="py-12 text-center text-muted flex items-center justify-center gap-2">
                                <Loader2 size={18} className="animate-spin text-primary" />
                                <span className="text-xs">Loading approved drivers...</span>
                            </div>
                        ) : filteredDrivers.length === 0 ? (
                            <div className="py-8 text-center text-muted text-xs">
                                No approved drivers found matching search.
                            </div>
                        ) : (
                            filteredDrivers.map((driver) => {
                                const isSelected = selectedDriverId === driver.id;
                                return (
                                    <div
                                        key={driver.id}
                                        onClick={() => setSelectedDriverId(driver.id)}
                                        className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                                            isSelected
                                                ? "border-primary bg-primary-light/30 shadow-sm"
                                                : "border-border hover:border-primary/50 bg-white"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                                isSelected ? "bg-primary text-white" : "bg-primary-light text-primary"
                                            }`}>
                                                <User size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-secondary text-xs truncate">
                                                    {driver.driverName}
                                                </p>
                                                <div className="flex items-center gap-2 text-[11px] text-muted mt-0.5">
                                                    <span>{driver.licenseNumber}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-0.5 text-amber-600 font-medium">
                                                        <Award size={11} /> {driver.yearsOfExperience}y exp
                                                    </span>
                                                    {driver.averageRating > 0 && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-0.5 text-amber-500 font-medium">
                                                                <Star size={11} className="fill-amber-400" /> {Number(driver.averageRating).toFixed(1)}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {isSelected && (
                                            <CheckCircle2 size={18} className="text-primary shrink-0" />
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-3 bg-white shrink-0">
                    <button
                        onClick={onClose}
                        disabled={saving}
                        className="px-4 py-2 rounded-xl border border-border text-secondary text-xs font-semibold hover:bg-slate-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={saving || loading}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-cta-gradient text-white text-xs font-bold shadow-glow hover:opacity-95 transition disabled:opacity-60"
                    >
                        {saving ? (
                            <>
                                <Loader2 size={15} className="animate-spin" />
                                Saving Assignment...
                            </>
                        ) : (
                            <>
                                <UserCheck size={15} />
                                Save Driver Assignment
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default AssignDriverModal;
