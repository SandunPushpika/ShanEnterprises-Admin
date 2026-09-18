import React from "react";
import { createPortal } from "react-dom";
import {
    X,
    IdCard,
    Calendar,
    Star,
    Clock,
    UserCheck,
    ShieldCheck,
    Mail,
    Activity,
    CheckCircle2,
    ExternalLink,
    FileText,
    Ban,
    ShieldAlert,
    Loader2,
} from "lucide-react";

const STATUS_STYLES = {
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending:  "bg-amber-50   text-amber-700   border-amber-200",
    Blocked:  "bg-rose-50    text-rose-700    border-rose-200",
    Rejected: "bg-rose-50    text-rose-700    border-rose-200",
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

function formatStatus(status) {
    if (status === 0 || status === "PENDING") return "PENDING";
    if (status === 1 || status === "APPROVED") return "APPROVED";
    if (status === 2 || status === "REJECTED") return "REJECTED";
    if (status === 3 || status === "DEACTIVATED") return "DEACTIVATED";
    return String(status ?? "—");
}

function formatAvailability(avail) {
    if (avail === 0 || avail === "AVAILABLE" || avail === "Available") return "Available";
    if (avail === 1 || avail === "UNAVAILABLE" || avail === "Unavailable") return "Unavailable";
    if (avail === 2 || avail === "ON_TRIP" || avail === "On Trip") return "On Trip";
    return String(avail ?? "—");
}

function DriverDetailModal({ driver, onClose, onApprove, onReject, actionLoading = {} }) {
    if (!driver) return null;

    const statusStyle = STATUS_STYLES[driver.status] ?? STATUS_STYLES.Pending;
    const isPending   = driver.status === "Pending";
    const isApproved  = driver.status === "Approved";
    const isBlocked   = driver.status === "Blocked";
    const isLoading   = !!actionLoading[driver.id];

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
                            <Row icon={Mail} label="Email" value={driver.email} />
                        </div>
                    </Section>

                    {/* License */}
                    <Section title="License Details">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Row icon={IdCard}       label="License Number"      value={driver.license} />
                            <Row icon={Calendar}     label="License Expiry Date" value={fmt(driver.license_expiry_date)} />
                            <Row icon={Clock}        label="Years of Experience" value={
                                driver.years_of_experience != null
                                    ? `${driver.years_of_experience} yr${driver.years_of_experience !== 1 ? "s" : ""}`
                                    : null
                            } />
                            <Row icon={CheckCircle2} label="License Document"   value={driver.license_document_url ? "Uploaded ✓" : "Not uploaded"} />
                        </div>

                        {/* License document preview */}
                        {driver.license_document_url && (
                            <div className="mt-2">
                                <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">
                                    Document Preview
                                </p>
                                {/\.(jpg|jpeg|png|gif|webp)$/i.test(driver.license_document_url) ? (
                                    <div className="relative rounded-2xl overflow-hidden border border-border">
                                        <img
                                            src={driver.license_document_url}
                                            alt="License document"
                                            className="w-full max-h-48 object-cover"
                                        />
                                        <a
                                            href={driver.license_document_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-lg px-2.5 py-1 text-xs font-semibold text-secondary flex items-center gap-1 transition"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                            Open
                                        </a>
                                    </div>
                                ) : (
                                    <a
                                        href={driver.license_document_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-surface text-secondary hover:bg-slate-50 text-sm font-semibold transition"
                                    >
                                        <FileText className="w-4 h-4 text-primary" />
                                        View Document
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                )}
                            </div>
                        )}
                    </Section>

                    {/* Approval */}
                    <Section title="Approval Info">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Row icon={UserCheck}   label="Approved By" value={driver.approved_by ?? "—"} />
                            <Row icon={ShieldCheck} label="Approved At" value={fmt(driver.approved_at)} />
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

                {/* Footer — action buttons */}
                <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-3 bg-white shrink-0">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl border border-border text-secondary hover:bg-slate-50 font-semibold transition"
                    >
                        Close
                    </button>

                    <div className="flex gap-2">
                        {isPending && onApprove && (
                            <button
                                onClick={() => { onApprove(driver.id); onClose(); }}
                                disabled={isLoading}
                                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-sm transition disabled:opacity-60"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                                Approve
                            </button>
                        )}
                        {isPending && onReject && (
                            <button
                                onClick={() => { onReject(driver.id); onClose(); }}
                                disabled={isLoading}
                                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold text-sm transition disabled:opacity-60"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
                                Reject
                            </button>
                        )}
                        {isApproved && onReject && (
                            <button
                                onClick={() => { onReject(driver.id); onClose(); }}
                                disabled={isLoading}
                                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold text-sm transition disabled:opacity-60"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
                                Deactivate
                            </button>
                        )}
                        {isBlocked && onApprove && (
                            <button
                                onClick={() => { onApprove(driver.id); onClose(); }}
                                disabled={isLoading}
                                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-sm transition disabled:opacity-60"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                                Re-Approve
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default DriverDetailModal;
