import React from "react";
import { createPortal } from "react-dom";
import {
    X, User, Car, UserCheck, MapPin, Calendar,
    DollarSign, FileText, Clock, AlertTriangle
} from "lucide-react";

const STATUS_STYLES = {
    PENDING: "bg-amber-50  text-amber-700  border-amber-200/60",
    CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    COMPLETED: "bg-blue-50   text-blue-700   border-blue-200/60",
    CANCELLED: "bg-rose-50   text-rose-700   border-rose-200/60",
};

function fmt(dt) {
    if (!dt) return "—";
    return new Date(dt).toLocaleString("en-US", {
        month: "short", day: "numeric", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

function Row({ icon: Icon, label, value, className = "" }) {
    if (!value) return null;
    return (
        <div className={`flex items-start gap-3 ${className}`}>
            <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-primary" />
            </div>
            <div>
                <p className="text-[11px] font-bold text-muted uppercase tracking-wider">{label}</p>
                <p className="text-sm font-medium text-secondary mt-0.5">{value}</p>
            </div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div className="space-y-4">
            <h4 className="text-xs font-bold text-muted uppercase tracking-widest border-b border-border pb-1">
                {title}
            </h4>
            {children}
        </div>
    );
}

function BookingDetailModal({ booking, onClose, onEdit, onAssignDriver }) {
    if (!booking) return null;
    const statusStyle = STATUS_STYLES[booking.booking_status] ?? STATUS_STYLES.PENDING;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <div className="fixed inset-0 bg-secondary/40 backdrop-blur-sm" onClick={onClose} />

            <div
                role="dialog"
                aria-modal="true"
                className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-glow overflow-hidden flex flex-col max-h-[90vh] mx-4"
            >
                <div className="bg-cta-gradient px-6 py-5 flex items-start justify-between shrink-0">
                    <div>
                        <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest">Booking Reference</p>
                        <h3 className="text-2xl font-extrabold text-white mt-1 tracking-wide">
                            {booking.booking_reference}
                        </h3>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`px-3.5 py-1.5 rounded-full border text-xs font-bold ${statusStyle}`}>
                            {booking.booking_status}
                        </span>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto p-6 space-y-6 flex-1">

                    <Section title="Parties">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Row icon={User} label="Customer" value={booking.customer_name} />
                            <Row icon={Car} label="Vehicle" value={booking.vehicle_name} />
                            <Row icon={UserCheck} label="Driver" value={booking.driver_name || (booking.with_driver ? "Assigned" : "Self-Drive / No Driver")} />
                        </div>
                    </Section>

                    <Section title="Locations">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Row icon={MapPin} label="Pickup Location" value={booking.pickup_location} />
                            <Row icon={MapPin} label="Drop-off Location" value={booking.dropoff_location} />
                        </div>
                    </Section>

                    <Section title="Schedule">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Row icon={Calendar} label="Pickup Date & Time" value={fmt(booking.pickup_datetime)} />
                            <Row icon={Calendar} label="Return Date & Time" value={fmt(booking.return_datetime)} />
                            {booking.rental_days && (
                                <Row icon={Clock} label="Rental Days" value={`${booking.rental_days} day${booking.rental_days > 1 ? "s" : ""}`} />
                            )}
                            {booking.estimated_distance_km && (
                                <Row icon={Clock} label="Est. Distance" value={`${booking.estimated_distance_km} km`} />
                            )}
                        </div>
                    </Section>

                    <Section title="Financials">
                        <div className="bg-surface rounded-2xl border border-border p-4 grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                            {[
                                ["Base Rental", `$${Number(booking.base_rental_cost || 0).toFixed(2)}`],
                                ["Driver Fee", `$${Number(booking.driver_fee || 0).toFixed(2)}`],
                                ["Tax", `$${Number(booking.tax_amount || 0).toFixed(2)}`],
                                ["Discount", `-$${Number(booking.discount_amount || 0).toFixed(2)}`],
                            ].map(([label, val]) => (
                                <div key={label}>
                                    <p className="text-[11px] font-bold text-muted uppercase tracking-wider">{label}</p>
                                    <p className="font-semibold text-secondary mt-0.5">{val}</p>
                                </div>
                            ))}
                            <div className="col-span-2 border-t border-border pt-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-primary" />
                                    <span className="font-bold text-secondary">Total Amount</span>
                                </div>
                                <span className="text-2xl font-extrabold text-primary">
                                    ${Number(booking.total_amount || 0).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </Section>

                    {booking.special_notes && (
                        <Section title="Notes">
                            <Row icon={FileText} label="Special Notes" value={booking.special_notes} />
                        </Section>
                    )}

                    {booking.booking_status === "CANCELLED" && booking.cancelled_reason && (
                        <Section title="Cancellation">
                            <Row icon={AlertTriangle} label="Cancellation Reason" value={booking.cancelled_reason} />
                        </Section>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-3 bg-white shrink-0">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl border border-border text-secondary hover:bg-slate-50 font-semibold transition"
                    >
                        Close
                    </button>
                    {(onAssignDriver && statusStyle == STATUS_STYLES.PENDING) && (
                        <button
                            onClick={() => {
                                onClose();
                                onAssignDriver(booking);
                            }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cta-gradient text-white font-semibold text-sm shadow-glow transition"
                        >
                            <UserCheck className="w-4 h-4" />
                            Manage Driver
                        </button>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}

export default BookingDetailModal;
