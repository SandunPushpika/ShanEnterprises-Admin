import React from "react";
import { Search, X } from "lucide-react";

const MONTHS = [
    { value: "ALL", label: "All Months" },
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
];



export default function MaintenanceFilters({
    vehicles = [],
    selectedVehicleId,
    setSelectedVehicleId,
    selectedMonth,
    setSelectedMonth,
    searchQuery,
    setSearchQuery,
}) {
    const handleClear = () => {
        setSearchQuery("");
        setSelectedVehicleId("ALL");
        setSelectedMonth("ALL");
    };

    const hasActiveFilters =
        searchQuery ||
        selectedVehicleId !== "ALL" ||
        selectedMonth !== "ALL";

    return (
        <div className="bg-card border border-border rounded-3xl p-6 shadow-card space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted/80" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search logs by description..."
                        className="w-full h-12 pl-12 pr-4 rounded-2xl border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-sm transition"
                    />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:w-2/5">
                    {/* Vehicle Filter */}
                    <div className="flex flex-col">
                        <select
                            value={selectedVehicleId}
                            onChange={(e) => setSelectedVehicleId(e.target.value)}
                            className="h-12 px-4 rounded-2xl border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-sm bg-white cursor-pointer"
                        >
                            <option value="ALL">All Vehicles</option>
                            {vehicles.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.brand?.name || "Vehicle"} {v.model} ({v.registrationNumber})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Month Filter */}
                    <div className="flex flex-col">
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="h-12 px-4 rounded-2xl border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-sm bg-white cursor-pointer"
                        >
                            {MONTHS.map((m) => (
                                <option key={m.value} value={m.value}>
                                    {m.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {hasActiveFilters && (
                <div className="flex justify-end pt-1">
                    <button
                        onClick={handleClear}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border hover:bg-slate-50 text-xs font-semibold text-muted transition active:scale-[0.98]"
                    >
                        <X className="w-3.5 h-3.5" />
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
}
