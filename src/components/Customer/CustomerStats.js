import React from "react";
import { Users, UserCheck, UserX, BadgeCheck } from "lucide-react";

function CustomerStats({ stats, customers = [] }) {
    const total = stats?.total ?? customers.length;
    const active = stats?.active ?? customers.filter(c => c.status === "ACTIVE").length;
    const inactive = stats?.inactive ?? customers.filter(c => c.status === "INACTIVE" || c.status === "SUSPENDED").length;
    const verified = stats?.verified ?? customers.filter(c => c.emailVerified).length;

    const statCards = [
        {
            title: "Total Customers",
            value: total,
            icon: <Users size={24} />,
            bg: "bg-blue-50 border border-blue-100",
            color: "text-blue-600",
        },
        {
            title: "Active Users",
            value: active,
            icon: <UserCheck size={24} />,
            bg: "bg-emerald-50 border border-emerald-100",
            color: "text-emerald-600",
        },
        {
            title: "Inactive Users",
            value: inactive,
            icon: <UserX size={24} />,
            bg: "bg-rose-50 border border-rose-100",
            color: "text-rose-600",
        },
        {
            title: "Verified Accounts",
            value: verified,
            icon: <BadgeCheck size={24} />,
            bg: "bg-amber-50 border border-amber-100",
            color: "text-amber-600",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {statCards.map((item, index) => (
                <div
                    key={index}
                    className="bg-card rounded-3xl border border-border p-6 shadow-card hover:shadow-soft transition-all duration-300"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-muted text-sm font-semibold tracking-wide uppercase text-xs">
                                {item.title}
                            </p>

                            <h2 className="text-3xl font-extrabold text-secondary mt-2">
                                {item.value}
                            </h2>
                        </div>

                        <div
                            className={`${item.bg} ${item.color} p-3.5 rounded-2xl`}
                        >
                            {item.icon}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CustomerStats;