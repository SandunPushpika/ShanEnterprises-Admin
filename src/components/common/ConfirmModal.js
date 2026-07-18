import React from "react";
import { createPortal } from "react-dom";

function ConfirmModal({
    isOpen,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    onConfirm,
    onCancel,
    icon: Icon,
    variant = "primary", // "primary" | "success" | "danger" | "warning"
}) {
    if (!isOpen) return null;

    const variantStyles = {
        primary: {
            iconBg: "bg-blue-50 border-blue-100 text-blue-500",
            confirmBtn: "bg-blue-600 hover:bg-blue-700 text-white shadow-glow",
        },
        success: {
            iconBg: "bg-emerald-50 border-emerald-100 text-emerald-500",
            confirmBtn: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md",
        },
        danger: {
            iconBg: "bg-rose-50 border-rose-100 text-rose-500 animate-pulseSlow",
            confirmBtn: "bg-rose-600 hover:bg-rose-700 text-white shadow-md",
        },
        warning: {
            iconBg: "bg-amber-50 border-amber-100 text-amber-500",
            confirmBtn: "bg-amber-600 hover:bg-amber-700 text-white shadow-md",
        },
    };

    const styles = variantStyles[variant] || variantStyles.primary;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-secondary/40 backdrop-blur-sm transition-opacity"
                onClick={onCancel}
            />
            {/* Modal Box */}
            <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-glow p-8 text-center mx-4 animate-float">
                {Icon && (
                    <div className={`w-16 h-16 rounded-full border flex items-center justify-center mx-auto ${styles.iconBg}`}>
                        <Icon className="w-8 h-8" />
                    </div>
                )}
                
                <h3 className="text-xl font-bold text-secondary mt-5">{title}</h3>
                
                <p className="text-sm text-muted mt-2 leading-relaxed">
                    {message}
                </p>
                
                <div className="mt-8 flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 h-12 rounded-2xl border border-border text-secondary hover:bg-slate-50 font-semibold transition"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 h-12 rounded-2xl font-semibold transition ${styles.confirmBtn}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default ConfirmModal;
