import React from "react";
import { AlertTriangle } from "lucide-react";
import { createPortal } from "react-dom";

function DeleteConfirmModal({ vehicle, onConfirm, onCancel }) {
    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <div
                className="fixed inset-0 bg-secondary/40 backdrop-blur-sm"
                onClick={onCancel}
            />
            <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-glow p-8 text-center mx-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-500">
                    <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-secondary mt-5">Remove Vehicle?</h3>
                <p className="text-sm text-muted mt-2">
                    You are about to permanently delete&nbsp;
                    <strong>
                        {vehicle?.brandId?.replace(/_/g, " ").replace("brand ", "")} {vehicle?.model}
                    </strong>
                    &nbsp;({vehicle?.registrationNumber}). This action cannot be undone.
                </p>
                <div className="mt-8 flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 h-12 rounded-2xl border border-border text-secondary hover:bg-slate-50 font-semibold transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-md transition"
                    >
                        Yes, Delete
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default DeleteConfirmModal;