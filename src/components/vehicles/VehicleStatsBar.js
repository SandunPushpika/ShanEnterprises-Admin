import React from "react";
import { CarFront, CheckCircle2, Layers, Wrench } from "lucide-react";

function VehicleStatsBar({ total, available, rented, maintenance }) {
    const stats = [
        { title: "Total Fleet", value: total, icon: CarFront, color: "text-primary bg-primary-light" },
        { title: "Available", value: available, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
        { title: "Active Rentals", value: rented, icon: Layers, color: "text-amber-600 bg-amber-50" },
        { title: "In Repair", value: maintenance, icon: Wrench, color: "text-rose-600 bg-rose-50" },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {stats.map((m, i) => (
                <div
                    key={i}
                    className="bg-card border border-border rounded-2xl p-5 shadow-card flex items-center justify-between hover:-translate-y-0.5 hover:shadow-soft transition-all"
                >
                    <div>
                        <p className="text-xs font-semibold text-muted tracking-wider uppercase">{m.title}</p>
                        <h3 className="text-3xl font-bold text-secondary mt-2">{m.value}</h3>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${m.color}`}>
                        <m.icon className="w-6 h-6" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default VehicleStatsBar;