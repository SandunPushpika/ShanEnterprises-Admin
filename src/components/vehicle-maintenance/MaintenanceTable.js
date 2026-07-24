import React from "react";
import { Edit2, Trash2, Eye, Calendar } from "lucide-react";

export default function MaintenanceTable({ records, vehicles, onEdit, onDelete, onView }) {
    const normalizeStatus = (status) => {
        if (status === 0 || status === "0" || status === "COMPLETED" || status === "Completed") return "Completed";
        if (status === 1 || status === "1" || status === "UNDER_MAINTENANCE" || status === "Under Maintenance") return "Under Maintenance";
        return status;
    };

    const formatDate = (d) => {
        if (!d) return "—";
        try {
            return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        } catch {
            return d;
        }
    };

    const formatDateRange = (record) => {
        const start = record.maintenanceStart;
        const end = record.maintenanceEnd;
        if (!start) return "—";
        const s = formatDate(start);
        const e = formatDate(end);
        return `${s} — ${e}`;
    };

    // Sort by most recent first
    const sortedRecords = [...records].sort((a, b) => {
        const dateA = new Date(a.maintenanceStart || 0);
        const dateB = new Date(b.maintenanceStart || 0);
        return dateB - dateA;
    });

    return (
        <div className="bg-card border border-border rounded-3xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="border-b border-border bg-surface">
                            <th className="px-6 py-4 text-[11px] font-bold text-muted uppercase tracking-wider">Vehicle No.</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-muted uppercase tracking-wider">Period</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-muted uppercase tracking-wider">Description</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-muted uppercase tracking-wider text-right">Cost (LKR)</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-muted uppercase tracking-wider text-center">Status</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-muted uppercase tracking-wider text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedRecords.map((record, index) => {
                            const regNo = record.vehicleRegistrationNumber || "—";
                            const displayStatus = normalizeStatus(record.status);
                            const isCompleted = displayStatus === "Completed";
                            const cost = Number(record.cost) || 0;

                            return (
                                <tr
                                    key={record.id}
                                    className={`border-b border-border/60 hover:bg-slate-50/80 transition-colors duration-150 ${
                                        index % 2 === 0 ? "bg-white" : "bg-surface/30"
                                    }`}
                                >
                                    {/* Registration */}
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-muted tracking-wider uppercase">{regNo}</span>
                                    </td>

                                    {/* Period */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-muted text-xs">
                                            <Calendar className="w-3.5 h-3.5 text-primary/50 shrink-0" />
                                            <span>{formatDateRange(record)}</span>
                                        </div>
                                    </td>

                                    {/* Description */}
                                    <td className="px-6 py-4 max-w-[260px]">
                                        <p className="text-muted text-xs leading-relaxed line-clamp-2">
                                            {record.description || "—"}
                                        </p>
                                    </td>

                                    {/* Cost */}
                                    <td className="px-6 py-4 text-right">
                                        <span className="font-extrabold text-primary tracking-tight">
                                            {cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4 text-center">
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold border shadow-sm ${
                                                isCompleted
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                            }`}
                                        >
                                            {displayStatus}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <button
                                                onClick={() => onView && onView(record)}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-white text-secondary hover:bg-slate-100 transition active:scale-[0.95]"
                                                title="View details"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => onEdit(record)}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-primary/30 bg-primary-light text-primary hover:bg-primary/10 transition active:scale-[0.95]"
                                                title="Edit record"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => onDelete(record)}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition active:scale-[0.95]"
                                                title="Delete record"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
