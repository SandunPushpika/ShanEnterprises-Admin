import React from "react";
import { Wrench, CheckCircle, Clock, CreditCard } from "lucide-react";

export default function MaintenanceStats({ records = [], globalStats, activeStatusFilter, onStatusFilterChange }) {
    const normalizeStatus = (status) => {
        if (status === 0 || status === "0" || status === "COMPLETED" || status === "Completed") return "Completed";
        if (status === 1 || status === "1" || status === "UNDER_MAINTENANCE" || status === "Under Maintenance") return "Under Maintenance";
        return status;
    };

    const totalCount = globalStats ? globalStats.totalCount : records.length;
    const completedCount = globalStats ? globalStats.completedCount : records.filter((r) => normalizeStatus(r.status) === "Completed").length;
    const underMaintenanceCount = globalStats ? globalStats.underMaintenanceCount : records.filter((r) => normalizeStatus(r.status) === "Under Maintenance").length;
    
    const totalCost = globalStats ? globalStats.totalCost : records.reduce((sum, r) => sum + (Number(r.cost) || 0), 0);

    const stats = [
        {
            title: "Total Expenses",
            value: `LKR ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: <CreditCard size={24} />,
            bg: "bg-blue-50 border border-blue-100",
            color: "text-blue-600",
            filterKey: "ALL",
            ringColor: "ring-blue-400",
        },
        {
            title: "Maintenance Logs",
            value: totalCount,
            icon: <Wrench size={24} />,
            bg: "bg-amber-50 border border-amber-100",
            color: "text-amber-600",
            filterKey: "ALL",
            ringColor: "ring-amber-400",
        },
        {
            title: "Completed Services",
            value: completedCount,
            icon: <CheckCircle size={24} />,
            bg: "bg-emerald-50 border border-emerald-100",
            color: "text-emerald-600",
            filterKey: "Completed",
            ringColor: "ring-emerald-400",
        },
        {
            title: "Under Maintenance",
            value: underMaintenanceCount,
            icon: <Clock size={24} />,
            bg: "bg-rose-50 border border-rose-100",
            color: "text-rose-600",
            filterKey: "Under Maintenance",
            ringColor: "ring-rose-400",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((item, index) => {
                const isActive = activeStatusFilter === item.filterKey;
                return (
                    <button
                        key={index}
                        type="button"
                        onClick={() => onStatusFilterChange(item.filterKey)}
                        className="bg-card rounded-3xl border border-border p-6 shadow-card hover:shadow-soft transition-all duration-300 text-left cursor-pointer"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                    <p className="text-muted text-sm font-semibold tracking-wide uppercase">
                                    {item.title}
                                </p>
                                <h2 className="text-3xl font-extrabold text-secondary mt-2">
                                    {item.value}
                                </h2>
                            </div>
                            <div className={`${item.bg} ${item.color} p-3.5 rounded-2xl`}>
                                {item.icon}
                            </div>
                        </div>
                        {isActive && item.filterKey !== "ALL" && (
                            <p className="text-[10px] font-bold text-primary mt-2 uppercase tracking-wider">
                                ● Filtering active
                            </p>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
