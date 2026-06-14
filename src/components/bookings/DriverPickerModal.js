import React, { useState, useMemo } from "react";
import { X, Search, Check, User, CalendarOff } from "lucide-react";

const AVATAR_COLORS = [
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-violet-500 to-purple-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-cyan-500 to-sky-600",
];

function initials(name = "") {
    return name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("");
}

function avatarColor(name = "") {
    let hash = 0;
    for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff;
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function DriverCard({ driver, isSelected, onSelect, unavailable }) {
    const color = avatarColor(driver);
    return (
        <button
            type="button"
            onClick={() => !unavailable && onSelect(driver)}
            disabled={unavailable}
            className={`group w-full text-left rounded-2xl border-2 p-4 flex flex-col items-center gap-3 transition-all duration-200 focus:outline-none
                ${unavailable
                    ? "border-border opacity-50 cursor-not-allowed bg-white"
                    : isSelected
                        ? "border-primary shadow-glow bg-primary/5 scale-[1.02]"
                        : "border-border bg-white hover:border-primary/40 hover:shadow-soft"
                }`}
        >
            <div className="relative">
                <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-xl font-bold shadow-md`}
                >
                    {initials(driver)}
                </div>

                {unavailable ? (
                    <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center" title="Booked">
                        <CalendarOff className="w-2.5 h-2.5 text-white" />
                    </span>
                ) : (
                    <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" title="Available" />
                )}

                {isSelected && !unavailable && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                )}
            </div>

            <div className="text-center">
                <p className={`font-semibold text-sm leading-tight ${isSelected && !unavailable ? "text-primary" : "text-secondary"}`}>
                    {driver}
                </p>
                <p className={`text-[11px] font-medium mt-0.5 ${unavailable ? "text-rose-500" : "text-emerald-600"}`}>
                    {unavailable ? "Booked" : "Available"}
                </p>
            </div>
        </button>
    );
}

export default function DriverPickerModal({
    drivers = [],
    selectedDriver,
    pickupDatetime,
    returnDatetime,
    currentBookingId,
    onSelect,
    onClose,
}) {
    const [query, setQuery] = useState("");

    const bookedDriverNames = useMemo(() => {
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
            if (!b.driver_name || !b.pickup_datetime || !b.return_datetime) return;

            const bStart = new Date(b.pickup_datetime);
            const bEnd = new Date(b.return_datetime);
            // Overlap check
            if (newStart < bEnd && newEnd > bStart) {
                booked.add(b.driver_name);
            }
        });
        return booked;
    }, [pickupDatetime, returnDatetime, currentBookingId]);

    const datesSelected = !!(pickupDatetime && returnDatetime);

    const filtered = useMemo(() => {
        const q = query.toLowerCase().trim();
        if (!q) return drivers;
        return drivers.filter((d) => d.toLowerCase().includes(q));
    }, [drivers, query]);

    const availableCount = filtered.filter((d) => !bookedDriverNames.has(d)).length;

    const handleSelect = (driver) => {
        onSelect(driver);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center">
            <div
                className="fixed inset-0 bg-secondary/50 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-glow flex flex-col max-h-[85vh] overflow-hidden">

                <div className="px-6 py-5 border-b border-border flex items-center justify-between shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-secondary">Assign a Driver</h3>
                        <p className="text-xs text-muted mt-0.5">
                            {datesSelected
                                ? <>
                                    <span className="text-emerald-600 font-semibold">{availableCount} available</span>
                                    {" "}& {filtered.length - availableCount} booked for the selected period
                                </>
                                : <>{drivers.length} driver{drivers.length !== 1 ? "s" : ""} — select dates first to see availability</>}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted hover:text-secondary hover:bg-slate-50 transition"
                        aria-label="Close driver picker"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="px-6 py-4 border-b border-border shrink-0">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                        <input
                            type="text"
                            placeholder="Search by driver name…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="overflow-y-auto p-6 flex-1">
                    <div className="mb-4">
                        <button
                            type="button"
                            onClick={() => { onSelect(""); onClose(); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all duration-200 focus:outline-none
                                ${selectedDriver === ""
                                    ? "border-primary bg-primary/5 shadow-glow"
                                    : "border-border bg-white hover:border-primary/40"
                                }`}
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                <User className="w-5 h-5 text-muted" />
                            </div>
                            <div className="text-left">
                                <p className={`font-semibold text-sm ${selectedDriver === "" ? "text-primary" : "text-secondary"}`}>
                                    No Driver
                                </p>
                                <p className="text-[11px] text-muted">No driver will be assigned</p>
                            </div>
                            {selectedDriver === "" && (
                                <Check className="w-4 h-4 text-primary ml-auto" strokeWidth={3} />
                            )}
                        </button>
                    </div>

                    {filtered.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {filtered.map((d) => (
                                <DriverCard
                                    key={d}
                                    driver={d}
                                    isSelected={selectedDriver === d}
                                    onSelect={handleSelect}
                                    unavailable={bookedDriverNames.has(d)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <User className="w-12 h-12 text-muted/30 mx-auto stroke-[1.5]" />
                            <p className="mt-4 font-semibold text-secondary">No drivers match "{query}"</p>
                            <p className="text-xs text-muted mt-1">Try a different name</p>
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-border flex items-center justify-between shrink-0 bg-white">
                    <p className="text-xs text-muted">
                        {datesSelected
                            ? <><span className="text-emerald-600 font-semibold">{availableCount}</span> available · {filtered.length - availableCount} booked</>
                            : <>{filtered.length} driver{filtered.length !== 1 ? "s" : ""} shown</>}
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
