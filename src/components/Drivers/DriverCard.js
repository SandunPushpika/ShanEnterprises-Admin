import React from "react";
import {
    Phone,
    Mail,
    IdCard,
    ShieldAlert,
    UserCheck,
    Ban,
    Eye,
    Loader2,
    CheckCircle2,
    Clock3,
    XCircle,
} from "lucide-react";

const STATUS_BADGE = {
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending:  "bg-amber-50   text-amber-700   border-amber-200",
    Blocked:  "bg-rose-50    text-rose-700    border-rose-200",
};

const STATUS_ICON = {
    Approved: CheckCircle2,
    Pending:  Clock3,
    Blocked:  XCircle,
};

function DriverCard({ driver, onApprove, onReject, onView, actionLoading = {} }) {
    const isPending  = driver.status === "Pending";
    const isApproved = driver.status === "Approved";
    const isBlocked  = driver.status === "Blocked";
    const isLoading  = !!actionLoading[driver.id];

    const StatusIcon = STATUS_ICON[driver.status] ?? Clock3;

    return (
        <div className="group bg-card border border-border rounded-3xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 flex flex-col justify-between p-6">
            {/* Header */}
            <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                        {driver.name?.charAt(0)?.toUpperCase() ?? "D"}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-secondary tracking-tight">
                            {driver.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-muted font-medium mt-0.5">
                            <IdCard className="w-3.5 h-3.5 text-primary/70" />
                            <span>{driver.license}</span>
                        </div>
                    </div>
                </div>

                <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${
                        STATUS_BADGE[driver.status] ?? STATUS_BADGE.Pending
                    }`}
                >
                    <StatusIcon className="w-3 h-3" />
                    {driver.status}
                </span>
            </div>

            {/* Contact info */}
            <div className="space-y-2.5 my-3 text-sm">
                {driver.phone && (
                    <div className="flex items-center gap-2 text-muted">
                        <Phone className="w-4 h-4 text-primary/60 shrink-0" />
                        <span>{driver.phone}</span>
                    </div>
                )}
                {driver.email && (
                    <div className="flex items-center gap-2 text-muted">
                        <Mail className="w-4 h-4 text-primary/60 shrink-0" />
                        <span className="truncate">{driver.email}</span>
                    </div>
                )}
                {driver.years_of_experience != null && (
                    <div className="flex items-center gap-2 text-muted text-xs">
                        <span className="inline-flex items-center gap-1 bg-primary-light text-primary px-2 py-0.5 rounded-full font-semibold">
                            {driver.years_of_experience} yr{driver.years_of_experience !== 1 ? "s" : ""} exp.
                        </span>
                        {driver.average_rating > 0 && (
                            <span className="text-amber-500 font-semibold">
                                ⭐ {Number(driver.average_rating).toFixed(1)}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 mt-5 pt-4 border-t border-border/60">
                {/* View — always visible */}
                <button
                    onClick={() => onView && onView(driver)}
                    disabled={isLoading}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl border border-primary/30 bg-primary-light text-primary hover:bg-primary/10 font-semibold text-xs transition active:scale-[0.98] disabled:opacity-60"
                    aria-label={`View ${driver.name}`}
                >
                    <Eye className="w-4 h-4" />
                    View
                </button>

                {isPending && (
                    <>
                        <button
                            onClick={() => onApprove(driver.id)}
                            disabled={isLoading}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-xs transition active:scale-[0.98] disabled:opacity-60"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <UserCheck className="w-4 h-4" />
                            )}
                            Approve
                        </button>
                        <button
                            onClick={() => onReject(driver.id)}
                            disabled={isLoading}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold text-xs transition active:scale-[0.98] disabled:opacity-60"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Ban className="w-4 h-4" />
                            )}
                            Reject
                        </button>
                    </>
                )}

                {isApproved && (
                    <button
                        onClick={() => onReject(driver.id)}
                        disabled={isLoading}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold text-xs transition active:scale-[0.98] disabled:opacity-60"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <ShieldAlert className="w-4 h-4" />
                        )}
                        Deactivate
                    </button>
                )}

                {isBlocked && (
                    <button
                        onClick={() => onApprove(driver.id)}
                        disabled={isLoading}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-xs transition active:scale-[0.98] disabled:opacity-60"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <UserCheck className="w-4 h-4" />
                        )}
                        Re-Approve
                    </button>
                )}
            </div>
        </div>
    );
}

export default DriverCard;