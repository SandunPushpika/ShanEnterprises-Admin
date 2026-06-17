import React from "react";

const FeatureToggle = ({ label, checked, onToggle }) => (
    <button
        type="button"
        onClick={onToggle}
        aria-pressed={checked}
        className={`inline-flex items-center justify-center rounded-2xl border px-4 py-2 text-sm font-semibold transition ${checked
            ? "bg-primary text-white border-primary shadow-glow"
            : "bg-surface text-secondary border-border hover:bg-slate-50"
        }`}
    >
        {label}
    </button>
);

export default function VehicleFeatures({
    formData,
    errors,
    onFieldChange,
    onToggleFeature,
    Input,
    Select,
    Label,
}) {
    return (
        <section className="space-y-5">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-secondary">Features & Status</h2>
                    <p className="text-sm text-muted">Vehicle features, description, and availability status.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <FeatureToggle
                    label="Air Conditioned"
                    checked={formData.airConditioned}
                    onToggle={() => onToggleFeature("airConditioned")}
                />
                <FeatureToggle
                    label="Bluetooth"
                    checked={formData.hasBluetooth}
                    onToggle={() => onToggleFeature("hasBluetooth")}
                />
                <FeatureToggle
                    label="GPS"
                    checked={formData.hasGps}
                    onToggle={() => onToggleFeature("hasGps")}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="seatCapacity" required>
                        Seat Capacity
                    </Label>
                    <Input
                        id="seatCapacity"
                        name="seatCapacity"
                        type="number"
                        min="1"
                        placeholder="e.g. 5"
                        value={formData.seatCapacity}
                        onChange={onFieldChange("seatCapacity")}
                        error={errors.seatCapacity}
                    />
                </div>
                <div>
                    <Label htmlFor="luggageCapacity" required>
                        Luggage Capacity
                    </Label>
                    <Input
                        id="luggageCapacity"
                        name="luggageCapacity"
                        type="number"
                        min="1"
                        placeholder="e.g. 3"
                        value={formData.luggageCapacity}
                        onChange={onFieldChange("luggageCapacity")}
                        error={errors.luggageCapacity}
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={onFieldChange("description")}
                        className="w-full rounded-xl border border-border bg-white px-4 py-3 text-secondary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                        placeholder="Short vehicle description..."
                    />
                </div>
            </div>
        </section>
    );
}
