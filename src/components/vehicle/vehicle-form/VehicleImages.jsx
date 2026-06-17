import React from "react";
import ImageUploader from "../../common/ImageUploader";

export default function VehicleImages({
    images,
    error,
    onImageAdd,
    onImageRemove,
    Label,
}) {
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-secondary">Vehicle Images</h2>
                    <p className="text-sm text-muted">Upload up to 5 images. The first image becomes the main display image.</p>
                </div>
            </div>

            <div>
                <Label htmlFor="vehicle-images">Images</Label>
                <ImageUploader
                    previews={images}
                    onAdd={onImageAdd}
                    onRemove={onImageRemove}
                />
                {error && <p className="text-xs text-rose-500 mt-2">{error}</p>}
            </div>
        </section>
    );
}
