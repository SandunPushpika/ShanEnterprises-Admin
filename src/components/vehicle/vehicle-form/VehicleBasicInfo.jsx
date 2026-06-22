import React from "react";

export default function VehicleBasicInfo({
    formData,
    errors,
    brands,
    types,
    onBrandChange,
    onTypeChange,
    onFieldChange,
    Input,
    Select,
    Label,
}) {
    return (
        <section className="space-y-5">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-secondary">Basic Information</h2>
                    <p className="text-sm text-muted">Vehicle make, model, type and registration details.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <Label htmlFor="brand" required>
                        Brand
                    </Label>
                    <Select
                        id="brand"
                        name="brandId"
                        value={formData.brandId}
                        onChange={onBrandChange}
                        error={errors.brand}
                    >
                        <option value="">Select Brand</option>
                        {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.name}
                            </option>
                        ))}
                    </Select>
                </div>
                <div>
                    <Label htmlFor="type" required>
                        Type
                    </Label>
                    <Select
                        id="type"
                        name="typeId"
                        value={formData.typeId}
                        onChange={onTypeChange}
                        error={errors.type}
                    >
                        <option value="">Select Type</option>
                        {types.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </Select>
                </div>
                <div>
                    <Label htmlFor="model" required>
                        Model
                    </Label>
                    <Input
                        id="model"
                        name="model"
                        type="text"
                        placeholder="e.g. Model S"
                        value={formData.model}
                        onChange={onFieldChange("model")}
                        error={errors.model}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="registrationNumber" required>
                        Registration Number
                    </Label>
                    <Input
                        id="registrationNumber"
                        name="registrationNumber"
                        type="text"
                        placeholder="e.g. WP CAA-1234"
                        value={formData.registrationNumber}
                        onChange={onFieldChange("registrationNumber")}
                        error={errors.registrationNumber}
                    />
                </div>
                <div>
                    <Label htmlFor="manufactureYear" required>
                        Manufacture Year
                    </Label>
                    <Input
                        id="manufactureYear"
                        name="manufactureYear"
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        placeholder="e.g. 2023"
                        value={formData.manufactureYear}
                        onChange={onFieldChange("manufactureYear")}
                        error={errors.manufactureYear}
                    />
                </div>
            </div>
        </section>
    );
}
