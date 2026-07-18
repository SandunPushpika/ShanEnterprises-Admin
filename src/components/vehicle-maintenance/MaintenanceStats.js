import React from "react";
import { Wrench, CheckCircle, Clock, CreditCard } from "lucide-react";

export default function MaintenanceStats({ records = [], globalStats }) {
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
            title: "Total Expenses (LKR)",
            value: `${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: CreditCard,
            color: "text-blue-600 bg-blue-50",
            textSize: "text-xl sm:text-2xl",
        },
        {
            title: "Maintenance Logs",
            value: totalCount,
            icon: Wrench,
            color: "text-primary bg-primary-light",
        },
        {
            title: "Completed Services",
            value: completedCount,
            icon: CheckCircle,
            color: "text-emerald-600 bg-emerald-50",
        },
        {
            title: "Under Maintenance",
            value: underMaintenanceCount,
            icon: Clock,
            color: "text-rose-600 bg-rose-50",
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {stats.map((item, index) => {
                const IconComponent = item.icon;
                return (
                    <div
                        key={index}
                        className="bg-card border border-border rounded-2xl p-5 shadow-card flex items-center justify-between hover:-translate-y-0.5 hover:shadow-soft transition-all duration-300"
                    >
                        <div className="flex-1 min-w-0 pr-3">
                            <p className="text-xs font-semibold text-muted tracking-wider uppercase truncate">
                                {item.title}
                            </p>
                            <h3 className={`${item.textSize || "text-3xl"} font-bold text-secondary mt-2 truncate`}>
                                {item.value}
                            </h3>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                            <IconComponent className="w-6 h-6" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
