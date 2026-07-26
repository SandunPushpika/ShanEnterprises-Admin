import React from "react";
import { Eye, Trash2, Calendar, User, Car, DollarSign, CheckCircle, UserCheck } from "lucide-react";

const STATUS_STYLES = {
    PENDING: "bg-amber-50  text-amber-700  border-amber-200/60",
    CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    COMPLETED: "bg-blue-50   text-blue-700   border-blue-200/60",
    CANCELLED: "bg-rose-50   text-rose-700   border-rose-200/60",
};

function fmtDate(dt) {
    if (!dt) return "—";
    return new Date(dt).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    });
}

function BookingCard({ booking, onView, onCancel, onComplete, onAssignDriver }) {
    const isActionable = booking.booking_status !== "CANCELLED" && booking.booking_status !== "COMPLETED";

    return (
        <div className="group bg-card border border-border rounded-3xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 flex flex-col">

            <div className="bg-cta-gradient px-6 py-4 flex items-center justify-between">
                <div>
                    <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest">Booking Ref</p>
                    <p className="text-white font-bold text-base tracking-wide mt-0.5">{booking.booking_reference}</p>
                </div>
                <span className={`px-3.5 py-1.5 rounded-full border text-xs font-bold shadow-sm ${STATUS_STYLES[booking.booking_status] ?? STATUS_STYLES.PENDING}`}>
                    {booking.booking_status}
                </span>
            </div>

            <div className="p-6 flex-1 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted">
                    <User className="w-4 h-4 shrink-0 text-primary/70" />
                    <span className="font-semibold text-secondary truncate">{booking.customer_name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                    <Car className="w-4 h-4 shrink-0 text-primary/70" />
                    <span className="truncate">{booking.vehicle_name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                    <UserCheck className="w-4 h-4 shrink-0 text-primary/70" />
                    <span className="truncate">
                        Driver: <strong className="text-secondary">{booking.driver_name || (booking.with_driver ? "Assigned" : "No Driver")}</strong>
                    </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                    <Calendar className="w-4 h-4 shrink-0 text-primary/70" />
                    <span>{fmtDate(booking.pickup_datetime)} → {fmtDate(booking.return_datetime)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 shrink-0 text-primary/70" />
                    <span className="font-bold text-secondary">${Number(booking.total_amount).toFixed(2)}</span>
                    {booking.rental_days && (
                        <span className="text-muted text-xs">· {booking.rental_days} day{booking.rental_days > 1 ? "s" : ""}</span>
                    )}
                </div>
            </div>

            <div className="px-6 pb-6 pt-0 flex items-center gap-2">
                {isActionable ? (
                    <>
                        <button
                            onClick={() => onView(booking)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl border border-primary/30 bg-primary-light text-primary hover:bg-primary/10 font-semibold text-xs transition"
                            aria-label={`View booking ${booking.booking_reference}`}
                        >
                            <Eye className="w-3.5 h-3.5" />
                            View
                        </button>
                        {onAssignDriver && (
                            <button
                                onClick={() => onAssignDriver(booking)}
                                className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl border border-border bg-surface text-secondary hover:bg-slate-100 font-semibold text-xs transition"
                                title="Assign or Change Driver"
                            >
                                <UserCheck className="w-3.5 h-3.5 text-primary" />
                                Driver
                            </button>
                        )}
                        <button
                            onClick={() => onComplete(booking)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition"
                            aria-label={`Complete booking ${booking.booking_reference}`}
                        >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Complete
                        </button>
                        <button
                            onClick={() => onCancel(booking)}
                            className="w-10 h-10 inline-flex items-center justify-center rounded-xl border border-rose-200/50 bg-rose-50 text-rose-600 hover:bg-rose-100 transition shrink-0"
                            aria-label={`Cancel booking ${booking.booking_reference}`}
                            title={`Cancel booking ${booking.booking_reference}`}
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => onView(booking)}
                        className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-xl border border-primary/30 bg-primary-light text-primary hover:bg-primary/10 font-semibold text-sm transition"
                        aria-label={`View booking ${booking.booking_reference}`}
                    >
                        <Eye className="w-4 h-4" />
                        View Booking Details
                    </button>
                )}
            </div>
        </div>
    );
}

export default BookingCard;
