import React, { useState, useMemo } from "react";
import { X, Search, Check, CarFront, Fuel, Users, Zap, CalendarOff } from "lucide-react";

const STATUS_STYLE = {
    Available: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Rented: "bg-amber-100  text-amber-700  border-amber-200",
    Maintenance: "bg-rose-100   text-rose-700   border-rose-200",
};

const brandLabel = (id = "") =>
    id.replace(/^brand_/, "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

function PickerCard({ vehicle, isSelected, onSelect, unavailable }) {
    return (
        <button
            type="button"
            onClick={() => !unavailable && onSelect(vehicle)}
            disabled={unavailable}
            className={`group relative w-full text-left rounded-2xl border-2 overflow-hidden transition-all duration-200 focus:outline-none
                ${unavailable
                    ? "border-border opacity-50 cursor-not-allowed"
                    : isSelected
                        ? "border-primary shadow-glow scale-[1.01]"
                        : "border-border hover:border-primary/40 hover:shadow-soft"
                }`}
        >
            <div className="relative h-36 bg-slate-100 overflow-hidden">
                {vehicle.mainImageUrl ? (
                    <img
                        src={vehicle.mainImageUrl}
                        alt={vehicle.model}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <CarFront className="w-12 h-12 text-muted/40 stroke-[1.5]" />
                    </div>
                )}

                {unavailable && (
                    <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center gap-1">
                        <CalendarOff className="w-7 h-7 text-white" />
                        <span className="text-white text-[10px] font-bold uppercase tracking-wide">Booked</span>
                    </div>
                )}

                <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLE[vehicle.status] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                    {vehicle.status}
                </span>

                {isSelected && !unavailable && (
                    <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow">
                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                    </div>
                )}
            </div>

            <div className="p-3 space-y-1 bg-white">
                <p className="text-[11px] font-semibold text-muted uppercase tracking-wider truncate">
                    {brandLabel(vehicle.brandId)}
                </p>
                <p className="font-bold text-secondary text-sm leading-tight truncate">{vehicle.model}</p>


                <div className="flex items-center gap-3 text-[11px] text-muted pt-0.5">
                    <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {vehicle.seatCapacity}
                    </span>
                    <span className="flex items-center gap-1">
                        <Fuel className="w-3 h-3" /> {vehicle.fuel}
                    </span>
                    <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3" /> {vehicle.transmission}
                    </span>
                </div>

                <p className="text-primary font-bold text-sm pt-0.5">
                    ${vehicle.dailyRentalPrice}
                    <span className="text-[11px] font-normal text-muted"> / day</span>
                </p>
            </div>
        </button>
    );
}

export default function VehiclePickerModal({
    vehicles = [],
    selectedName,
    pickupDatetime,
    returnDatetime,
    currentBookingId,
    onSelect,
    onClose,
}) {
    const [query, setQuery] = useState("");

    const bookedVehicleNames = useMemo(() => {
        if (!pickupDatetime || !returnDatetime) return new Set();
        const newStart = new Date(pickupDatetime);
        const newEnd = new Date(returnDatetime);
        if (isNaN(newStart) || isNaN(newEnd) || newEnd <= newStart) return new Set();

        let existingBookings = [];
        try {
            const saved = localStorage.getItem("shan_bookings_v1");
            existingBookings = saved ? JSON.parse(saved) : [];
        } catch { existingBookings = []; }

        const booked = new Set();
        existingBookings.forEach((b) => {
            if (b.booking_status === "CANCELLED") return;
            if (currentBookingId && b.id === currentBookingId) return;
            if (!b.vehicle_name || !b.pickup_datetime || !b.return_datetime) return;

            const bStart = new Date(b.pickup_datetime);
            const bEnd = new Date(b.return_datetime);
            if (newStart < bEnd && newEnd > bStart) {
                booked.add(b.vehicle_name);
            }
        });
        return booked;
    }, [pickupDatetime, returnDatetime, currentBookingId]);

    const datesSelected = !!(pickupDatetime && returnDatetime);

    const filtered = useMemo(() => {
        const q = query.toLowerCase().trim();
        if (!q) return vehicles;
        return vehicles.filter((v) =>
            [v.model, v.brandId, v.fuel, v.status, v.color, v.registrationNumber]
                .some((f) => f?.toLowerCase().includes(q))
        );
    }, [vehicles, query]);

    const availableCount = filtered.filter((v) => !bookedVehicleNames.has(v.model)).length;

    const handleSelect = (vehicle) => {
        onSelect(vehicle);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center">
            <div
                className="fixed inset-0 bg-secondary/50 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative z-10 w-full max-w-3xl bg-white rounded-3xl shadow-glow flex flex-col max-h-[88vh] overflow-hidden">

                <div className="px-6 py-5 border-b border-border flex items-center justify-between shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-secondary">Select a Vehicle</h3>
                        <p className="text-xs text-muted mt-0.5">
                            {datesSelected
                                ? <>
                                    <span className="text-emerald-600 font-semibold">{availableCount} available</span>
                                    {" "}&amp; {filtered.length - availableCount} booked for the selected period
                                </>
                                : <>{vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""} in fleet — select dates first to see availability</>}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted hover:text-secondary hover:bg-slate-50 transition"
                        aria-label="Close vehicle picker"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="px-6 py-4 border-b border-border shrink-0">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                        <input
                            type="text"
                            placeholder="Search by model, brand, fuel, status…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="overflow-y-auto p-6 flex-1">
                    {filtered.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {filtered.map((v) => (
                                <PickerCard
                                    key={v.id}
                                    vehicle={v}
                                    isSelected={selectedName === v.model}
                                    onSelect={handleSelect}
                                    unavailable={bookedVehicleNames.has(v.model)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <CarFront className="w-14 h-14 text-muted/30 mx-auto stroke-[1.5]" />
                            <p className="mt-4 font-semibold text-secondary">No vehicles match "{query}"</p>
                            <p className="text-xs text-muted mt-1">Try a different keyword</p>
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-border flex items-center justify-between shrink-0 bg-white">
                    <p className="text-xs text-muted">
                        {datesSelected
                            ? <><span className="text-emerald-600 font-semibold">{availableCount}</span> available · {filtered.length - availableCount} booked</>
                            : <>{filtered.length} result{filtered.length !== 1 ? "s" : ""} shown</>}
                    </p>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl border border-border text-secondary hover:bg-slate-50 font-semibold text-sm transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
