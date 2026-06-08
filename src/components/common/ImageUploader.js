import React, { useRef } from "react";
import { Plus, X, ImagePlus } from "lucide-react";

const MAX_IMAGES = 5;

function ImageUploader({ previews, onAdd, onRemove, maxImages = MAX_IMAGES }) {
    const inputRef = useRef(null);

    const handleFiles = (e) => {
        const files = Array.from(e.target.files);
        const remaining = maxImages - previews.length;
        const toProcess = files.slice(0, remaining);

        toProcess.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (ev) => onAdd(ev.target.result, file);
            reader.readAsDataURL(file);
        });

        e.target.value = "";
    };

    return (
        <div className="space-y-3">

            {previews.length < maxImages && (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="w-full flex flex-col items-center justify-center gap-2 h-28 rounded-2xl border-2 border-dashed border-border hover:border-primary hover:bg-primary-light/20 transition text-muted hover:text-primary"
                >
                    <ImagePlus className="w-7 h-7" />
                    <span className="text-sm font-medium">
                        Click to upload&nbsp;
                        <span className="text-muted font-normal">
                            ({previews.length}/{maxImages} images)
                        </span>
                    </span>
                    <span className="text-xs text-muted">PNG, JPG, WEBP – max {maxImages} images</span>
                </button>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFiles}
            />

            {previews.length > 0 && (
                <div className="grid grid-cols-5 gap-2">
                    {previews.map((src, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-border">
                            <img src={src} alt={`upload-${idx}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => onRemove(idx)}
                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                                aria-label="Remove image"
                                title="Remove image"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                            {idx === 0 && (
                                <span className="absolute bottom-1 left-1 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                                    Main
                                </span>
                            )}
                        </div>
                    ))}

                    {previews.length < maxImages && (
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary-light/20 flex items-center justify-center text-muted hover:text-primary transition"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default ImageUploader;
