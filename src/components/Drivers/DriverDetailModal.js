import React from "react";
import { createPortal } from "react-dom";
import {
    X,
    IdCard,
    Calendar,
    Star,
    Car,
    Clock,
    UserCheck,
    ShieldCheck,
    Phone,
    Mail,
    Activity,
    CheckCircle2,
} from "lucide-react";

const STATUS_STYLES = {
    Approved:  "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending:   "bg-amber-50   text-amber-700   border-amber-200",
    Blocked:   "bg-rose-50    text-rose-700    border-rose-200",
    Rejected:  "bg-rose-50    text-rose-700    border-rose-200",
};

function fmt(dt) {
    if (!dt) return "—";
    return new Date(dt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function Row({ icon: Icon, label, value }) {
    if (!value && value !== 0) return null;
    return (
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-primary" />
            </div>
            <div>
                <p className="text-[11px] font-bold text-muted uppercase tracking-wider">
                    {label}
                </p>
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

function DriverDetailModal({ driver, onClose }) {
    if (!driver) return null;

    const statusStyle =
        STATUS_STYLES[driver.status] ?? STATUS_STYLES.Pending;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-secondary/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal panel */}
            <div
                role="dialog"
                aria-modal="true"
                className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-glow overflow-hidden flex flex-col max-h-[90vh] mx-4"
            >
                {/* Gradient header */}
                <div className="bg-cta-gradient px-6 py-5 flex items-start justify-between shrink-0">
                    <div>
                        <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest">
                            Driver Profile
                        </p>
                        <h3 className="text-2xl font-extrabold text-white mt-1 tracking-wide">
                            {driver.name}
                        </h3>
                        {driver.license && (
                            <p className="text-white/70 text-xs mt-1 font-medium">
                                {driver.license}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <span
                            className={`px-3.5 py-1.5 rounded-full border text-xs font-bold ${statusStyle}`}
                        >
                            {driver.status}
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

                {/* Scrollable body */}
                <div className="overflow-y-auto p-6 space-y-6 flex-1">

                    {/* Contact */}
                    <Section title="Contact Information">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Row icon={Phone} label="Phone"       value={driver.phone} />
                            <Row icon={Mail}  label="Email"       value={driver.email} />
                        </div>
                    </Section>

                    {/* License */}
                    <Section title="License Details">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Row icon={IdCard}    label="License Number"      value={driver.license} />
                            <Row icon={Calendar}  label="License Expiry Date" value={fmt(driver.license_expiry_date)} />
                            <Row icon={Clock}     label="Years of Experience" value={driver.years_of_experience != null ? `${driver.years_of_experience} yr${driver.years_of_experience !== 1 ? "s" : ""}` : null} />
                            <Row icon={CheckCircle2} label="License Document" value={driver.license_document_url ? "Uploaded ✓" : "Not uploaded"} />
                        </div>
                    </Section>

                    {/* Performance */}
                    <Section title="Performance">
                        <div className="bg-surface rounded-2xl border border-border p-4 grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                            {[
                                ["Average Rating",   driver.average_rating != null ? `${Number(driver.average_rating).toFixed(1)} / 5.0` : "—"],
                                ["Completed Rides",  driver.completed_rides ?? "—"],
                                ["Availability",     driver.availability ?? "—"],
                                ["Driver Status",    driver.driver_status  ?? "—"],
                            ].map(([label, val]) => (
                                <div key={label}>
                                    <p className="text-[11px] font-bold text-muted uppercase tracking-wider">
                                        {label}
                                    </p>
                                    <p className="font-semibold text-secondary mt-0.5">{val}</p>
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* Approval */}
                    <Section title="Approval Info">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Row icon={UserCheck}   label="Approved By"  value={driver.approved_by  ?? "—"} />
                            <Row icon={ShieldCheck} label="Approved At"  value={fmt(driver.approved_at)} />
                        </div>
                    </Section>

                    {/* Timestamps */}
                    <Section title="Record">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Row icon={Activity} label="Created At" value={fmt(driver.created_at)} />
                            <Row icon={Activity} label="Updated At" value={fmt(driver.updated_at)} />
                        </div>
                    </Section>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border flex items-center justify-end bg-white shrink-0">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl border border-border text-secondary hover:bg-slate-50 font-semibold transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default DriverDetailModal;
