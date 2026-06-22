import React from "react";
import VehicleBasicInfo from "./VehicleBasicInfo";
import VehiclePricing from "./VehiclePricing";
import VehicleFeatures from "./VehicleFeatures";
import VehicleImages from "./VehicleImages";
import useVehicleForm from "./useVehicleForm";

function Input({ error, className = "", ...props }) {
    return (
        <>
            <input
                {...props}
                className={`w-full rounded-xl border px-4 py-3 text-secondary transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${error ? "border-rose-500" : "border-border"} ${className}`}
            />
            {error && <p className="text-xs text-rose-500 mt-2">{error}</p>}
        </>
    );
}

function Select({ error, className = "", children, ...props }) {
    return (
        <>
            <select
                {...props}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-secondary transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${error ? "border-rose-500" : "border-border"} ${className}`}
            >
                {children}
            </select>
            {error && <p className="text-xs text-rose-500 mt-2">{error}</p>}
        </>
    );
}

function Label({ htmlFor, required, children }) {
    return (
        <label htmlFor={htmlFor} className="block text-sm font-semibold text-secondary-light mb-2">
            {children}
            {required && <span className="text-rose-500">*</span>}
        </label>
    );
}

export default function VehicleForm({ vehicle = null, onSave, onCancel, submitLabel = "Save Vehicle" }) {
    const {
        formData,
        errors,
        imagePreviews,
        lookup,
        isLookupLoading,
        lookupError,
        isSaving,
        submitError,
        handleBrandChange,
        handleTypeChange,
        handleFieldChange,
        handleToggleFeature,
        handleImageAdd,
        handleImageRemove,
        handleSubmit,
    } = useVehicleForm({ vehicle, onSave });

    return (
        <div className="flex h-full min-h-[560px] flex-col overflow-hidden rounded-3xl bg-white shadow-card">
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
                {isLookupLoading ? (
                    <div className="flex min-h-[300px] items-center justify-center">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                ) : lookupError ? (
                    <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
                        <p>{lookupError}</p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-4 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.keys(errors).length > 0 && (
                            <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                                <p className="font-semibold">Please fix the highlighted fields before continuing.</p>
                                <ul className="mt-3 list-disc space-y-1 pl-5">
                                    {Object.entries(errors).map(([key, value]) => (
                                        <li key={key}>{value}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <VehicleBasicInfo
                            formData={formData}
                            errors={errors}
                            brands={lookup.brands}
                            types={lookup.types}
                            onBrandChange={handleBrandChange}
                            onTypeChange={handleTypeChange}
                            onFieldChange={handleFieldChange}
                            Input={Input}
                            Select={Select}
                            Label={Label}
                        />
                        <VehiclePricing
                            formData={formData}
                            errors={errors}
                            onFieldChange={handleFieldChange}
                            Input={Input}
                            Select={Select}
                            Label={Label}
                        />
                        <VehicleFeatures
                            formData={formData}
                            errors={errors}
                            onFieldChange={handleFieldChange}
                            onToggleFeature={handleToggleFeature}
                            Input={Input}
                            Select={Select}
                            Label={Label}
                        />
                        <VehicleImages
                            images={imagePreviews}
                            error={errors.images}
                            onImageAdd={handleImageAdd}
                            onImageRemove={handleImageRemove}
                            Label={Label}
                        />
                    </div>
                )}
            </form>

            <div className="border-t border-border bg-surface px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                {submitError && <p className="text-sm text-rose-600">{submitError}</p>}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-xl border border-border bg-white px-5 py-3 text-sm font-semibold text-secondary transition hover:bg-slate-50"
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isSaving || isLookupLoading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSaving ? "Saving..." : submitLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
