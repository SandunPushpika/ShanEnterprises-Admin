import React from "react";
import { Calendar, Wrench } from "lucide-react";
import { createPortal } from "react-dom";

export default function MaintenanceViewModal({ record, onClose }) {
    if (!record) return null;

    const normalizeStatus = (status) => {
        if (status === 0 || status === "0" || status === "COMPLETED" || status === "Completed") return "Completed";
        if (status === 1 || status === "1" || status === "UNDER_MAINTENANCE" || status === "Under Maintenance") return "Under Maintenance";
        return status;
    };

    const vehicleName = record.vehicleName 
        ? `${record.vehicleName} (${record.vehicleRegistrationNumber})` 
        : `Vehicle ID: ${record.vehicleId}`;

    const start = record.maintenanceStart;
    const end = record.maintenanceEnd;

    const formatDate = (d) => {
        if (!d) return "—";
        try {
            return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        } catch (err) {
            return d;
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <div className="fixed inset-0 bg-secondary/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-glow p-6 mx-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-secondary/80" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-secondary">{vehicleName}</h3>
                        <p className="text-xs text-muted mt-0.5">Maintenance Details</p>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-2 text-muted">
                        <Calendar className="w-4 h-4 text-primary/60" />
                        <div className="text-sm">
                            <strong>From:</strong> {formatDate(start)} <span className="mx-2">—</span> <strong>To:</strong> {formatDate(end)}
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-surface border border-border">

                        <p className="text-xs text-muted mt-2">
                            <strong className="text-secondary">Cost:</strong> LKR {Number(record.cost || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-muted mt-2">
                            <strong className="text-secondary">Status:</strong> {normalizeStatus(record.status)}
                        </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-surface border border-border text-sm">
                        <strong className="text-secondary">Description</strong>
                        <p className="text-muted mt-2">{record.description || "—"}</p>
                    </div>
                </div>

                <div className="mt-5 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl border border-border text-secondary hover:bg-slate-50 font-semibold transition active:scale-[0.98]"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
