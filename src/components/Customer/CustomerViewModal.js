import React from "react";
import { createPortal } from "react-dom";
import { Phone, MapPin, Hash, BadgeCheck, Calendar } from "lucide-react";
import Modal from "../common/Modal";

const STATUS_STYLES = {
    ACTIVE: "bg-emerald-50 text-emerald-700",
    INACTIVE: "bg-slate-100 text-slate-700",
    SUSPENDED: "bg-red-50 text-red-700",
};

function formatDate(dateString) {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function DetailRow({ icon: Icon, label, value }) {
    if (value === null || value === undefined) return null;
    return (
        <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-light flex items-center justify-center text-primary shrink-0">
                <Icon className="w-4 h-4" />
            </div>
            <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">{label}</p>
                <p className="text-sm font-medium text-secondary mt-1">{value}</p>
            </div>
        </div>
    );
}

function CustomerViewModal({ customer, onClose }) {
    if (!customer) return null;

    return createPortal(
        <Modal title="Customer Profile" subtitle={customer.email} onClose={onClose}>
            <div className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-border pb-5">
                    <img
                        src={`https://ui-avatars.com/api/?name=${customer.firstName}+${customer.lastName}&background=0056d6&color=fff&rounded=true&size=128`}
                        alt={`${customer.firstName} ${customer.lastName}`}
                        className="w-24 h-24 rounded-full border border-border"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-2xl font-bold text-secondary truncate">
                                {customer.firstName} {customer.lastName}
                            </h2>
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[customer.status] || "bg-slate-100 text-slate-700"}`}>
                                {customer.status}
                            </span>
                        </div>
                        <p className="text-sm text-muted mt-2">{customer.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailRow icon={Phone} label="Phone" value={customer.phoneNumber} />
                    <DetailRow icon={MapPin} label="City" value={customer.city} />
                    <DetailRow icon={MapPin} label="Address" value={customer.address} />
                    <DetailRow icon={Hash} label="NIC / Passport" value={customer.nicPassportNumber} />
                    <DetailRow icon={BadgeCheck} label="Email Verified" value={customer.emailVerified ? "Yes" : "No"} />
                    <DetailRow icon={Calendar} label="Created" value={formatDate(customer.createdAt)} />
                    <DetailRow icon={Calendar} label="Updated" value={formatDate(customer.updatedAt)} />
                </div>
            </div>
        </Modal>,
        document.body
    );
}

export default CustomerViewModal;