import React from "react";
import { createPortal } from "react-dom";
import {
    X,
    Phone,
    Mail,
    MapPin,
    Hash,
    BadgeCheck,
    Calendar,
    Activity,
} from "lucide-react";

const STATUS_STYLES = {
    ACTIVE:    "bg-emerald-50 text-emerald-700 border-emerald-200",
    INACTIVE:  "bg-slate-50 text-slate-700 border-slate-200",
    SUSPENDED: "bg-rose-50 text-rose-700 border-rose-200",
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

function CustomerViewModal({ customer, onClose }) {
    if (!customer) return null;

    const statusStyle =
        STATUS_STYLES[customer.status] ?? STATUS_STYLES.INACTIVE;

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
                    <div className="flex items-center gap-4">
                        <img
                            src={`https://ui-avatars.com/api/?name=${customer.firstName}+${customer.lastName}&background=EFF6FF&color=2563EB&bold=true&size=128`}
                            className="w-16 h-16 rounded-2xl object-cover border border-white/20 shadow-sm"
                            alt={`${customer.firstName} ${customer.lastName}`}
                        />
                        <div>
                            <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest">
                                Customer Account
                            </p>
                            <h3 className="text-2xl font-extrabold text-white mt-1 tracking-wide">
                                {customer.firstName} {customer.lastName}
                            </h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span
                            className={`px-3.5 py-1.5 rounded-full border text-xs font-bold ${statusStyle}`}
                        >
                            {customer.status}
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
                    <Section title="Contact Info">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Row icon={Phone} label="Phone" value={customer.phoneNumber} />
                            <Row icon={Mail}  label="Email" value={customer.email} />
                        </div>
                    </Section>

                    {/* Locations */}
                    <Section title="Address Details">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Row icon={MapPin} label="City"    value={customer.city} />
                            <Row icon={MapPin} label="Address" value={customer.address} />
                        </div>
                    </Section>

                    {/* Identity & Verification */}
                    <Section title="Identity & Verification">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Row icon={Hash}      label="NIC / Passport" value={customer.nicPassportNumber} />
                            <Row icon={BadgeCheck} label="Email Verified" value={customer.emailVerified ? "Verified Account ✓" : "Verification Pending"} />
                        </div>
                    </Section>

                    {/* Record */}
                    <Section title="Account History">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Row icon={Calendar} label="Created At" value={fmt(customer.createdAt)} />
                            <Row icon={Calendar} label="Updated At" value={fmt(customer.updatedAt)} />
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

export default CustomerViewModal;