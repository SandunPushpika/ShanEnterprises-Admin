import React from "react";
import { AlertTriangle } from "lucide-react";
import { createPortal } from "react-dom";

export default function MaintenanceDeleteModal({ record, onConfirm, onCancel }) {
    if (!record) return null;

    const vehicleName = record.vehicleName 
        ? `${record.vehicleName} (${record.vehicleRegistrationNumber})` 
        : `Vehicle ID: ${record.vehicleId}`;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-secondary/40 backdrop-blur-sm"
                onClick={onCancel}
            />
            {/* Modal */}
            <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-glow p-8 text-center mx-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-500">
                    <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-secondary mt-5">Delete Maintenance Log?</h3>
                <p className="text-sm text-muted mt-2">
                    Are you sure you want to permanently delete the maintenance log for <strong>{vehicleName}</strong>?
                </p>
                
                <div className="mt-4 p-4 rounded-2xl bg-surface border border-border text-left space-y-2">

                    <p className="text-xs text-muted truncate">
                        <strong className="text-secondary">Details:</strong> {record.description}
                    </p>
                    <p className="text-xs text-muted">
                        <strong className="text-secondary">Cost:</strong> LKR {Number(record.cost || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                </div>

                <p className="text-xs text-rose-500 font-semibold mt-4">This action cannot be undone.</p>
                
                <div className="mt-6 flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 h-12 rounded-2xl border border-border text-secondary hover:bg-slate-50 font-semibold transition active:scale-[0.98]"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-md transition active:scale-[0.98]"
                    >
                        Yes, Delete
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
