import React from "react";
import { Edit2, Trash2, Fuel, Thermometer, Wifi, MapPin } from "lucide-react";
import { getTransmissionType } from "../../utilities/EnumHelper";

const STATUS_STYLES = {
    Available: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    Rented: "bg-amber-50 text-amber-700 border-amber-200/60",
    Maintenance: "bg-rose-50 text-rose-700 border-rose-200/60",
};

function VehicleCard({ vehicle, onEdit, onDelete }) {
    return (
        <div className="group bg-card border border-border rounded-3xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 flex flex-col">
            {/* Image Section */}
            <div className="h-52 w-full overflow-hidden relative bg-slate-100">
                <img
                    src={vehicle.mainImageUrl}
                    alt={vehicle.model}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span
                    className={`absolute top-4 right-4 px-3.5 py-1.5 rounded-full border text-xs font-bold shadow-sm ${STATUS_STYLES[vehicle.status] ?? STATUS_STYLES.Available
                        }`}
                >
                    {vehicle.status}
                </span>
                <span className="absolute bottom-4 left-4 bg-secondary/80 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-semibold">
                    {vehicle.type.name}
                </span>
            </div>

            {/* Content Section */}
            <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                    {/* Header with Brand/Model and Price */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-secondary tracking-tight">
                                {vehicle.brand.name} {vehicle.model}
                            </h3>
                            <p className="text-sm text-muted mt-0.5">
                                {vehicle.manufactureYear} · {vehicle.color}
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-black text-primary">${vehicle.dailyRentalPrice}</span>
                            <span className="text-xs font-medium text-muted block">/day</span>
                        </div>
                    </div>

                    {/* Specs Grid */}
                    <div className="mt-5 grid grid-cols-2 gap-y-2 gap-x-3 text-sm border-t border-border pt-4">
                        <div className="text-muted">
                            <span className="font-semibold text-secondary-light">Reg: </span>
                            {vehicle.registrationNumber}
                        </div>
                        <div className="text-muted flex items-center gap-1">
                            <Fuel className="w-3.5 h-3.5" /> {vehicle.fuel}
                        </div>
                        <div className="text-muted">
                            <span className="font-semibold text-secondary-light">Seats: </span>
                            {vehicle.seatCapacity}
                        </div>
                        <div className="text-muted">
                            <span className="font-semibold text-secondary-light">Luggage: </span>
                            {vehicle.luggageCapacity}
                        </div>
                        <div className="text-muted">
                            <span className="font-semibold text-secondary-light">Trans: </span>
                            {getTransmissionType(vehicle.transmission)}
                        </div>
                        <div className="text-muted">
                            <span className="font-semibold text-secondary-light">$/km: </span>
                            ${vehicle.pricePerKm}
                        </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1.5 mt-4">
                        {vehicle.airConditioned && (
                            <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full">
                                <Thermometer className="w-3 h-3" /> A/C
                            </span>
                        )}
                        {vehicle.hasBluetooth && (
                            <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 bg-purple-50 text-purple-600 rounded-full">
                                <Wifi className="w-3 h-3" /> Bluetooth
                            </span>
                        )}
                        {vehicle.hasGps && (
                            <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full">
                                <MapPin className="w-3 h-3" /> GPS
                            </span>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-4 border-t border-border flex items-center gap-3">
                    <button
                        onClick={() => onEdit(vehicle)}
                        className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl border border-border text-secondary hover:bg-slate-50 font-semibold transition"
                        aria-label={`Edit ${vehicle.model} details`}
                    >
                        <Edit2 className="w-4 h-4" />
                        Edit Details
                    </button>
                    <button
                        onClick={() => onDelete(vehicle)}
                        className="w-11 h-11 inline-flex items-center justify-center rounded-xl border border-rose-200/50 bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                        aria-label={`Delete ${vehicle.model}`}
                        title={`Delete ${vehicle.model}`}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VehicleCard;
