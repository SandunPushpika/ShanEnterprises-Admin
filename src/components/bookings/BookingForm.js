import React, { useState } from "react";
import { UserCheck, CarFront, User } from "lucide-react";
import VehiclePickerModal from "./VehiclePickerModal";
import DriverPickerModal from "./DriverPickerModal";

const Label = ({ children, required }) => (
    <label className="block text-sm font-semibold text-secondary-light mb-1">
        {children} {required && <span className="text-rose-500">*</span>}
    </label>
);

const Field = ({ error, ...props }) => (
    <>
        <input
            {...props}
            className={`w-full px-4 py-2.5 rounded-xl border ${error ? "border-rose-500" : "border-border"
                } focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition bg-white text-secondary`}
        />
        {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </>
);

const Select = ({ children, error, ...props }) => (
    <>
        <select
            {...props}
            className={`w-full px-4 py-2.5 rounded-xl border ${error ? "border-rose-500" : "border-border"
                } focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition bg-white text-secondary`}
        >
            {children}
        </select>
        {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </>
);

const Textarea = ({ error, ...props }) => (
    <>
        <textarea
            {...props}
            className={`w-full px-4 py-2.5 rounded-xl border ${error ? "border-rose-500" : "border-border"
                } focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition bg-white text-secondary resize-none`}
        />
        {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </>
);

const SectionTitle = ({ children }) => (
    <h4 className="text-xs font-bold text-muted uppercase tracking-widest pt-2 pb-1 border-b border-border">
        {children}
    </h4>
);

function BookingForm({ formData, setFormData, formErrors, onSubmit, onCancel, submitLabel, isEdit = false, drivers = [], vehicles = [] }) {
    const set = (field) => (e) =>
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));

    const setCheck = (field) => (e) =>
        setFormData((prev) => ({ ...prev, [field]: e.target.checked }));

    const todayMin = new Date().toISOString().slice(0, 16);


    const [showVehiclePicker, setShowVehiclePicker] = useState(false);
    const [showDriverPicker, setShowDriverPicker] = useState(false);

    return (
        <>
            <form id="booking-form" onSubmit={onSubmit} className="overflow-y-auto p-6 space-y-5 flex-1">



                <SectionTitle>Parties</SectionTitle>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label required>Customer Name</Label>
                        <Field
                            type="text"
                            placeholder="e.g. John Silva"
                            value={formData.customer_name}
                            onChange={set("customer_name")}
                            error={formErrors.customer_name}
                        />
                    </div>
                    <div>
                        <Label required>Vehicle</Label>
                        <>
                            <button
                                type="button"
                                onClick={() => setShowVehiclePicker(true)}
                                className={`w-full px-4 py-2.5 rounded-xl border ${formErrors.vehicle_name ? "border-rose-500" : "border-border"
                                    } bg-white text-sm flex items-center justify-between gap-2 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition group`}
                            >
                                <span className={`flex items-center gap-2 truncate ${formData.vehicle_name ? "text-secondary" : "text-muted"
                                    }`}>
                                    <CarFront className="w-4 h-4 shrink-0" />
                                    {formData.vehicle_name || "Choose a vehicle"}
                                </span>
                            </button>
                            {formErrors.vehicle_name && (
                                <p className="text-xs text-rose-500 mt-1">{formErrors.vehicle_name}</p>
                            )}
                        </>
                    </div>
                    <div>
                        <Label>Driver Name</Label>
                        <button
                            type="button"
                            onClick={() => setShowDriverPicker(true)}
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm flex items-center gap-2 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                        >
                            <User className="w-4 h-4 text-muted shrink-0" />
                            <span className={formData.driver_name ? "text-secondary" : "text-muted"}>
                                {formData.driver_name || "Choose a driver…"}
                            </span>
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold select-none ${formData.with_driver
                            ? "bg-primary text-white border-primary shadow-glow"
                            : "bg-surface text-secondary border-border"
                            }`}
                    >
                        <UserCheck className="w-4 h-4" />
                        {formData.with_driver ? "With Driver" : "No Driver"}
                    </div>
                </div>

                <SectionTitle>Locations</SectionTitle>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label required>Pickup Location</Label>
                        <Field
                            type="text"
                            placeholder="e.g. Colombo Fort, CMB"
                            value={formData.pickup_location}
                            onChange={set("pickup_location")}
                            error={formErrors.pickup_location}
                        />
                    </div>
                    <div>
                        <Label>Drop-off Location</Label>
                        <Field
                            type="text"
                            placeholder="e.g. Bandaranaike Airport"
                            value={formData.dropoff_location}
                            onChange={set("dropoff_location")}
                            error={formErrors.dropoff_location}
                        />
                    </div>
                </div>

                <SectionTitle>Schedule</SectionTitle>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label required>Pickup Date & Time</Label>
                        <Field
                            type="datetime-local"
                            min={todayMin}
                            value={formData.pickup_datetime}
                            onChange={set("pickup_datetime")}
                            error={formErrors.pickup_datetime}
                        />
                    </div>
                    <div>
                        <Label required>Return Date & Time</Label>
                        <Field
                            type="datetime-local"
                            min={todayMin}
                            value={formData.return_datetime}
                            onChange={set("return_datetime")}
                            error={formErrors.return_datetime}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>Rental Days</Label>
                        <Field
                            type="number"
                            min="1"
                            placeholder="Rental Days"
                            value={formData.rental_days}
                            onChange={set("rental_days")}
                            error={formErrors.rental_days}
                        />
                    </div>
                    <div>
                        <Label>Estimated Distance (km)</Label>
                        <Field
                            type="number"
                            step="0.01"
                            placeholder="e.g. 250.00"
                            value={formData.estimated_distance_km}
                            onChange={set("estimated_distance_km")}
                            error={formErrors.estimated_distance_km}
                        />
                    </div>
                </div>

                {isEdit && (
                    <>
                        <SectionTitle>Financials</SectionTitle>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <Label required>Base Rental ($)</Label>
                                <Field
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.base_rental_cost}
                                    onChange={set("base_rental_cost")}
                                    error={formErrors.base_rental_cost}
                                />
                            </div>
                            <div>
                                <Label>Driver Fee ($)</Label>
                                <Field
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.driver_fee}
                                    onChange={set("driver_fee")}
                                />
                            </div>
                            <div>
                                <Label>Tax ($)</Label>
                                <Field
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.tax_amount}
                                    onChange={set("tax_amount")}
                                />
                            </div>
                            <div>
                                <Label>Discount ($)</Label>
                                <Field
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.discount_amount}
                                    onChange={set("discount_amount")}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label required>Total Amount ($)</Label>
                                <Field
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.total_amount}
                                    onChange={set("total_amount")}
                                    error={formErrors.total_amount}
                                />
                            </div>
                        </div>
                    </>
                )}



                <SectionTitle>Additional Info</SectionTitle>

                <div>
                    <Label>Special Notes</Label>
                    <Textarea
                        rows={3}
                        placeholder="Any special requirements or instructions..."
                        value={formData.special_notes}
                        onChange={set("special_notes")}
                    />
                </div>
            </form>

            <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 bg-white shrink-0">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-5 py-2.5 rounded-xl border border-border text-secondary hover:bg-slate-50 font-semibold transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    form="booking-form"
                    className="px-6 py-2.5 rounded-xl bg-cta-gradient text-white font-semibold shadow-glow hover:opacity-95 transition"
                >
                    {submitLabel}
                </button>
            </div>

            {showVehiclePicker && (
                <VehiclePickerModal
                    vehicles={vehicles}
                    selectedName={formData.vehicle_name}
                    onSelect={(v) =>
                        setFormData((prev) => ({ ...prev, vehicle_name: v.model }))
                    }
                    onClose={() => setShowVehiclePicker(false)}
                />
            )}

            {showDriverPicker && (
                <DriverPickerModal
                    drivers={drivers}
                    selectedDriver={formData.driver_name}
                    onSelect={(d) =>
                        setFormData((prev) => ({
                            ...prev,
                            driver_name: d,
                            with_driver: d !== "",
                        }))
                    }
                    onClose={() => setShowDriverPicker(false)}
                />
            )}
        </>
    );
}

export default BookingForm;
