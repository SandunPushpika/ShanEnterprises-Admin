import React from "react";
import { Eye, Phone, MapPin, Mail, UserCheck, UserX } from "lucide-react";

function CustomerTable({ customers, onView, onActivate, onDeactivate }) {
    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        try {
            return new Date(dateStr).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="bg-card border border-border rounded-3xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-border bg-surface">
                            <th className="px-6 py-4 text-[11px] font-bold text-muted uppercase tracking-wider">
                                Customer
                            </th>
                            <th className="px-6 py-4 text-[11px] font-bold text-muted uppercase tracking-wider">
                                Contact & Location
                            </th>
                            <th className="px-6 py-4 text-[11px] font-bold text-muted uppercase tracking-wider">
                                Joined Date
                            </th>
                            <th className="px-6 py-4 text-[11px] font-bold text-muted uppercase tracking-wider text-center">
                                Status
                            </th>
                            <th className="px-6 py-4 text-[11px] font-bold text-muted uppercase tracking-wider text-center">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                        {customers.map((customer, index) => {
                            const isActive = customer.status === "ACTIVE";
                            const isInactive = customer.status === "INACTIVE";
                            const avatarUrl =
                                customer.profileImageUrl ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    `${customer.firstName} ${customer.lastName}`
                                )}&background=EFF6FF&color=2563EB&bold=true`;

                            return (
                                <tr
                                    key={customer.id}
                                    className={`hover:bg-slate-50/80 transition-colors duration-150 ${
                                        index % 2 === 0 ? "bg-white" : "bg-surface/20"
                                    }`}
                                >
                                    {/* Customer Info */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={avatarUrl}
                                                alt={`${customer.firstName} ${customer.lastName}`}
                                                className="w-10 h-10 rounded-xl object-cover border border-primary/10 shadow-sm shrink-0"
                                            />
                                            <div className="min-w-0">
                                                <p className="font-bold text-secondary text-sm tracking-tight truncate">
                                                    {customer.firstName} {customer.lastName}
                                                </p>
                                                <div className="flex items-center gap-1 text-xs text-muted font-medium mt-0.5">
                                                    <Mail className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                                                    <span className="truncate max-w-[170px]">
                                                        {customer.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Contact & Location */}
                                    <td className="px-6 py-4">
                                        <div className="space-y-1 text-xs">
                                            {customer.phoneNumber ? (
                                                <div className="flex items-center gap-1.5 text-secondary font-medium">
                                                    <Phone className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                                                    <span>{customer.phoneNumber}</span>
                                                </div>
                                            ) : (
                                                <span className="text-muted">—</span>
                                            )}
                                            {customer.city && (
                                                <div className="flex items-center gap-1.5 text-muted">
                                                    <MapPin className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                                                    <span className="truncate max-w-[150px]">
                                                        {customer.city}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    {/* Joined Date */}
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-muted font-medium">
                                            {formatDate(customer.createdAt)}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4 text-center">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border shadow-sm ${
                                                isActive
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                    : isInactive
                                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                                    : "bg-rose-50 text-rose-700 border-rose-200"
                                            }`}
                                        >
                                            <span
                                                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                                    isActive
                                                        ? "bg-emerald-500"
                                                        : isInactive
                                                        ? "bg-amber-500"
                                                        : "bg-rose-500"
                                                }`}
                                            />
                                            {customer.status}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => onView && onView(customer)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-primary/30 bg-primary-light text-primary hover:bg-primary/15 font-semibold text-xs transition active:scale-[0.98]"
                                                aria-label={`View ${customer.firstName}`}
                                                title="View Profile"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                <span>View</span>
                                            </button>

                                            {isActive ? (
                                                <button
                                                    onClick={() =>
                                                        onDeactivate && onDeactivate(customer.id)
                                                    }
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold text-xs transition active:scale-[0.98]"
                                                    aria-label={`Deactivate ${customer.firstName}`}
                                                    title="Deactivate Customer"
                                                >
                                                    <UserX className="w-3.5 h-3.5" />
                                                    <span>Deactivate</span>
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        onActivate && onActivate(customer.id)
                                                    }
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-xs transition active:scale-[0.98]"
                                                    aria-label={`Activate ${customer.firstName}`}
                                                    title="Activate Customer"
                                                >
                                                    <UserCheck className="w-3.5 h-3.5" />
                                                    <span>Activate</span>
                                                </button>
                                            )}
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

export default CustomerTable;
