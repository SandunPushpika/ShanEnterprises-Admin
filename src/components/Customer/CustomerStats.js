import React from "react";
import { Users, UserCheck, UserX, BadgeCheck } from "lucide-react";

function CustomerStats({ customers }) {

    const total = customers.length;
    const active = customers.filter(c => c.status === "ACTIVE").length;
    const inactive = customers.filter(c => c.status === "INACTIVE").length;
    const verified = customers.filter(c => c.emailVerified).length;

    const stats = [
        { title: "Total", value: total, icon: <Users /> },
        { title: "Active", value: active, icon: <UserCheck /> },
        { title: "Inactive", value: inactive, icon: <UserX /> },
        { title: "Verified", value: verified, icon: <BadgeCheck /> },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {stats.map((s, i) => (
                <div key={i} className="bg-white p-5 rounded-xl shadow">
                    <div className="text-gray-500 text-sm">{s.title}</div>
                    <div className="text-2xl font-bold mt-2">{s.value}</div>
                    <div className="mt-3 text-primary">{s.icon}</div>
                </div>
            ))}
        </div>
    );
}

export default CustomerStats;