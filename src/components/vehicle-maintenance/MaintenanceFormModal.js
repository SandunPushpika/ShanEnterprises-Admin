import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import { getVehicles } from "../../services/VehicelService";


const STATUSES = ["Under Maintenance", "Completed"];
const STATUS_UI_TO_API = {
    "Under Maintenance": 1,
    "Completed": 0,
};
const STATUS_API_TO_UI = {
    1: "Under Maintenance",
    0: "Completed",
    "UNDER_MAINTENANCE": "Under Maintenance",
    "COMPLETED": "Completed",
};

export default function MaintenanceFormModal({
    record,
    vehicles = [],
    onSave,
    onClose,
}) {
    const isEdit = !!record;

    const [vehicleOptions, setVehicleOptions] = useState(vehicles);
    const [vehicleId, setVehicleId] = useState("");
    const [maintenanceStart, setMaintenanceStart] = useState("");
    const [maintenanceEnd, setMaintenanceEnd] = useState("");

    const [cost, setCost] = useState("");
    const [status, setStatus] = useState(STATUSES[0]);
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const loadVehicles = async () => {
            try {
                const result = await getVehicles({
                    minPrice: 0,
                    maxPrice: 0,
                    typeId: 0,
                    status: null,
                    minPassengers: 0,
                    pageNumber: 1,
                    pageSize: 1000,
                });

                setVehicleOptions(result.data || []);
            } catch (err) {
                console.error("Failed to load vehicles for maintenance form:", err);
                setVehicleOptions(vehicles);
            }
        };

        loadVehicles();
    }, [vehicles]);

    const handleStartDateChange = (e) => {
        const val = e.target.value;
        setMaintenanceStart(val);
        if (maintenanceEnd && val && maintenanceEnd < val) {
            setMaintenanceEnd(val);
        }
    };

    useEffect(() => {
        if (record) {
            setVehicleId(record.vehicleId);
            setMaintenanceStart(record.maintenanceStart ? String(record.maintenanceStart).split("T")[0] : "");
            setMaintenanceEnd(record.maintenanceEnd ? String(record.maintenanceEnd).split("T")[0] : "");

            setCost(record.cost);
            setStatus(STATUS_API_TO_UI[record.status] ?? record.status ?? "Under Maintenance");
            setDescription(record.description || "");
        } else {
            const today = new Date().toISOString().split("T")[0];
            setMaintenanceStart(today);
            setMaintenanceEnd(today);
        }
    }, [record]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!vehicleId) {
            setError("Please select a vehicle.");
            return;
        }
        if (!maintenanceStart || !maintenanceEnd) {
            setError("Please select a maintenance period (from and to dates).");
            return;
        }
        if (maintenanceEnd < maintenanceStart) {
            setError("The maintenance end date cannot be before the start date.");
            return;
        }
        if (!cost || Number(cost) <= 0) {
            setError("Please enter a valid maintenance cost greater than 0.");
            return;
        }
        if (!description.trim()) {
            setError("Please enter a short description of the maintenance done.");
            return;
        }

        const payload = {
            ...(record || {}),
            vehicleId: Number(vehicleId),
            maintenanceStart,
            maintenanceEnd,
            cost: Number(cost),
            status: STATUS_UI_TO_API[status],
            description: description.trim(),
        };

        onSave(payload);
    };

    return (
        <Modal
            title={isEdit ? "Edit Maintenance Record" : "Add Maintenance Record"}
            subtitle={isEdit ? "Update the details for this maintenance log" : "Log a new service or repair details for a fleet vehicle"}
            onClose={onClose}
        >
            <form onSubmit={handleSubmit} className="space-y-10 p-10">
                {error && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl p-4 text-xs font-semibold">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Vehicle Select */}
                    <div>
                        <label className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5 block">
                            Vehicle *
                        </label>
                        <select
                            value={vehicleId}
                            onChange={(e) => setVehicleId(e.target.value)}
                            disabled={isEdit} // Disable editing the vehicle on an existing record to preserve history
                            className="w-full h-12 px-4 rounded-2xl border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-sm bg-white cursor-pointer disabled:bg-slate-50 disabled:cursor-not-allowed"
                        >
                            <option value="">Select a Vehicle</option>
                            {vehicleOptions.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.brand?.name} {v.model} ({v.registrationNumber})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date picker */}
                    <div>
                        <label className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5 block">
                            Maintenance Period *
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="date"
                                value={maintenanceStart}
                                onChange={handleStartDateChange}
                                aria-label="Maintenance start date"
                                className="w-1/2 h-12 px-4 rounded-2xl border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-sm transition"
                            />
                            <input
                                type="date"
                                value={maintenanceEnd}
                                min={maintenanceStart || undefined}
                                onChange={(e) => setMaintenanceEnd(e.target.value)}
                                aria-label="Maintenance end date"
                                className="w-1/2 h-12 px-4 rounded-2xl border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-sm transition"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* Cost Input */}
                    <div>
                        <label className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5 block">
                            Cost (LKR) *
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                            placeholder="e.g. 15000"
                            className="w-full h-12 px-4 rounded-2xl border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-sm transition"
                        />
                    </div>

                    {/* Status Select */}
                    <div>
                        <label className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5 block">
                            Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full h-12 px-4 rounded-2xl border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-sm bg-white cursor-pointer"
                        >
                            {STATUSES.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5 block">
                        Maintenance Description *
                    </label>
                    <textarea
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Detail the work carried out (e.g. replacement of rear brake pads)..."
                        className="w-full p-4 rounded-2xl border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-sm transition resize-none"
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-3 border-t border-border">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl border border-border text-secondary hover:bg-slate-50 font-semibold text-sm transition active:scale-[0.98]"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-cta-gradient text-white font-semibold text-sm shadow-glow hover:opacity-95 transition active:scale-[0.98]"
                    >
                        {isEdit ? "Save Changes" : "Add Record"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
