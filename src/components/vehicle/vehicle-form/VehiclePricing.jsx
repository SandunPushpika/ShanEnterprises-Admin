import React from "react";
import { TRANSMISSION_TYPES, FUEL_TYPES } from "../../../utils/VehicleEnums";

export default function VehiclePricing({
    formData,
    errors,
    onFieldChange,
    Input,
    Select,
    Label,
}) {
    return (
        <section className="space-y-5">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-secondary">Pricing & Powertrain</h2>
                    <p className="text-sm text-muted">Daily rates, per kilometer fare, transmission, and fuel type.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="dailyRentalPrice" required>
                        Daily Rental Price (LKR)
                    </Label>
                    <Input
                        id="dailyRentalPrice"
                        name="dailyRentalPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="e.g. 150"
                        value={formData.dailyRentalPrice}
                        onChange={onFieldChange("dailyRentalPrice")}
                        error={errors.dailyRentalPrice}
                    />
                </div>
                <div>
                    <Label htmlFor="pricePerKm" required>
                        Price Per Km (LKR)
                    </Label>
                    <Input
                        id="pricePerKm"
                        name="pricePerKm"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="e.g. 1.20"
                        value={formData.pricePerKm}
                        onChange={onFieldChange("pricePerKm")}
                        error={errors.pricePerKm}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="transmission">Transmission</Label>
                    <Select
                        id="transmission"
                        name="transmission"
                        value={formData.transmission}
                        onChange={onFieldChange("transmission")}
                    >
                        <option value={TRANSMISSION_TYPES.MANUAL}>Manual</option>
                        <option value={TRANSMISSION_TYPES.AUTOMATIC}>Automatic</option>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="fuel">Fuel Type</Label>
                    <Select
                        id="fuel"
                        name="fuel"
                        value={formData.fuel}
                        onChange={onFieldChange("fuel")}
                    >
                        <option value={FUEL_TYPES.PETROL}>Petrol</option>
                        <option value={FUEL_TYPES.DIESEL}>Diesel</option>
                        <option value={FUEL_TYPES.HYBRID}>Hybrid</option>
                        <option value={FUEL_TYPES.ELECTRIC}>Electric</option>
                    </Select>
                </div>
            </div>
        </section>
    );
}
