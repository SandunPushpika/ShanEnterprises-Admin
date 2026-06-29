import React from "react";
import { Phone, Mail, IdCard, Check, ShieldAlert, UserCheck, Ban, Eye } from "lucide-react";

function DriverCard({ driver, onApprove, onReject, onView }) {
    const isPending = driver.status === "Pending";
    const isApproved = driver.status === "Approved";
    const isBlocked = driver.status === "Blocked" || driver.status === "Rejected";

    return (
        <div className="group bg-card border border-border rounded-3xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 flex flex-col justify-between p-6">
            <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Check className="w-6 h-6" />
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
                    className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${
                        isPending
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : isApproved
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                >
                    {driver.status}
                </span>
            </div>

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
            </div>

            <div className="flex gap-2.5 mt-5 pt-4 border-t border-border/60">
                {/* View button — always visible */}
                <button
                    onClick={() => onView && onView(driver)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl border border-primary/30 bg-primary-light text-primary hover:bg-primary/10 font-semibold text-xs transition active:scale-[0.98]"
                    aria-label={`View ${driver.name}`}
                >
                    <Eye className="w-4 h-4" />
                    View
                </button>

                {isPending && (
                    <>
                        <button
                            onClick={() => onApprove(driver.id)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-xs transition active:scale-[0.98]"
                        >
                            <UserCheck className="w-4 h-4" />
                            Approve
                        </button>
                        <button
                            onClick={() => onReject(driver.id)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold text-xs transition active:scale-[0.98]"
                        >
                            <Ban className="w-4 h-4" />
                            Reject
                        </button>
                    </>
                )}

                {isApproved && (
                    <button
                        onClick={() => onReject(driver.id)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold text-xs transition active:scale-[0.98]"
                    >
                        <ShieldAlert className="w-4 h-4" />
                        Block
                    </button>
                )}

                {isBlocked && (
                    <button
                        onClick={() => onApprove(driver.id)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-xs transition active:scale-[0.98]"
                    >
                        <UserCheck className="w-4 h-4" />
                        Unblock
                    </button>
                )}
            </div>
        </div>
    );
}

export default DriverCard;