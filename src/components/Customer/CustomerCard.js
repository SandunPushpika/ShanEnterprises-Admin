import React from "react";
import { Eye, Phone, MapPin, Mail } from "lucide-react";

function CustomerCard({ customer, onView }) {
    const isActive = customer.status === "ACTIVE";
    const isInactive = customer.status === "INACTIVE";

    return (
        <div className="group bg-card border border-border rounded-3xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 flex flex-col justify-between p-6">
            <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <img
                        src={`https://ui-avatars.com/api/?name=${customer.firstName}+${customer.lastName}&background=EFF6FF&color=2563EB&bold=true`}
                        className="w-12 h-12 rounded-2xl object-cover border border-primary/10 shadow-sm"
                        alt={`${customer.firstName} ${customer.lastName}`}
                    />
                    <div>
                        <h3 className="text-lg font-bold text-secondary tracking-tight">
                            {customer.firstName} {customer.lastName}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-muted font-medium mt-0.5">
                            <Mail className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                            <span className="truncate max-w-[150px]">{customer.email}</span>
                        </div>
                    </div>
                </div>

                <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${
                        isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : isInactive
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                >
                    {customer.status}
                </span>
            </div>

            <div className="space-y-2.5 my-3 text-sm">
                {customer.phoneNumber && (
                    <div className="flex items-center gap-2 text-muted">
                        <Phone className="w-4 h-4 text-primary/60 shrink-0" />
                        <span>{customer.phoneNumber}</span>
                    </div>
                )}
                {customer.city && (
                    <div className="flex items-center gap-2 text-muted">
                        <MapPin className="w-4 h-4 text-primary/60 shrink-0" />
                        <span>{customer.city}</span>
                    </div>
                )}
            </div>

            <div className="flex gap-2.5 mt-5 pt-4 border-t border-border/60">
                <button
                    onClick={() => onView && onView(customer)}
                    className="w-full inline-flex items-center justify-center gap-1.5 h-10 rounded-xl border border-primary/30 bg-primary-light text-primary hover:bg-primary/10 font-semibold text-xs transition active:scale-[0.98]"
                    aria-label={`View ${customer.firstName}`}
                >
                    <Eye className="w-4 h-4" />
                    View Profile
                </button>
            </div>
        </div>
    );
}

export default CustomerCard;