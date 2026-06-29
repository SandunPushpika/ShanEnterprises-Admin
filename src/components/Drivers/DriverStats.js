import React from "react";
import {
    FaUserTie,
    FaHourglassHalf,
    FaUserCheck,
    FaUserTimes,
} from "react-icons/fa";

function DriverStats({ total = 0, pending = 0, approved = 0, blocked = 0 }) {
    const stats = [
        {
            title: "Total Drivers",
            value: total,
            icon: <FaUserTie size={24} />,
            bg: "bg-blue-50 border border-blue-100",
            color: "text-blue-600",
        },
        {
            title: "Pending Approval",
            value: pending,
            icon: <FaHourglassHalf size={24} />,
            bg: "bg-amber-50 border border-amber-100",
            color: "text-amber-600",
        },
        {
            title: "Approved",
            value: approved,
            icon: <FaUserCheck size={24} />,
            bg: "bg-emerald-50 border border-emerald-100",
            color: "text-emerald-600",
        },
        {
            title: "Blocked",
            value: blocked,
            icon: <FaUserTimes size={24} />,
            bg: "bg-rose-50 border border-rose-100",
            color: "text-rose-600",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((item, index) => (
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

export default DriverStats;
