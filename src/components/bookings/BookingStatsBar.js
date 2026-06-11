import React from "react";
import { CalendarClock, CheckCircle2, XCircle, Clock4 } from "lucide-react";

function BookingStatsBar({ total, confirmed, completed, pending, cancelled }) {
    const stats = [
        { title: "Total Bookings",  value: total,     icon: CalendarClock,  color: "text-primary bg-primary-light" },
        { title: "Confirmed",       value: confirmed,  icon: CheckCircle2,   color: "text-emerald-600 bg-emerald-50" },
        { title: "Completed",       value: completed,  icon: CheckCircle2,   color: "text-blue-600 bg-blue-50" },
        { title: "Pending",         value: pending,    icon: Clock4,         color: "text-amber-600 bg-amber-50" },
        { title: "Cancelled",       value: cancelled,  icon: XCircle,        color: "text-rose-600 bg-rose-50" },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
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

export default BookingStatsBar;
